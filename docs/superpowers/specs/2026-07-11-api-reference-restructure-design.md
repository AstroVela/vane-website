# SQL-First UDF and AI Documentation Restructure Design

## Context

The current UDF and AI documentation mixes API definitions, runnable examples,
task guidance, conceptual explanation, and execution internals. It also presents
SQL, Expression, and Relation as three parallel API surfaces. That model is
misleading and makes the reference pages hard to scan.

The public API is more accurately described along two semantic models:

1. **Expression API** — one typed output column produced through a projection.
   Its normal composable form is row-preserving. It has a SQL entry point and a
   Python entry point; the SQL entry point is the recommended default.
2. **Relation API** — table-shaped or specialized transformations. These are
   currently Python Relation methods.

SQL can produce the input relation for a Relation API call and consume its
output, but Vane does not currently expose a direct SQL table-function syntax
for cardinality-changing Relation UDFs or the structured/multimodal Relation AI
helpers. The documentation must not imply that such an API exists.

## Goals

- Present Expression API and Relation API as the two top-level API models.
- Make SQL Expression the first and most prominent path in Quickstart,
  Reference, Guides, and Concepts.
- Present Python Expression as the second entry point to the same row-preserving
  model.
- Use Relation API only when the task needs table reshaping, cardinality change,
  built-in chunking/classification, structured or multimodal prompting, or an
  explicit Relation execution backend.
- Give Reference, Guides, and Concepts non-overlapping responsibilities.
- Keep English and Chinese documents structurally equivalent.

## Non-Goals

- Do not create a nonexistent SQL Relation API.
- Do not force SQL Expression onto tasks whose required output contract is only
  supported by Relation API.
- Do not turn Concepts into API catalogs or Guides into signature references.
- Do not expose internal `_duckdb` builders, payload fields, optimizer details,
  or temporary names such as `vane.function`.
- Do not modify Docs Examples in this work.

## Canonical API Model

```text
Expression API (recommended)
├── SQL entry point (default)
│   ├── registered UDF aliases
│   ├── ai_prompt
│   └── ai_embed
└── Python entry point
    ├── vane.func / vane.func.batch
    ├── vane.cls / vane.cls.batch
    ├── vane.ai.prompt
    └── vane.ai.embed

Relation API (specialized table transformations)
├── rel.map_batches
├── rel.flat_map
├── rel.map
├── rel.prompt
├── rel.embed_text
└── rel.classify_text
```

The model is semantic, not merely syntactic:

- Expression API participates in projection and normally preserves one output
  row per input row. Python batch Expression with `row_preserving=False` is the
  explicit exception: it may change cardinality but must be the only top-level
  projection. SQL aliases remain row-preserving in v1.
- Relation API returns the relation shape defined by the callable/helper and may
  return only configured output columns or change cardinality.
- `vane.attach_function` and `vane.detach_function` are Python registration
  controls for the SQL Expression entry point; they are not a third API model.

## Document Responsibilities

### API Reference

Answers:

- What is the exact signature?
- Which parameters are required and what are their defaults?
- What does the call return?
- What placement, type, cardinality, resource, state, or credential restrictions
  apply?

Reference does not teach a complete workflow or explain architectural reasons.

### Guides

Answers:

- How do I complete a real task?
- What setup, data flow, validation, and output steps are required?
- When must the task move from SQL Expression to Python Expression or Relation?

Guides use complete task examples, with SQL Expression first whenever it can
represent the required contract.

### Concepts

Answers:

- Why are there Expression and Relation models?
- Why is SQL Expression the default entry point?
- How do SQL and Python Expression share execution semantics?
- Why do cardinality, state, provider lifecycle, and side effects impose the
  documented limits?

Concepts use only short illustrative snippets. They do not repeat parameter
tables or full tutorials.

## Reference Structure

Both reference pages begin with **Expression API**, with **SQL entry point**
before **Python entry point**, followed by **Relation API**.

