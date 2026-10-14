"""Equipment observations with native FILE/AUDIOFILE inputs, UDFs and AI SQL.

Inputs: manifest.csv (document/audio rows) and assets.csv (equipment register).
Requires a Vane build with FILE-input ai_prompt and a matching Lance extension.
Models and credentials belong to the user's runtime environment.
"""
import json
import os
import re
from pathlib import Path

import lance
import vane
from vane import AudioFile
from faster_whisper import WhisperModel

UNITS = {"mm/s": 1, "m/s": 1000, "in/s": 25.4, "um/s": 0.001}


@vane.func(return_dtype="DOUBLE", name="vibration_mm_s")
def vibration_mm_s(text: str) -> float | None:
    text = (text or "").lower().replace("μ", "u").replace("µ", "u")
    match = re.search(r"([-+]?\d+(?:\.\d+)?)\s*(mm/s|m/s|in/s|um/s)", text)
    return round(float(match[1]) * UNITS[match[2]], 3) if match else None


@vane.cls(return_dtype="VARCHAR", name="transcribe_audio")
class SpeechRecognizer:
    def __init__(self, model_path: str):
        self.model = WhisperModel(model_path, device="cpu", compute_type="int8")

    def __call__(self, audio: AudioFile) -> str:
        with audio.to_tempfile() as source:
            segments, _ = self.model.transcribe(source.name, vad_filter=True)
            return json.dumps([
                {"text": s.text, "start": s.start, "end": s.end}
                for s in segments
            ])


SCHEMA = {
    "type": "object",
    "properties": {
        "event_time": {"type": ["string", "null"]},
        "measurement_text": {"type": ["string", "null"]},
        "failure_mode": {"type": ["string", "null"]},
        "recommended_action": {"type": ["string", "null"]},
        "severity": {"type": ["string", "null"], "enum": ["P1", "P2", "P3", "P4", None]},
        "confidence": {"type": "number", "minimum": 0, "maximum": 1},
        "evidence_text": {"type": ["string", "null"]},
    },
    "required": ["event_time", "measurement_text", "failure_mode", "recommended_action", "severity", "confidence", "evidence_text"],
    "additionalProperties": False,
}

PROMPT = """Extract equipment observations supported by this source. Leave unknowns null.
Use a timezone-qualified ISO 8601 event_time only when the source supplies it.
Retain the original measurement units and exact supporting words.
P1 means critical, P2 urgent, P3 routine, P4 informational; do not invent severity.
Confidence is a model assessment, not a business approval."""


