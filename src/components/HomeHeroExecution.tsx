import CodeWindow from './CodeWindow'

const HERO_PIPELINE_CODE = `import vane
vane.configure(runner="ray")
con = vane.connect()

assets = con.sql("""
    SELECT asset_id, uri, media_type
    FROM read_parquet('s3://raw-assets/*.parquet')
    WHERE media_type IN ('image', 'video', 'audio')
""")

features = assets.map_batches(
    DecodeAndInfer,  # user UDF; 1 model load/actor
    schema=feature_schema,  # explicit user schema
    gpus=1,
    actor_number=4,
)

features.write_parquet("s3://model-ready/features/")`

export default function HomeHeroExecution() {
  return (
    <CodeWindow
      filename="multimodal_features.py"
      language="python"
      code={HERO_PIPELINE_CODE}
      showHeader={false}
    />
  )
}
