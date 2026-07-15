# 首页 Hero 多模态执行透视窗设计

## 背景

首页 Hero 右侧目前展示一条 `Parquet → ai_embed → Parquet` 的文本 embedding
示例。它准确且容易阅读，但主要证明了 SQL 调用第三方 embedding provider 的便利性：

- 输入只有文本，没有形成多模态语境。
- 重计算发生在 provider 一侧，Vane 自身的执行性能不可见。
- `read_parquet`、SQL 和 `write_parquet` 与 DuckDB 等引擎的常见用法相似。
- Ray 只出现在代码外的补充说明中，CPU、GPU 和 I/O 的执行关系没有被展示。

因此，这段示例不能在 Hero 的短暂浏览时间内建立 Vane 的核心印象：高性能的
多模态原生处理能力。

## 目标

把 Hero 右侧从单纯的代码窗口改成“短代码 + 执行引擎透视窗”，让第一次访问者在
约五秒内依次看懂：

1. 图像、视频和音频记录进入同一条 Relation Pipeline。
2. Vane 把这条 Pipeline 作为一张执行图运行，让扫描、CPU 解码、GPU 推理和写入
   持续重叠，而不是拆成多个串行任务。
3. 这一执行形态由一段简短、真实的公开 API 代码表达，并能在 Ray 上使用多个 GPU
   actor 复用模型。

Hero 的核心论证链是：

```text
多模态 Relation
→ 一张统一执行图
→ CPU / GPU / I/O 异构重叠
→ 更高吞吐与更充分的 GPU 利用
```

## 非目标

- 不在 Hero 中解释 Vane 的完整 API 或展开 UDF 实现。
- 不增加 Local/Ray 交互切换；首屏聚焦 Ray 上的高性能执行。
- 不展示实时监控或连接真实运行时。
- 不展示未经同工作负载稳定验证的吞吐、GPU 利用率或批次数字。
- 不复用 `3.1× vLLM` 结果来证明多模态代码的性能，因为二者不是同一工作负载。
- 不改动 Hero 左侧的标题、说明、CTA 或页面后续区块。
- 不修改解决方案页和 Docs 示例。

## 方案选择

本设计采用“执行引擎透视窗”，而不采用以下两个独立方向：

- Local/Ray 同代码对照更适合证明部署一致性，但会弱化高性能多模态执行这一主线。
- Benchmark Receipt 能提供直接证据，但会把产品收窄到单个测试；当前多模态结果仍有
  experimental 项，不应承担 Hero 核心承诺。

后续若有与 Hero 示例严格匹配且已稳定的多模态 benchmark，可以在执行区加入一条
克制的可复现结果链接；本次不预留虚构指标。

## 信息架构与布局

右侧保持现有 `.home-hero-code` 的列宽和 Hero 页面结构，窗口内部只保留代码与执行图
两部分。代码使用紧凑排版控制高度；不显示终端标题栏或底部能力标签，避免右侧窗口
形成明显高于左侧内容的大块悬空区域：

```text
┌──────────────────────────────────────────────────────────────────────────┐
│  约 16 行 Vane Pipeline                                                 │
├──────────────────────────────────────────────────────────────────────────┤
│ One relation. Overlapped multimodal decode, GPU inference, and I/O.     │
│ IMG  VID  AUD                                                            │
│  ↓    ↓    ↓                                                             │
│ S3 SCAN → CPU DECODE → GPU INFER ×4 → PARQUET WRITE                     │
└──────────────────────────────────────────────────────────────────────────┘
```

信息优先级如下：

1. 多种模态进入同一条流水线。
2. CPU、GPU 和 I/O 属于一张持续流动的异构执行图。
3. 代码说明如何用 Vane API 表达这张图。

Hero 调用 `CodeWindow` 时关闭整个终端标题栏，因此不渲染文件名、
`RAY · 4 GPU ACTORS`、交通灯或复制按钮。执行区不再显示 `EXECUTION MODEL` 标签，
英文价值句在桌面宽度保持一行；窄屏允许自然换行，页面不得横向溢出。