def main():
    dataset_uri = str(Path(os.environ.get("VANE_OBSERVATIONS_PATH", "asset_observations.lance")).resolve())
    params = {
        "schema": json.dumps(SCHEMA), "prompt": PROMPT,
        "provider": os.environ["VANE_PROMPT_PROVIDER"],
        "model": os.environ["VANE_PROMPT_MODEL"],
        "embed_provider": os.environ["VANE_EMBEDDING_PROVIDER"],
        "embed_model": os.environ["VANE_EMBEDDING_MODEL"],
    }
    with vane.connect() as con:
        vane.attach_function(vibration_mm_s, connection=con,
                             alias="vibration_mm_s", parameters=["VARCHAR"])
        vane.attach_function(SpeechRecognizer(os.environ.get("VANE_ASR_MODEL", "small")),
                             connection=con, alias="transcribe_audio", parameters=["AUDIOFILE"])
        con.execute("CREATE VIEW manifest AS SELECT * FROM read_csv_auto('manifest.csv')")
        con.execute("CREATE VIEW equipment AS SELECT * FROM read_csv_auto('assets.csv')")
        # The manifest carries trusted business identifiers and source review state.
        docs = con.sql("""
            SELECT factory_id, asset_id, permission_scope, quality_status,
                   source_url, json_object('kind', 'file')::VARCHAR AS evidence_locator,
                   to_file(source_url) AS source_file
            FROM manifest WHERE source_kind = 'document'
        """)
        document_observations = con.sql("""
            SELECT factory_id, asset_id, permission_scope, quality_status,
                   source_url, evidence_locator,
                   ai_prompt($prompt, source_file, return_format := $schema,
                             provider := $provider, model := $model) AS observation
            FROM docs
        """, params={k: v for k, v in params.items() if not k.startswith("embed_")})
        segments = con.sql("""
            SELECT factory_id, asset_id, permission_scope, quality_status, source_url,
                   unnest(from_json(transcribe_audio(audio_file(source_url)),
                     '[{"text":"VARCHAR","start":"DOUBLE","end":"DOUBLE"}]')) AS segment
            FROM manifest WHERE source_kind = 'audio'
        """)
        audio_observations = con.sql("""
            SELECT factory_id, asset_id, permission_scope, quality_status, source_url,
                   json_object('kind','time','start',segment.start,'end',segment.end)::VARCHAR AS evidence_locator,
                   ai_prompt(concat($prompt, '\nSource: ', segment.text),
                             return_format := $schema, provider := $provider,
                             model := $model) AS observation
            FROM segments
        """, params={k: v for k, v in params.items() if not k.startswith("embed_")})
        observations = con.sql("SELECT * FROM document_observations UNION ALL SELECT * FROM audio_observations")
        normalized = con.sql("""
            SELECT factory_id, asset_id, permission_scope, quality_status,
                   source_url, evidence_locator, observation.* EXCLUDE (event_time),
                   try_cast(observation.event_time AS TIMESTAMPTZ) AS event_time,
                   vibration_mm_s(observation.measurement_text) AS vibration_velocity_mm_s,
                   concat_ws(' | ', observation.failure_mode,
                     observation.recommended_action, observation.evidence_text) AS search_text
            FROM observations
        """)
        result = con.sql("""
            SELECT *, ai_embed(search_text, provider := $embed_provider,
                model := $embed_model, dimensions := 1024) AS embedding
            FROM normalized
            WHERE confidence >= 0.80 AND asset_id IS NOT NULL
              AND event_time IS NOT NULL AND evidence_text IS NOT NULL
              AND severity IN ('P1','P2','P3','P4')
        """, params={k: v for k, v in params.items() if k.startswith("embed_")})
        table = result.fetch_arrow_table()
        if table.num_rows == 0:
            print("No supported observations passed the filter. Inspect the sources and model output.")
            return
        if Path(dataset_uri).exists():
            raise FileExistsError("Choose a new VANE_OBSERVATIONS_PATH for this standalone example.")
        dataset = lance.write_dataset(table, dataset_uri)
        dataset.create_scalar_index("search_text", "INVERTED")
        for column in ["factory_id", "permission_scope", "quality_status", "event_time", "severity"]:
            dataset.create_scalar_index(column, "BTREE")
        # Small samples use exact vector search; add an ANN index for larger datasets.
        con.execute("LOAD lance")
        query_text = os.environ.get("VANE_QUERY", "bearing wear and abnormal vibration")
        query_vector = con.sql("""
            SELECT ai_embed($text, provider := $embed_provider,
                model := $embed_model, dimensions := 1024)
        """, params={"text": query_text, **{k: v for k, v in params.items() if k.startswith("embed_")}}).fetchone()[0]
        factory, scope = os.environ["VANE_FACTORY_ID"], os.environ["VANE_PERMISSION_SCOPE"]
        eligible_assets = con.sql("""
            SELECT * FROM equipment WHERE factory_id = $factory AND permission_scope = $scope
        """, params={"factory": factory, "scope": scope})
        found = con.sql("""
            WITH events AS (
              SELECT * FROM lance_hybrid_search($dataset, 'embedding', $vector::FLOAT[1024],
                  'search_text', $text, k = 50, prefilter = true)
              WHERE factory_id = $factory AND permission_scope = $scope
                AND quality_status = 'approved'
                AND event_time >= current_date - INTERVAL '180 days'
                AND severity IN ('P1','P2')
            )
            SELECT a.asset_id, a.line_id, a.model, max(s._hybrid_score) AS match_score,
                list(struct_pack(event_time := s.event_time, evidence := s.evidence_text,
                    locator := s.evidence_locator, source_url := s.source_url,
                    action := s.recommended_action) ORDER BY s._hybrid_score DESC) AS ranked_evidence
            FROM eligible_assets a JOIN events s USING (asset_id)
            GROUP BY a.asset_id, a.line_id, a.model ORDER BY match_score DESC
        """, params={"dataset": dataset_uri, "vector": query_vector, "text": query_text,
                     "factory": factory, "scope": scope})
        found.show()
        found.write_parquet("equipment_evidence.parquet")


if __name__ == "__main__":
    main()