Every public API receives the same entry template:

1. Purpose
2. Function signature
3. Parameters
4. Returns
5. Call behavior or data contract
6. Minimal complete example
7. Restrictions and errors
8. Related Guide or Concept link

No API receives a special documentation structure. Function-specific behavior
is documented inside the same standard template.

Signature blocks and runnable examples are explicitly titled. A minimal example
defines every import, connection, relation, callable, schema, and response model
that it uses.

### UDF Reference

#### Expression API — SQL entry point (recommended)

- `vane.attach_function`
- calling the registered alias in a SQL `SELECT`
- `vane.detach_function`
- registered-object compatibility matrix
- named-argument, replacement, and connection-ownership rules

#### Expression API — Python entry point

- `vane.col`
- `vane.lit`
- `vane.sql_expr`
- `vane.func`
- `vane.func.batch`
- `vane.cls`
- `vane.cls.batch`

#### Relation API

- `rel.map_batches`
- `rel.flat_map`
- `rel.map`

#### Shared UDF constraints

- supported Expression/SQL output types;
- projection and short-circuit placement;
- row-preserving and cardinality-changing contracts;
- state, actor failure, and external side effects;
- Ray GPU requests and local GPU visibility;
- Relation `actor_number` versus AI provider `concurrency`.

### AI Function Reference

#### Expression API — SQL entry point (recommended)

- `ai_prompt`
- `ai_embed`
- constant `STRUCT` options
- credential-field rejection

#### Expression API — Python entry point

- `vane.ai.prompt`
- `vane.ai.embed`

#### Relation API

- `rel.prompt`
- `rel.embed_text`
- `rel.classify_text`

#### Shared AI types and constraints

- typed Provider and request-option classes with exact fields/defaults;
- provider defaults by function;
- worker-side lazy Provider instantiation;
- active-runner backend resolution for SQL/Python Expression;
- projection placement;
- retries, external effects, and non-exactly-once behavior;
- worker environment credentials.

## Concepts Restructure

### `concepts/udfs`

- Introduce Expression and Relation as the only two top-level models.
- Explain SQL alias registration and SQL projection first.
- Explain Python Expression as the alternate entry point to the same
  row-preserving model.
- Explain Relation UDFs as the model for multi-column output and cardinality
  change.
- Explain shared execution, actor-backed reuse, and the narrower `vane.cls`
  mutable-state contract.

### `concepts/ai-functions`

- Begin with SQL `ai_prompt`/`ai_embed` as the default user model.
- Explain Python Expression and its equivalent row-preserving semantics.
- Explain why chunking, classification, structured/multimodal prompts, and an
  explicit Relation backend require Relation API.
- Explain Provider descriptors, lazy worker instantiation, credential flow, and
  external side-effect boundaries.

### Related Concepts

- `concepts/architecture`: order public surfaces and layers as SQL Expression,
  Python Expression, then Relation; describe the shared execution layer.
- `concepts/execution-model`: explain projection execution through SQL aliases
  and SQL AI first, then Python Expression, then Relation operators.
- `concepts/sql-vs-python`: explain that SQL and Python are two entry points to
  Expression API rather than mutually exclusive pipeline models; Relation API
  is the escape hatch for table-shaped work.

## Guides Restructure

### `guides/custom-python-udfs`

Primary workflow:

1. define a Python callable;
2. register it with `vane.attach_function`;
3. call the alias in a SQL `SELECT` pipeline;
4. validate and write the result.

Then show Python Expression as an alternate call form. Present Relation APIs
last for multi-column output, row expansion, complete table stages, actor-backed
models, and GPU resources.

### `guides/ai-functions`

Primary workflow uses SQL `ai_prompt` and `ai_embed` while retaining IDs and
source fields in the projection. Python Expression follows. Relation API is
used for structured/multimodal prompting, classification, built-in chunking,
and explicit Relation backend selection.