## 代表性代码

内部源码标识保持 `multimodal_features.py`，代码使用当前公开的 SQL Relation、
`map_batches`、GPU actor 配置和 Parquet write API：

```python
import vane

vane.configure(runner="ray")
con = vane.connect()

assets = con.sql("""
    SELECT asset_id, uri, media_type
    FROM read_parquet('s3://raw-assets/*.parquet')
    WHERE media_type IN ('image', 'video', 'audio')
""")

features = assets.map_batches(
    DecodeAndInfer,        # model loaded once per actor
    schema=feature_schema,
    gpus=1,
    actor_number=4,
)

features.write_parquet("s3://model-ready/features/")
```

`DecodeAndInfer` 和 `feature_schema` 是用户提供的 Python/Arrow UDF 与显式输出 schema。
Hero 不展开它们的实现，避免让样板代码淹没执行形态；注释必须说明模型在 actor 内只
加载一次，避免把它误解为 Vane 内置模型或逐行初始化。

紧邻窗口的旧版 Local/Ray 说明删除。执行区或其无障碍说明使用以下价值句：

- 中文：`一条 Relation，让多模态解码、GPU 推理与 I/O 重叠执行。`
- 英文：`One relation. Overlapped multimodal decode, GPU inference, and I/O.`

## 执行模型可视化

执行图包含四个明确阶段：

| 阶段 | 标签 | 表达的能力 |
| --- | --- | --- |
| 输入扫描 | `S3 SCAN` / `I/O` | 多模态记录通过 URI 与元数据进入 Relation。 |
| 解码 | `CPU DECODE` | CPU worker 并行准备模型输入；不显示未由代码声明的并发数量。 |
| 推理 | `GPU INFER` / `4 ACTORS` | 四个 actor 各请求一块 GPU，并在批次间复用模型。 |
| 输出 | `PARQUET` / `WRITE` | 完成的批次持续流向表形输出。 |

执行图下方不再增加 `STREAMING`、`BACKPRESSURE` 或 `DYNAMIC BATCHING` 标签；性能
语义由同一 Relation、重叠阶段与流动批次共同表达。

动画使用一个缓慢、连续的 CSS/SVG 循环：

1. IMG、VID、AUD 标记进入扫描阶段。
2. 多个批次在 CPU decode lane 中交错推进。
3. 批次分配到四个 GPU actor lane；actor 本身保持常驻，不能出现每批重新加载模型的
   视觉暗示。
4. 完成批次立即流向 write，不等待整张图结束。
5. 上游在下游繁忙时短暂停顿，并保持有界队列，轻量表达 backpressure。

动画不逐行高亮代码。逐行高亮会暗示扫描、解码、推理和写入严格串行，与要表达的
异构重叠执行相冲突。

## 组件边界

新增一个首页专用组件，例如 `HomeHeroExecution.tsx`，负责：

- 双语执行标签和无障碍说明。
- 代表性代码及窗口状态元信息。
- 模态、阶段和 GPU actor lane 的静态结构。
- 仅由 CSS/SVG 驱动的流动动画。

为避免复制 `CodeWindow` 的标题栏、代码高亮和复制逻辑，可给 `CodeWindow` 增加两个
可选插槽：

- `showHeader`：默认开启；首页传入 `false`，其他消费者继续显示原有终端标题栏。
- `headerMeta`：供仍显示标题栏的消费者展示非实时元信息。
- `afterCode`：把执行模型面板放在同一个窗口边框内。

两个插槽默认不渲染，现有 Docs、解决方案页和其他营销页调用行为保持不变。
`Home.tsx` 只负责引入首页组件，不持有执行图内部 DOM。执行图当前没有第二个消费者，
因此不再拆分成通用图表系统。

## 数据与状态流

组件没有网络请求、运行时订阅或 JavaScript 定时状态。模态、阶段和 actor lane 使用
本地常量渲染；动画进度完全由 CSS 控制。这样可以保证：

- 首屏不因数据请求延迟或失败而出现空态。
- SSR 与 hydration 输出稳定。
- 执行模型不会被误解为真实遥测。
- 页面在 CSS 动画不可用时仍保留完整的静态信息。

