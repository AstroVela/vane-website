# UDF and AI API Reference Restructure Design

## Context

The current `reference/udf-api` and `reference/ai-api` pages mix five different
content types in the same flow: surface selection, runnable examples, function
signatures, behavioral constraints, and execution-model explanation. Adjacent
unlabelled code blocks make a signature look like a second example, while some
examples rely on undefined objects such as `rel`, `con`, or a response model.

The result is not usable as a reference: readers cannot quickly answer what a
function accepts, what it returns, or which rules apply to that function.

## Goal

Make both pages strict API references. A reader landing on a function anchor
must be able to identify its signature, parameters, return value, data contract,
smallest complete call, and restrictions without reading unrelated sections.

Both pages use the same surface order:

1. SQL API
2. Expression API
3. Relation API

This order is a product/documentation decision and applies consistently to the
UDF and AI Function references.

## Content Boundaries

The reference pages own:

- public signatures and defaults;
- parameter and return-value definitions;
- input/output and cardinality contracts;
- API-specific placement, state, resource, credential, and failure rules;
- minimal complete examples that demonstrate call shape.

The reference pages do not own:

- task-oriented end-to-end workflows;
- long tutorials or production recipes;
- architectural motivation or internal execution implementation;
- internal `_duckdb` builders, payload details, or temporary API names.

Task guidance stays in Guides. Mental models and execution rationale stay in
Concepts. Each reference entry links to those pages instead of duplicating them.

## Standard Function Entry

Every public function uses the same template:

1. **Purpose** — one sentence defining when this function is the correct API.
2. **Signature** — a code block explicitly titled `Function signature` or
   `函数签名`.
3. **Parameters** — a table with name, accepted type, default/required status,
   and precise meaning.
4. **Returns** — the return object/type and output-column or cardinality shape.
5. **Data contract / behavior** — only behavior needed to call the function
   correctly.
6. **Minimal complete example** — a code block explicitly titled
   `Minimal example` or `最小完整示例`.
7. **Restrictions and errors** — unsupported placement, conflicting options,
   required schema, state, or resource rules specific to the function.
8. **Related guide** — one targeted link when longer task guidance exists.

Signature blocks and runnable examples are never adjacent without headings or
labels. A minimal example includes its required imports and defines every local
object it uses. When a type such as a Pydantic response model is required, the
example defines that type.

## UDF Reference Information Architecture

### 1. SQL API

- `vane.attach_function`
- `vane.detach_function`
- registered scalar, batch, actor-backed class, and instantiated stateful-class
  object contracts
- named-argument and replacement rules

`attach_function` and `detach_function` receive separate entries. The supported
registered-object matrix follows the function entries as an exact compatibility
table, not as tutorial prose.

### 2. Expression API

- helpers: `vane.col`, `vane.lit`, `vane.sql_expr`
- `vane.func`
- `vane.func.batch`
- `vane.cls`
- `vane.cls.batch`

`vane.func.batch` explicitly documents the data path:

```text
inputs mapping
  -> Arrow Table passed to fn (mapping keys become input column names)
  -> fn returns an Arrow Table
  -> schema declares exactly one returned column
  -> the expression contributes that column to SELECT
```

The entry explains `row_preserving=True` and `False` as two output contracts,
not merely two boolean values. Its complete example defines `rel`, imports
`vane` and `pyarrow`, shows the exact worker input columns, and shows the final
projection result.

`vane.cls` and `vane.cls.batch` are separate entries. Shared state-lifecycle
rules are summarized once after both definitions.

### 3. Relation API

- `rel.map_batches`
- `rel.flat_map`
- `rel.map`

These APIs currently appear only in the selection table; the restructured page
adds proper definitions so the page covers every surface it asks readers to
choose. Each entry states whether source columns are preserved automatically and
what its output schema/cardinality contract is.

### 4. Common UDF Rules

- supported expression/SQL output types;
- projection and short-circuit placement restrictions;
- row-preserving versus cardinality-changing behavior;
- state, failure, and external side-effect boundaries;
- Ray GPU requests versus local GPU visibility;
- relation `actor_number` versus AI provider `concurrency`.

These are compact reference tables or callouts. They do not repeat execution
architecture prose.

## AI Reference Information Architecture

### 1. SQL API

- `ai_prompt`
- `ai_embed`
- constant `STRUCT` option contract
- SQL credential-field rejection

The two SQL functions receive separate entries with independent parameter,
return-type, option, and example sections.

### 2. Expression API

- `vane.ai.prompt`
- `vane.ai.embed`

Each entry explicitly says that it produces one row-preserving projection
column and shows `.alias(...)`. Relation-only prompt parameters are listed in
the `vane.ai.prompt` restrictions rather than left for readers to infer from an
overload.

### 3. Relation API

- `rel.prompt`
- `rel.embed_text`
- `rel.classify_text`

Each function gets its full signature. The page states that relation helpers
return their configured output column instead of automatically retaining source
columns. Structured/multimodal prompt options remain attached to `rel.prompt`.

### 4. Provider Option Types

Typed option classes are documented as type definitions with exact fields and
defaults. Provider-level concurrency and request-level controls are separated.
Dictionary extension behavior remains documented without turning the section
into a provider tutorial.

### 5. Common AI Rules

- provider defaults by function;
- worker-side lazy provider instantiation;
- active-runner backend resolution for Expression and SQL AI;
- projection placement restrictions;
- retries, external effects, and non-exactly-once behavior;
- worker environment credential requirements.

## Bilingual Requirements

English and Chinese pages keep the same heading hierarchy, entry order, tables,
code, and technical meaning. Public identifiers remain unchanged. Chinese prose
may retain established terms such as Expression, projection, row-preserving,
actor-local, and query scope when translation would make the contract less
precise.

## Scope and Generated Content

Documentation prose changes are limited to the two reference pages and their
Chinese mirrors. Existing Guide and Concept pages may be linked but are not
reorganized in this pass. Supporting checks and generated files may change.
Docs Examples remain byte-for-byte unchanged.

After source pages are stable, regenerate `docs/manifest.json`, `docs/llms.txt`,
and `docs/llms-full.txt`.

## Verification

- Extend the API v2 content contract to enforce SQL → Expression → Relation
  heading order on both pages.
- Assert that signature and minimal-example labels are present.
- Assert that all required UDF and AI public functions have independent entries.
- Assert that the `vane.func.batch` entry explains `inputs`, the Arrow input
  table, one-column `schema`, and both `row_preserving` modes.
- Run docs lint, generated-content checks, API/content checks, lint, typecheck,
  and both-locale production build.
- Prove both excluded Examples trees have an empty diff.

## Acceptance Criteria

- A reader can tell whether a code block is a signature or an executable
  example before reading it.
- No minimal example contains an undefined `rel`, `con`, callable, schema, or
  response model.
- Every function entry answers purpose, inputs, return value, and restrictions
  in the same order.
- SQL API precedes Expression API, which precedes Relation API on both pages.
- `vane.func.batch` explains its Arrow data contract without requiring source
  inspection or a Guide.
- The pages remain reference material rather than becoming duplicate tutorials
  or implementation-design documents.