### `guides/embeddings-at-scale`

- Hosted/default path: SQL `ai_embed`.
- Python relation workflow: `vane.ai.embed` Expression.
- Specialized path: Relation `embed_text` for built-in chunking or other
  Relation-only controls; custom Relation UDFs for table-shaped preprocessing.

### `guides/gpu-inference`

- Basic vLLM batch prompt path: SQL `ai_prompt` with constant vLLM options.
- Python projection path: `vane.ai.prompt` Expression.
- Advanced path: Relation `prompt` for explicit backend/actor-pool controls and
  structured or multimodal input.

### Other Guides

Multimodal ingest/pipeline, structured transformation, and performance tuning
are not structurally rewritten. Only statements that directly contradict the
canonical two-model or SQL-first guidance are corrected.

## Quickstart Restructure

The Quickstart becomes the clearest recommended-path demonstration:

1. create a connection and source relation;
2. filter/select candidates with SQL;
3. define a small Python callable;
4. register it as a SQL alias with `vane.attach_function`;
5. call the alias in a SQL projection;
6. optionally call SQL `ai_prompt`;
7. validate and write the tabular result;
8. link to Relation API for tasks that need table reshaping.

Quickstart does not begin with `map_batches` or Python AI Expression when the
same task can be expressed through SQL Expression.

## Example Policy

- The first complete UDF/AI example on an affected page uses SQL Expression
  whenever that API can represent the required output contract.
- A custom-UDF SQL example includes callable definition, registration, and SQL
  invocation; it never references an undefined alias.
- Python Expression is explicitly labeled as the alternate Python entry point.
- A Relation example states the capability that requires Relation API.
- Reference examples are minimal complete calls; Guide examples are complete
  tasks; Concept snippets only illustrate a semantic point.
- Examples do not contain undefined `con`, `rel`, callable, schema, alias, or
  response-model names.
- SQL is not used to imitate nonexistent Relation functionality.

## Scope

English pages and their Chinese mirrors:

- `quickstart/quickstart`
- `reference/udf-api`
- `reference/ai-api`
- `concepts/udfs`
- `concepts/ai-functions`
- `concepts/architecture`
- `concepts/execution-model`
- `concepts/sql-vs-python`
- `guides/custom-python-udfs`
- `guides/ai-functions`
- `guides/embeddings-at-scale`
- `guides/gpu-inference`

Other Concept/Guide pages receive only targeted contradiction fixes. Marketing
pages and Docs Examples are outside this restructure.

After source content stabilizes, regenerate `docs/manifest.json`,
`docs/llms.txt`, and `docs/llms-full.txt`.

## Verification

- Extend the API v2 content contract to assert the canonical two-model language.
- Assert Expression API precedes Relation API on both Reference pages.
- Assert SQL entry point precedes Python entry point inside Expression sections.
- Assert every public Reference entry follows the shared template and no API is
  structurally singled out.
- Assert Quickstart and the primary UDF/AI Guides lead with SQL Expression calls.
- Assert SQL examples define required registrations/options and do not claim
  Relation-only capabilities.
- Assert English/Chinese heading and example order match.
- Run docs lint, generated-content checks, API/content checks, lint, typecheck,
  and both-locale production build.
- Prove the English and Chinese Docs Examples trees have an empty diff.

## Acceptance Criteria

- Readers see two API models, not three parallel surfaces.
- SQL Expression is visibly the recommended default in navigation flow, prose,
  and first examples.
- Python Expression is presented as the equivalent Python entry point.
- Relation API is presented as a specialized table-transformation model with
  honest capability boundaries.
- Reference, Guides, and Concepts each answer only their assigned questions.
- All public API entries receive the same documentation treatment.
- No complete example relies on undefined setup.
- Chinese and English content communicate the same hierarchy and contracts.
- Docs Examples remain byte-for-byte unchanged.