首页关闭标题栏后不提供复制入口；其他 `CodeWindow` 消费者继续沿用当前复制行为与
Clipboard API 静默降级，不受本次调整影响。

## 视觉与动效约束

- 延续现有纸张色、低饱和代码主题、方框和单色线条，不引入仪表盘式高饱和配色。
- 绿色或强调色只用于少量流动批次和活跃 actor，不表示真实健康状态。
- 动画节奏缓慢，不能抢过 Hero 左侧标题和 CTA。
- 不做鼠标悬停后才能理解的关键内容。
- 不使用 canvas 或第三方图表库；DOM 与 SVG 足以表达固定拓扑。

## 响应式与无障碍

- 桌面端沿用当前 Hero 两列布局，代码区与执行区在同一窗口内上下排列。
- `900px` 以下沿用现有单列 Hero，窗口移动到主文案下方并取消顶部偏移。
- 更窄的窗口中，执行拓扑改为纵向或分两行排列；代码可在窗口内部横向滚动，但页面
  本身不得产生横向溢出。
- `prefers-reduced-motion: reduce` 下停止所有位移动画，展示已经连通的静态拓扑。
- 动画批次、装饰连线和 actor 活跃点设置为 `aria-hidden="true"`。
- 组件提供本地化的可访问文本，完整描述“图像、视频和音频记录经过扫描、CPU 解码、
  四个 GPU actor 推理和 Parquet 写入，并作为一张执行图重叠执行”。

## 内容真实性边界

- 不声称 Vane 提供通用的内置图像、音频或视频解码器。
- `DecodeAndInfer` 必须标明为用户 UDF；Vane 负责 Relation、批处理、schema、资源放置
  与执行调度。
- 不使用 `LIVE`、实时队列深度、rows/s、GPU utilization 或未经验证的 batch 数字。
- `CPU DECODE` 不显示并发数字，因为示例代码没有声明 CPU worker 数量。
- Hero 中的任何 benchmark 数字都必须来自同一代码路径、同一工作负载和已公开的可复现
  方法；在满足该条件前不增加数字。

## 检查与验证

### 内容契约

更新 `scripts/home-content-check.mjs`：

- 删除对首页 `ai_embed(` 的要求。
- 要求出现 `map_batches`、`gpus=1`、`actor_number=4` 和 `write_parquet`。
- 要求 image、video、audio 三种模态，以及 Ray runner 配置。
- 要求首页使用新的 Hero 执行组件。
- 要求 Hero 关闭标题栏，且不包含文件名、Ray 元信息、执行模型标题或底部能力标签。
- 单独读取新的 Hero 执行组件，防止其中出现 `running`、`LIVE`、`rows/s`、`92%`、
  `3.1×` 或 `1.9×`；首页后续现有 benchmark 区块不在这条限制内。

### 自动验证

- `npm run home:content:check`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

### 浏览器验证

- 英文和中文首页在桌面宽度下保持左右两列平衡，执行窗口不高于左侧内容形成的合理范围。
- `900px` 以下正确切换为单列。
- 常见手机宽度下页面无横向溢出，代码只在自己的容器内滚动。
- Hero 中不存在复制按钮；其他代码窗口的复制行为不回归。
- 默认动效能看出 CPU、GPU 和 write 同时有批次在途，不呈现严格串行。
- 减少动画模式下没有位移动画，所有阶段与关系仍可读。
- 键盘焦点、可访问名称和中英文说明完整。

## 验收标准

- 首屏右侧不再是可被普通 SQL/embedding 引擎轻易替代的 provider 示例。
- 不读完整代码也能识别 image、video、audio 和 CPU/GPU/I/O 执行链。
- 代码只使用当前公开 API，并明确区分用户 UDF 与 Vane 能力。
- 执行图清楚表达 GPU actor 复用和异构重叠执行，但不冒充实时监控或 benchmark。
- 现有首页结构、其他 `CodeWindow` 消费者和双语体验不发生回归。
