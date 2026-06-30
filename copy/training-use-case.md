<!--
================================================================
  文案稿 · 用例页「多模态模型训练数据管道」 — src/pages/TrainingUseCase.tsx
  路由：/use-cases/training
================================================================
  编辑方法：
  • 只修改每个条目【正文】（ID 行下方的文字），不要改 `id` 行、标题(##)、注释。
  • 每个 `### \`id\`` 对应页面上一处文案；保留 id 不变，我据此回填到代码。
  • 列表（- ）请按行修改、不要增删行数/顺序。
  • 末尾“代码示例”里的代码可改注释/字符串，请保持结构可运行。
  • 改完把整个文件发回给我即可。
================================================================
-->

# 多模态模型训练用例页文案

## 0. SEO / 分享元信息（不显示在页面正文，但影响搜索与分享卡片）

### `meta.title` — 浏览器标题
Multimodal training data pipelines for AI models — Vane

### `meta.description` — 搜索描述
Prepare images, video, audio, documents, tables, and sensor logs for multimodal model training. Run filtering, captioning, embedding, deduplication, auto-labeling, and dataset release packaging in one Ray-backed pipeline.

### `meta.og.title` — 分享标题
Multimodal training data pipelines for AI models — Vane

### `meta.og.description` — 分享描述
3.1x batch inference throughput vs Ray Data. Raw multimodal data to training-ready releases with one distributed pipeline.

---

## 1. Hero 英雄区

### `hero.eyebrow` — 顶部小标签
Use Case · Multimodal Model Training

### `hero.h1` — 主标题
From raw multimodal data to training-ready dataset releases.

### `hero.lead` — 副标题
VLMs, video models, VLA models, and physical AI systems all depend on the same hard data work: select, decode, caption, label, embed, deduplicate, filter, and package multimodal data at training scale. Vane runs that pipeline as one Ray-backed graph.

### `hero.btn.benchmarks` — 按钮①（实心）
See benchmarks

### `hero.btn.run` — 按钮②
Run the pipeline

### `hero.install` — 安装行
$ pip install vane-ai · Apache-2.0

---

## 2. Data Factory 动图区

### `factory.eyebrow` — 小标签
Execution timeline

### `factory.h2` — 标题
Legacy queues. Vane keeps the graph occupied.

### `factory.lead` — 副标题
The same multimodal training-data pipeline runs on both sides. Legacy execution builds queues between stages; Vane streams media, batches dynamically, and keeps GPU work fed.

### `factory.ledger` — 顶部对比状态（逐行）
- Legacy · queue buildup · stage wait · GPU feed gap
- Vane · steady occupancy · streaming frames · balanced pipeline

### `factory.legacy.title` — 左侧标题
Legacy Pipeline

### `factory.vane.title` — 右侧标题
Vane Pipeline

---

## 3. Why Vane 价值区

### `why.eyebrow` — 小标签
Why Vane

### `why.h2` — 标题
Faster pipelines, in far less code.

#### 优势卡片① 性能

### `why.perf.title` — 标题
Performance — higher throughput, fuller GPUs

### `why.perf.cost` — 痛点段落
Training-scale multimodal data preparation, offline captioning, auto-labeling, quality scoring, embedding, deduplication, and historical reprocessing are all bottlenecked on throughput and GPU utilization. That's where the bill is.

### `why.perf.bullet.1.title` — 要点①标题
Efficient heterogeneous execution

### `why.perf.bullet.1.copy` — 要点①说明
overlap media decode, GPU captioning, auto-labeling, embedding, and IO asynchronously, so expensive accelerators stay fed.

### `why.perf.bullet.2.title` — 要点②标题
Streaming + backpressure + dynamic batching

### `why.perf.bullet.2.copy` — 要点②说明
push large media and sensor objects through continuously, no OOM.

### `why.perf.bullet.3.title` — 要点③标题
Distributed on Ray

### `why.perf.bullet.3.copy` — 要点③说明
re-run PB of history as one scalable graph, not a multi-system, multi-day job.

### `why.perf.cta` — 卡片底部链接
See the benchmarks

#### 优势卡片② 简洁

### `why.simple.title` — 标题
Simplicity — one engine, no glue code

### `why.simple.cost` — 痛点段落
Today the pipeline scatters file selection, media decoding, model inference, quality filters, embeddings, deduplication, and dataset packaging across separate jobs and glue code.

### `why.simple.bullet.1.title` — 要点①标题
One engine, one graph

### `why.simple.bullet.1.copy` — 要点①说明
DuckDB-compatible SQL + Python UDFs + AI functions + Ray execution, with a single output.

### `why.simple.bullet.2.title` — 要点②标题
DuckDB-compatible API

### `why.simple.bullet.2.copy` — 要点②说明
low migration cost from existing Ray, Spark, or Daft pipelines.

### `why.simple.bullet.3.title` — 要点③标题
The whole raw-data to release pipeline

### `why.simple.bullet.3.copy` — 要点③说明
fits in one readable code window without separate orchestration glue.

### `why.simple.cta` — 卡片底部链接
Read the code

---

## 4. Benchmark / Proof 证明区

### `proof.eyebrow` — 小标签
Proof · Performance

### `proof.h2` — 标题
Measured, and reproducible.

### `proof.lead` — 副标题
The headline benchmark measures the bottleneck many multimodal training pipelines hit first: high-throughput batch model inference for captioning, labeling, scoring, and embedding.

#### 左卡片：核心数字

### `proof.stat.label` — 卡片小标题
vLLM batch inference · 66K rows · 2x A100

### `proof.stat.value` — 大数字
3.1×

### `proof.stat.caption` — 说明
throughput vs Ray Data, with prefix bucketing on identical hardware.

### `proof.btn.full` — 按钮
Full benchmarks

#### 右卡片：可复现矩阵

### `proof.matrix.label` — 小标题
Reproducible public multimodal matrix

### `proof.matrix.1.value` — 第①格 数值
~20× Spark

### `proof.matrix.1.tag` — 第①格 场景
image classification

### `proof.matrix.2.value` — 第②格 数值
~2× Daft

### `proof.matrix.2.tag` — 第②格 场景
document embedding

### `proof.matrix.3.value` — 第③格 数值
~1.2× Ray Data

### `proof.matrix.3.tag` — 第③格 场景
audio and video workloads

### `proof.matrix.caption` — 矩阵下方说明
Workload-dependent · fully reproducible. Use the benchmark scripts as a starting point, then rerun with your own media mix, filters, and captioning or auto-label model.

---

## 5. Code 代码区

### `code.eyebrow` — 小标签
Representative code

### `code.h2` — 标题
The training-data release pipeline in one graph.

### `code.lead` — 副标题
File selection, media decoding, GPU captioning or auto-labeling, quality filters, deduplication, embedding, and packaged output stay in one readable pipeline. For Physical AI and VLA training, the same pipeline can read camera, lidar, trajectories, actions, calibration, and scene metadata.

> 代码窗口本身见末尾“代码示例 · training_data_release.py”

---

## 6. Run it 运行区

### `run.eyebrow` — 小标签
Run it

### `run.h2` — 标题
Start with the training-data example.

### `run.lead` — 副标题
Install the pre-release, run the sample multimodal training-data pipeline, then swap the sample manifest for your images, video, audio, documents, tables, or sensor logs.

### `run.btn.open` — 按钮①（实心）
Open the example

### `run.btn.scripts` — 按钮②
Benchmark scripts

> 右侧 run.sh 代码见末尾“代码示例 · run.sh”

---

## 7. POC 区

### `poc.eyebrow` — 小标签
Do a POC

### `poc.h2` — 标题
Estimate your training-data processing cost.

### `poc.lead` — 副标题
Point your code agent at our docs (llms.txt) and it'll scaffold a pipeline for your data schema. Curious whether Vane would lower your captioning, auto-labeling, or historical reprocessing bill? Bring your numbers — let's run the math together.

### `poc.btn.partner` — 按钮①（实心）
Become a design partner

### `poc.btn.llms` — 按钮②
Open llms.txt

---

## 8. CTA 收尾区

### `cta.title` — 标题
Preparing multimodal training data at scale? Let's make Vane fit your release pipeline.

### `cta.btn.partner` — 按钮①（实心）
Become a design partner

### `cta.btn.docs` — 按钮②
Read the docs

---

## 9. 页脚（与首页共享，非首页版本只显示这句简介）

### `footer.tagline` — 简介
The multimodal engine for AI pipelines and agents.

---

## 10. 代码示例

> 可改注释/字符串文案，请保持代码结构可运行。

### Hero 代码窗口 · training_release.py
```python
import vane
from vane.ai import describe, embed

vane.configure(runner="ray")
items = vane.read("s3://training-corpus/*")             # images, video, audio, docs, logs
labeled = describe(items, columns=["image", "video", "audio", "text"],
                   model="your-caption-or-label-model", num_gpus=1)
clean = labeled.dedup("content_hash").write("s3://dataset-releases/mm-v42/")
```

### Code 区代码窗口 · training_data_release.py
```python
import vane
from vane.ai import describe, embed

vane.configure(runner="ray")

items = vane.sql("""
    SELECT uri, media_type, text, metadata
    FROM read_files('s3://training-corpus/*')
    WHERE split = 'train'
""")

# 1) caption or auto-label as a GPU UDF, batched on Ray
labeled = describe(items, columns=["image", "video", "audio", "text"],
                   model="your-caption-or-label-model",
                   num_gpus=1, batch_size=64)

# 2) filter low-quality items, dedup, embed for retrieval/QC
filtered = labeled.filter("quality_score >= 0.8")
unique = filtered.dedup("content_hash")
enriched = embed(unique, "caption", provider="transformers")

# 3) write the packaged dataset release
enriched.write_parquet("s3://dataset-releases/mm-v42/")
```

### Run it 代码窗口 · run.sh
```bash
pip install -i https://test.pypi.org/simple/ vane-ai
python -m vane_examples.training_data_pipeline

# runs the sample multimodal training-data pipeline end-to-end on a single GPU
```
