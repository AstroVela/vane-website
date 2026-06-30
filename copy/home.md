<!--
================================================================
  文案稿 · 首页 (Home)  —  src/pages/Home.tsx
================================================================
  编辑方法：
  • 只修改每个条目【正文】（ID 行下方的文字），不要改 `id` 行、标题(##)、注释。
  • 每个 `### \`id\`` 对应页面上一处文案；保留 id 不变，我据此回填到代码。
  • 多个短标签用列表（- ）逐项排列，请按行修改、不要增删行数/顺序。
  • 末尾“代码示例”里的代码可改注释/字符串，但请保持可运行的结构。
  • 改完把整个文件发回给我即可。
================================================================
-->

# 首页文案

## 1. Hero 英雄区

### `hero.eyebrow` — 顶部小标签
Vane

### `hero.h1` — 主标题
The Multimodal-Native AI Engine

### `hero.lead` — 副标题
Powering the AI learning and action loop with real-world data.

### `hero.btn.getStarted` — 按钮①（实心）
Get Started

### `hero.btn.useCases` — 按钮②
View use cases

### `hero.btn.benchmarks` — 按钮③
See benchmarks

### `hero.install` — 安装行（命令 · 标签 · 协议）
$ pip install vane-ai · pre-release · Apache-2.0

---

## 2. Use Cases 用例区

### `usecases.eyebrow` — 小标签
Use Cases

### `usecases.h2` — 标题
Four real-world AI workloads. One engine.

### `usecases.lead` — 副标题
From autonomous driving to enterprise agents, real-world AI runs on multimodal data. Pick the workload that's yours.

### `usecases.btn.all` — 右上角按钮
See all examples

#### 卡片① 自动驾驶（Available now）

### `usecases.card.training.title` — 标题
Autonomous Driving — Physical AI training data

### `usecases.card.training.status` — 状态徽章
Available now

### `usecases.card.training.summary` — 描述
Turn PB-scale multi-sensor drive logs into training-ready, traceable datasets — without a days-long, multi-system rerun.

### `usecases.card.training.cta` — 链接文字
Explore

#### 卡片② 企业多模态 Agent（Available now）

### `usecases.card.enterprise.title` — 标题
Enterprise Multimodal Agent

### `usecases.card.enterprise.status` — 状态徽章
Available now

### `usecases.card.enterprise.summary` — 描述
Turn always-on streams of docs, images, audio and calls into grounded, auditable facts your agents can act on — in SQL.

### `usecases.card.enterprise.cta` — 链接文字
Explore

#### 卡片③ 具身智能 RL（Coming soon）

### `usecases.card.embodied.title` — 标题
Embodied AI — RL post-training

### `usecases.card.embodied.status` — 状态徽章
Coming soon

### `usecases.card.embodied.summary` — 描述
Clean and re-score rollout trajectories and reward shards at training speed — and reproduce any run.

### `usecases.card.embodied.cta` — 链接文字
Join the waitlist

#### 卡片④ 边缘 AI Agent（Coming soon）

### `usecases.card.edge.title` — 标题
Edge AI Agent

### `usecases.card.edge.status` — 状态徽章
Coming soon

### `usecases.card.edge.summary` — 描述
Filter and preprocess multimodal data on the edge, with one semantics from device to cloud.

### `usecases.card.edge.cta` — 链接文字
Join the waitlist

---

## 3. Benchmarks 基准测试区

### `bench.eyebrow` — 小标签
Benchmarks

### `bench.h2` — 标题
Built for real batch inference workloads.

### `bench.lead` — 副标题
One credible number, fully reproducible — vLLM batch inference over 66K rows on 2 GPUs, measured against Ray Data and Daft.

#### 左卡片：核心数字

### `bench.stat.label` — 卡片小标题
vLLM batch inference · 66K rows · 2× A100

### `bench.stat.value` — 大数字
3.1×

### `bench.stat.caption` — 数字下方说明
throughput vs Ray Data, with prefix bucketing on identical hardware.

### `bench.matrix.label` — 矩阵小标题
Reproducible matrix

### `bench.matrix.items` — 三个对比项（逐行）
- ~20× vs Spark
- ~2× vs Daft
- ~1.2× vs Ray Data

### `bench.matrix.caption` — 矩阵下方说明
Image classification · document embedding · audio transcription · video object detection. Workload-dependent, fully reproducible.

### `bench.btn.full` — 按钮
Full benchmarks

#### 右卡片：吞吐量条形图

### `bench.chart.label` — 图表小标题
Throughput — vLLM batch inference (higher is better)

### `bench.chart.rows` — 三行（名称保持与数值对应，逐行）
- Vane — 3.1×
- Daft — 1.6×
- Ray Data — 1.0×

### `bench.chart.legend` — 图例（逐行）
- Vane
- baseline engines

### `bench.chart.footnote` — 脚注
66K rows · 2× A100 · prefix bucketing
⌥ AstroVela/vane

---

## 4. Platform 平台架构区

### `platform.eyebrow` — 小标签
Platform

### `platform.h2` — 标题
Data, agents, and RL on one always-on core.

### `platform.lead` — 副标题
The four workloads above run on one core. Vane senses the world, learns from it, and acts on it — unifying multimodal data processing, long-running agents and RL, from a laptop to a Ray cluster.

> 下面是架构示意图内部的文字标签（来自 src/components/PlatformArchitecture.tsx）

### `platform.loop` — 顶部循环标签
SENSE → LEARN → ACT ↺

### `platform.inputs.head` — 输入栏标题
Multimodal Inputs

### `platform.inputs` — 输入标签（8 个，逐行）
- Sensors
- Tables
- Documents
- Images
- Video
- Audio
- Events
- Embeddings

### `platform.vane.title` — 中间平台框标题
VANE

#### 支柱① Vane Data

### `platform.pillar.data.name` — 名称
Vane Data

### `platform.pillar.data.tagline` — 一句话
Multimodal data processing

### `platform.pillar.data.status` — 状态徽章
Available now

### `platform.pillar.data.caps` — 能力标签（逐行）
- Ingest
- Parse
- Transform
- Infer
- Enrich
- Package

#### 支柱② Vane Agent

### `platform.pillar.agent.name` — 名称
Vane Agent

### `platform.pillar.agent.tagline` — 一句话
Always-on agent framework

### `platform.pillar.agent.status` — 状态徽章
Coming soon

### `platform.pillar.agent.caps` — 能力标签（逐行）
- Observe
- Reason
- Act
- Memory
- Long-running Tasks

#### 支柱③ Vane RL

### `platform.pillar.rl.name` — 名称
Vane RL

### `platform.pillar.rl.tagline` — 一句话
RL for embodied AI

### `platform.pillar.rl.status` — 状态徽章
Coming soon

### `platform.pillar.rl.caps` — 能力标签（逐行）
- Rollout
- Trajectory
- Reward
- Training
- Evaluation

### `platform.outputs.head` — 输出栏标题
Outputs / Outcomes

### `platform.outputs` — 输出标签（4 个，逐行）
- Model-ready Multimodal Assets
- Grounded Context Packages
- Agent Actions & Recommendations
- Trajectory & Learning Updates

#### Vane Core 底部

### `platform.core.title` — 标题
Vane Core

### `platform.core.runtime` — 运行时标签（逐行）
- Local Runtime
- Ray Runtime

### `platform.core.feature.1.title` — 特性①标题
Unified Multimodal Data Type

### `platform.core.feature.1.copy` — 特性①描述
Sensors, metadata, lineage, and model artifacts under one execution semantics.

### `platform.core.feature.2.title` — 特性②标题
Streaming + Backpressure + Dynamic Batching

### `platform.core.feature.2.copy` — 特性②描述
Continuous flow for large objects with adaptive batching and pressure control.

### `platform.core.feature.3.title` — 特性③标题
Overlapped Heterogeneous Execution

### `platform.core.feature.3.copy` — 特性③描述
CPU, GPU, IO, and model inference overlap through asynchronous scheduling.

### `platform.core.feature.4.title` — 特性④标题
Edge-Cloud Coordination

### `platform.core.feature.4.copy` — 特性④描述
The same pipeline runs across local devices and Ray clusters.

---

## 5. Get Started 三步上手

### `start.step.1.title` — 步骤①标题
Install

### `start.step.1.copy` — 步骤①内容（代码样式）
pip install vane-ai

### `start.step.2.title` — 步骤②标题
Run an example

### `start.step.2.copy` — 步骤②内容
Start from the docs examples and adapt the pipeline to your data.

### `start.step.3.title` — 步骤③标题
Build your POC

### `start.step.3.copy` — 步骤③内容
Use the references and llms.txt files to wire Vane into your stack.

---

## 6. CTA 收尾区

### `cta.title` — 标题
Build your first multimodal AI pipeline with Vane.

### `cta.btn.docs` — 按钮①（实心）
Read the Docs

### `cta.btn.partner` — 按钮②
Become a design partner

---

## 7. Footer 页脚（首页版本，部分为全局共享）

### `footer.blurb` — 品牌简介（仅首页）
DuckDB-compatible pipelines for AI workloads. Run SQL, Python UDFs, embeddings, and model inference on Ray.

### `footer.install` — 安装行
$ pip install vane-ai

### `footer.col.product` — Product 列（标题 + 链接文字，逐行）
- Product
- Multimodal Data Pipeline
- Enterprise Multimodal Agent
- Benchmarks

### `footer.col.docs` — Docs 列（逐行）
- Docs
- Quickstart
- Guides
- Examples
- Contributing

### `footer.col.resources` — Resources 列（逐行）
- Resources
- Blog
- Release Notes

### `footer.col.community` — Community 列（逐行）
- Community
- GitHub ↗
- Discussions

### `footer.bottom` — 底部行（逐行）
- © 2026 Vane · Apache-2.0
- Built for engineers.

---

## 8. 代码示例（Hero 代码窗口 · multimodal.py）

> 可改注释/字符串文案，请保持代码结构可运行。

```python
import vane
from vane.ai import describe, embed

vane.configure(runner="ray")
media = vane.read("media/*")

media = describe(
    media,
    columns=["video", "audio", "text"],
    output="understanding",
    schema=["summary", "objects",
            "topics", "actions"],
)

media = embed(media, "understanding.summary")
media.write("ai_ready_media")
```
