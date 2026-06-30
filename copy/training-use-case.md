<!--
================================================================
  文案稿 · 用例页「自动驾驶 / 物理 AI」 — src/pages/TrainingUseCase.tsx
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

# 自动驾驶用例页文案

## 0. SEO / 分享元信息（不显示在页面正文，但影响搜索与分享卡片）

### `meta.title` — 浏览器标题
Training-data pipelines for autonomous driving & physical AI — Vane

### `meta.description` — 搜索描述
Turn PB-scale multi-sensor drive logs into training-ready datasets — faster, in far less code. Distributed multimodal processing and batch auto-labeling on Ray, with DuckDB-compatible SQL/Python.

### `meta.og.title` — 分享标题
Training-data pipelines for autonomous driving & physical AI — Vane

### `meta.og.description` — 分享描述
3.1x throughput vs Ray Data. Drive logs to training-ready releases with one distributed multimodal pipeline.

---

## 1. Hero 英雄区

### `hero.eyebrow` — 顶部小标签
Use Case · Autonomous Driving / Physical AI

### `hero.h1` — 主标题
From PB-scale drive logs to training-ready datasets.

### `hero.lead` — 副标题
Fleets and robots stream multi-sensor logs faster than any single data stack can process. Vane runs the whole pipeline — decode, align, auto-label, dedup, package — distributed on Ray, with the DuckDB-compatible Python API you already use.

### `hero.btn.benchmarks` — 按钮①（实心）
See benchmarks

### `hero.btn.run` — 按钮②
Run the pipeline

### `hero.install` — 安装行
$ pip install vane-ai · Apache-2.0

---

## 2. Why Vane 价值区

### `why.eyebrow` — 小标签
Why Vane

### `why.h2` — 标题
Faster pipelines, in far less code.

#### 优势卡片① 性能

### `why.perf.title` — 标题
Performance — higher throughput, fuller GPUs

### `why.perf.cost` — 痛点段落
Continuous PB/EB processing, offline auto-labeling and full historical recompute are all bottlenecked on throughput and GPU utilization. That's where the bill is.

### `why.perf.bullet.1.title` — 要点①标题
Efficient heterogeneous execution

### `why.perf.bullet.1.copy` — 要点①说明
overlap CPU decode, GPU inference and IO asynchronously, so GPUs stay fed.

### `why.perf.bullet.2.title` — 要点②标题
Streaming + backpressure + dynamic batching

### `why.perf.bullet.2.copy` — 要点②说明
push large sensor objects through continuously, no OOM.

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
Today the pipeline scatters SQL in one system, preprocessing in Python scripts, inference in separate Ray jobs, embeddings through glue code — images, audio and video each handled apart.

### `why.simple.bullet.1.title` — 要点①标题
One engine, one graph

### `why.simple.bullet.1.copy` — 要点①说明
DuckDB-compatible SQL + Python UDFs + AI functions + Ray execution, with a single output.

### `why.simple.bullet.2.title` — 要点②标题
DuckDB-compatible API

### `why.simple.bullet.2.copy` — 要点②说明
low migration cost from existing Ray, Spark, or Daft pipelines.

### `why.simple.bullet.3.title` — 要点③标题
The whole drive-log to release pipeline

### `why.simple.bullet.3.copy` — 要点③说明
fits in one readable code window without separate orchestration glue.

### `why.simple.cta` — 卡片底部链接
Read the code

---

## 3. Benchmark / Proof 证明区

### `proof.eyebrow` — 小标签
Proof · Performance

### `proof.h2` — 标题
Measured, and reproducible.

### `proof.lead` — 副标题
The headline benchmark is vLLM batch inference over 66K rows on 2x A100 with prefix bucketing. It is not a drive-log workload, but it tests the same bottleneck: keeping expensive GPUs fed.

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
Workload-dependent · fully reproducible. Use the benchmark scripts as the starting point, then rerun with your own sensor mix and auto-label model.

---

## 4. Code 代码区

### `code.eyebrow` — 小标签
Representative code

### `code.h2` — 标题
The release pipeline in one graph.

### `code.lead` — 副标题
SQL selection, GPU auto-label, dedup, embedding, and packaged output stay in one readable pipeline.

> 代码窗口本身见末尾“代码示例 · training_data_release.py”

---

## 5. Run it 运行区

### `run.eyebrow` — 小标签
Run it

### `run.h2` — 标题
Start with the training-data example.

### `run.lead` — 副标题
Install the pre-release, run the sample pipeline, then swap the sample manifest for your drive-log schema. It's the first example this page points teams to.

### `run.btn.open` — 按钮①（实心）
Open the example

### `run.btn.scripts` — 按钮②
Benchmark scripts

> 右侧 run.sh 代码见末尾“代码示例 · run.sh”

---

## 6. POC 区

### `poc.eyebrow` — 小标签
Do a POC

### `poc.h2` — 标题
Bring your sensor schema and your bill.

### `poc.lead` — 副标题
Point your code agent at our docs (llms.txt) and it'll scaffold a pipeline for your sensor schema. Curious whether Vane would cut your auto-label GPU bill? Bring your numbers — let's run the math together.

### `poc.btn.partner` — 按钮①（实心）
Become a design partner

### `poc.btn.llms` — 按钮②
Open llms.txt

---

## 7. CTA 收尾区

### `cta.title` — 标题
Running perception data at fleet scale? Let's make Vane fit your release pipeline.

### `cta.btn.partner` — 按钮①（实心）
Become a design partner

### `cta.btn.docs` — 按钮②
Read the docs

---

## 8. 页脚（与首页共享，非首页版本只显示这句简介）

### `footer.tagline` — 简介
The multimodal-native data engine for AI workloads.

---

## 9. 代码示例

> 可改注释/字符串文案，请保持代码结构可运行。

### Hero 代码窗口 · drive_release.py
```python
import vane
from vane.ai import detect, embed

vane.configure(runner="ray")
logs = vane.read("s3://drive-logs/*/frames/*")          # multi-sensor frames
labeled = detect(logs, columns=["camera", "lidar"],     # offboard auto-label model
                 model="perception-xl", num_gpus=1)
clean = labeled.dedup("scene_id").write("s3://release/v42/")
```

### Code 区代码窗口 · training_data_release.py
```python
import vane
from vane.ai import detect, embed

vane.configure(runner="ray")

frames = vane.sql("""
    SELECT log_id, ts, camera, lidar, calib
    FROM read_parquet('s3://drive-logs/*/frames/*.parquet')
    WHERE split = 'train'
""")

# 1) offboard auto-label as a GPU UDF, batched on Ray
labeled = detect(frames, columns=["camera", "lidar"],
                 model="perception-xl", num_gpus=1, batch_size=64)

# 2) dedup near-identical scenes, embed for retrieval/QC
unique = labeled.dedup("scene_id")
enriched = embed(unique, "camera", provider="transformers")

# 3) write the packaged dataset release
enriched.write_parquet("s3://release/v42/")
```

### Run it 代码窗口 · run.sh
```bash
pip install -i https://test.pypi.org/simple/ vane-ai
python -m vane_examples.training_data_pipeline

# runs the sample drive-log pipeline end-to-end on a single GPU
```
