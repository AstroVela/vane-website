# 中文文档翻译优化 Review 报告

## 范围与方法

- 范围：`i18n/zh-CN/docusaurus-plugin-content-docs-data/current` 下 28 篇中文 MDX 文档。
- 方法：跳过 frontmatter、代码块、行内代码和链接 URL，只审阅正文、标题、表格可见文本中的英文保留情况。
- 注意：统计中的英文词不是全部都必须翻译；专有名词、API 名、环境变量、文件格式、产品名以及项目约定保留的核心术语可以保留。本报告关注的是“非核心术语直接沿用英文”和“英文短语结构直接嵌入中文”的问题。

## 总体结论

当前中文文档的翻译痕迹较重，问题不是个别词，而是成体系地保留了英文句法和未统一处理的英文短语。机械扫描中，排除常见专名后仍有约 3,600 个需要复核的英文词或英文短语；其中一部分属于应保留的项目核心术语，应从“翻译问题”中剔除。最集中的页面是：

- `guides/gpu-inference.mdx`
- `guides/custom-python-udfs.mdx`
- `concepts/architecture.mdx`
- `quickstart/what-is-vane-data.mdx`
- `concepts/execution-model.mdx`
- `guides/multimodal-ingest.mdx`

建议先统一“保留英文白名单”和“应中文化表达清单”，再分批改写。否则逐篇替换会造成同一个概念在不同页面里出现多种处理方式。

## 主要问题类型

### 1. 核心术语与普通词混在一起

以下词建议作为项目核心术语尽量保留英文，不再作为翻译问题本身处理：`UDF`、`AI Function`、`Ray actor`、`DuckDB`、`Arrow`、`pipeline`、`workflow`、`schema`、`provider`、`backend`、`runner`、`worker`、`driver`、`benchmark`、`embedding`、`batch`。

仍建议中文化的是这些核心术语周边的普通解释词，例如 `stage`、`row`、`column`、`model`、`output`、`input`、`source`、`downstream`、`concurrency`、`execution`、`retry`、`throughput`、`latency`、`resource placement`。

### 2. 英文短语结构直接嵌入中文

例如：

- `provider-backed operation`
- `relation-level UDF API`
- `table-shaped computation`
- `Ray-backed execution`
- `model-assisted structured review`
- `benchmark-specific file location`

这些不应只做单词替换，而应改成自然中文短语。

### 3. 标题、表头和段落风格不一致

同一类概念有的翻译、有的保留英文：

- `Pipeline Shape` / `Ingest Pattern` / `Runner` / `Batch Size`
- `Relation method` / `Provider 支持`
- `Local mode` / `Ray mode` / `Execution runner`

标题尤其影响整体观感。对白名单术语可保留英文，但标题里的非核心词应中文化或改成自然的中英混排。

### 4. 产品概念和通用概念边界不清

有些词应作为产品概念或项目核心术语保留，例如 `UDF`、`AI Function`、`Ray actor`、`DuckDB`、`Arrow`、`pipeline`、`workflow`、`schema`、`provider`、`backend`、`runner`、`worker`、`driver`、`benchmark`、`embedding`、`batch`。但很多周边普通词也一起保留了英文，例如 `source row`、`model loading`、`resource placement`、`execution controls`。

建议采用“首次出现中文解释 + 后续统一简称”的方式。

## 术语处理建议

| 当前常见英文 | 建议处理 | 备注 |
| --- | --- | --- |
| UDF | 保留英文 | 作为 API 与产品概念使用 |
| AI Function | 保留英文 | 不译为“AI 函数”，避免和普通函数混淆 |
| Ray actor | 保留英文 | Ray 语境下的 actor、actor pool 也建议保留 |
| DuckDB | 保留英文 | 产品名 |
| Arrow | 保留英文 | 数据格式 / 生态名 |
| pipeline | 保留英文 | 作为产品核心概念统一保留，不译为“流水线” |
| workflow | 保留英文 | 作为项目文档中的工作流概念统一保留 |
| schema | 保留英文 | 如 `output schema`、`input schema` |
| provider | 保留英文 | 如 AI provider、provider credential |
| backend | 保留英文 | 如 execution backend、actor backend |
| runner | 保留英文 | 如 Ray runner、native runner |
| worker | 保留英文 | 如 Ray worker |
| driver | 保留英文 | 如 query driver |
| benchmark | 保留英文 | 如 benchmark workload |
| embedding | 保留英文 | `embedding` / `embeddings` 建议统一为英文 |
| batch | 保留英文 | 如 batch size、batch inference |
| relation | 建议中文化或首次解释 | 若作为 Vane Relation 核心概念，可首次写“relation（关系对象）” |
| table-shaped | 表格形态的 | 不建议保留英文 |
| row | 行 | 代码字段名除外 |
| column | 列 | 代码字段名除外 |
| model | 模型 | 几乎都可翻译 |
| stage | 阶段 | 全站统一 |
| output | 输出 | `output schema` 中的 schema 保留英文 |
| input | 输入 | `input schema` 中的 schema 保留英文 |
| source | 源 / 来源 | source row -> 源行 |
| downstream | 下游 | downstream stage -> 下游阶段 |
| concurrency | 并发度 | |
| execution | 执行 | execution backend 中的 backend 保留英文 |
| distributed | 分布式 | |
| local | 本地 | |
| single-node | 单节点 | |
| native | 原生 | |
| function | 函数 | `AI Function` 除外 |
| method | 方法 | |
| class | 类 | |
| callable | 可调用对象 | callable class -> 可调用类 |
| task | 任务 | Ray API 名除外 |
| prompt | 提示词 | prompt column -> 提示词列 |
| label | 标签 | |
| inference | 推理 | |
| retry | 重试 | |
| rate limit | 速率限制 | |
| throughput | 吞吐量 | |
| latency | 延迟 | |
| memory | 内存 | |
| storage | 存储 | |
| credential | 凭证 | |
| endpoint | 端点 | |
| file/path/bytes | 文件 / 路径 / 字节 | bytes 在代码语境可保留 |
| metadata | 元数据 | |
| validation | 校验 | |
| transformation/transform | 转换 | |
| cleaning | 清洗 | |
| deduplication/dedup | 去重 | |
| sample | 样本 | |
| candidate | 候选 | |
| representative | 代表项 / 代表行 | |
| exact duplicate | 完全重复项 | |
| near duplicate | 近似重复项 | |
| chunk/chunking | 分块 / 切块 | 训练数据语境建议“文本分块” |
| structured | 结构化 | |
| review | 审查 / 审核 | 视业务场景统一 |
| audit | 审计 / 审核 | 避免与 review 混用 |

## 逐篇 Review

### `concepts/ai-functions.mdx` - 高优先级

- 问题：首段几乎是英文概念串直接嵌入中文，`AI Function`、`model operation`、`relation method`、`prompt response`、`table column`、`execution controls` 密集出现。
- 例子：第 5 行、第 7 行、第 19 行。
- 建议：保留 `AI Function`、`provider` 和 `embedding` / `embeddings`，但翻译周边解释词；例如 `model operation` 可写为“模型操作”，`structured response` 可写为“结构化响应”。

### `concepts/architecture.mdx` - 高优先级

- 问题：架构概念页是入口型文档，但第 5-16 行保留了大量基础词：`DuckDB-compatible`、`relation-level`、`pipeline`、`table-shaped`、`Execution runner`、`single-node job`、`UDF runtime`。
- 例子：第 5 行、第 14 行、第 15 行、第 81 行。
- 建议：标题和层级名应中文化，如“系统视图”“relation pipeline”“execution runner”“UDF 运行时”。保留 `pipeline`、`runner`、`DuckDB`，但将 `DuckDB-compatible SQL` 统一为“兼容 DuckDB 的 SQL”。

### `concepts/execution-model.mdx` - 高优先级

- 问题：核心模型页大量使用英文短语结构，如 `relation pipeline`、`table transformation`、`materialize`、`consumer`、`stage`、`boundary`。其中 `pipeline`、`worker` 可保留，但周边解释词需要中文化。
- 例子：第 5 行、第 36 行、第 100 行、第 127 行。
- 建议：把概念表达改成中文句式，例如“每一步都描述一次表格转换；只有在关系对象被显示、获取、转换或写出时才开始执行”。

### `concepts/sql-vs-python.mdx` - 中高优先级

- 问题：决策表和说明段落中保留 `relation workflow`、`model call`、`row expansion`、`provider-specific wrapper`、`resource placement`。
- 例子：第 5 行、第 7 行、第 90 行、第 159 行。
- 建议：保留 `workflow` 和 `provider`，但调整成自然中文短语，例如“relation workflow”“模型调用”“行展开”“provider-specific 封装”“资源放置/资源调度”。

### `concepts/udfs.mdx` - 高优先级

- 问题：UDF 概念页中 `backend`、`batch` 应保留英文，但 `class`、`callable`、`resource request`、`scalar`、`executor` 等周边概念未统一处理。
- 例子：第 5 行、第 40 行、第 141 行、第 169 行。
- 建议：保留 `UDF`、具体 API 名、`backend` 和 `batch`，但将其他正文概念统一为“类”“可调用对象”“资源请求”“标量”等。

### `contributing/development.mdx` - 低优先级

- 问题：主要是开发术语和章节标题未统一，如 `Editable build`、`Source area`、`Root formatter`、`submodule command`、`Benchmark workload`。
- 例子：第 38 行、第 66 行、第 90 行。
- 建议：`benchmark` 保留英文；其他可改为“可编辑构建”“源码区域”“根目录格式化器”“子模块命令”“benchmark workload”。

### `deploy/ray-cluster.mdx` - 中优先级

- 问题：Ray 专名、`runner`、`worker` 可以保留，但 `environment variable`、`downstream stage`、`source row`、`shutdown method` 等周边短语应中文化。
- 例子：第 25 行、第 67 行、第 79 行、第 93 行。
- 建议：统一为 `Ray runner`、`worker environment`、“环境变量”“下游阶段”“源行”“关闭方法”。

### `deploy/single-node.mdx` - 中优先级

- 问题：`Single-node mode`、`single-node script`、`connection`、`local execution`、`actor model` 等可以中文化；`runner`、`batch` 建议保留英文。
- 例子：第 5 行、第 9 行、第 48 行、第 83 行。
- 建议：改为“单节点模式”“单节点脚本”“连接”“本地执行”“本地 Actor 模型”“native runner batch size”。

### `deploy/sizing.mdx` - 中优先级

- 问题：`sizing`、`data volume`、`UDF cost`、`model resource`、`scheduling overhead` 等英文直接出现；`provider` 按白名单保留。
- 例子：第 5 行、第 61 行、第 112 行。
- 建议：标题和正文统一用“容量规划/规模估算”“数据量”“UDF 成本”“模型资源”“调度开销”“provider limit”。

### `examples/_template.mdx` - 低优先级

- 问题：模板页短，但 `example page`、`input/output contract`、`script` 可中文化；`workflow` 按白名单保留。
- 例子：第 5 行、第 9 行。
- 建议：改为“示例页”、`workflow`、“输入/输出约定”“脚本”。

### `examples/index.mdx` - 中优先级

- 问题：示例名称和表格描述中英文过密，如 `Training data pipeline`、`duplicate-removal pattern`、`SQL-first document check`、`structured compliance prompt`、`lakehouse handoff`。
- 例子：第 13-16 行。
- 建议：示例标题可以保留英文链接文本；中文描述中保留 `pipeline`、`embedding`、`provider`，其他可改为“去重模式”“SQL 优先的文档检查”“结构化合规提示词”“湖仓交接”。

### `examples/insurance-document-audit.mdx` - 中优先级

- 问题：业务词和技术词混排，`insurance document review`、`model-assisted structured review`、`policy-system extraction`、`legal advice`、`claims policy`、`insurance ontology`。
- 例子：第 5 行、第 7 行、第 58 行、第 104 行。
- 建议：改为“保险文档审查”“模型辅助的结构化审查”“保单系统抽取”“法律建议”“理赔政策”“保险本体”。

### `examples/multimodal-data-lake.mdx` - 中高优先级

- 问题：`lakehouse`、`warehouse handoff` 可能可保留或半翻译，但 `source row`、`media path`、`curated table output`、`Vane-specific`、`snapshot semantics` 应中文化。
- 例子：第 7 行、第 17 行、第 92 行。
- 建议：将正文改成“源行”“媒体路径”“整理后的表输出”“Vane 专用”“快照语义”。`lakehouse` 可统一译为“湖仓”。

### `examples/tender-compliance-check.mdx` - 中优先级

- 问题：`tender document`、`checklist`、`review`、`sample`、`audit`、`structured compliance result`、`legal advice` 等可翻译。
- 例子：第 7 行、第 11 行、第 134 行。
- 建议：改为“招标文件”“检查清单”“审查”“抽样”“审计”“结构化合规结果”“法律建议”。

### `examples/training-data-pipeline.mdx` - 中优先级

- 问题：`retrieval data`、`raw record`、`chunking`、`duplicate`、`curated dataset`、`training-data quality framework`；`embedding` / `embeddings` 按白名单保留。
- 例子：第 15 行、第 92 行、第 142 行。
- 建议：统一为“检索数据”“原始记录”“分块”、`embedding` / `embeddings`、“重复项”“整理后的数据集”“训练数据质量框架”。

### `guides/ai-functions.mdx` - 高优先级

- 问题：开头和相关文档段落英文密度很高，`text classification`、`prompting`、`model loading`、`per-row error column` 等可中文化；`embedding`、`embeddings`、`batch` 按白名单保留。
- 例子：第 7 行、第 200 行、第 215 行。
- 建议：将任务类型整理为 `embedding`、“文本分类”“提示词调用”、`GPU-backed batch prompting`、“模型加载”“逐行错误列”。

### `guides/custom-python-udfs.mdx` - 最高优先级

- 问题：候选英文词最多之一；`Custom Python UDF` 可作为标题保留，正文中的 `pipeline`、`output schema`、`backend`、`batch` 也按白名单保留；`library`、`rule`、`media processing`、`model preprocessing`、`private client`、`callable` 等仍应中文化。
- 例子：第 5 行、第 400 行、第 431 行。
- 建议：优先整体重写开头、UDF 类型表和输出契约部分。代码名和白名单术语保留，说明文字改成“外部库”“自定义规则”“媒体处理”“模型预处理”“私有客户端”“可调用对象”等。

### `guides/embeddings-at-scale.mdx` - 高优先级

- 问题：`embedding pipeline`、`provider` 按白名单保留，但 `source row`、`chunk`、`helper output`、`row count`、`ordering` 等混用明显。
- 例子：第 1 行、第 89 行、第 107 行、第 147 行。
- 建议：保留 `embedding` 和 `provider`；`chunk` 统一为“分块”；`provider rate limit` 可保留 `provider`，写作 `provider` 速率限制。

### `guides/gpu-inference.mdx` - 最高优先级

- 问题：英文密度最高；`batch`、`actor` / `Ray actor` 可保留，但 `interactive chat request`、`shared pool reuse`、`inflight tracking`、`load awareness`、`custom tokenizer` 等大量短语未中文化。
- 例子：第 5 行、第 173 行、第 228 行、第 292 行。
- 建议：保留 `vLLM`、`Ray`、`batch`、`actor` / `Ray actor` 和具体 API 名；正文可统一为 `batch` 提示词推理、“交互式聊天请求”、`actor pool`、“共享池复用”“进行中请求跟踪”“负载感知”“自定义分词器”。

### `guides/multimodal-ingest.mdx` - 高优先级

- 问题：首段保留 `multimodal record`、`table row`、`Path`、`bytes`、`decoded feature`、`model output`、`column`、`relation`，后文还有 `decoding`、`feature extraction`、`model inference`。
- 例子：第 5 行、第 7 行、第 161 行。
- 建议：改为“多模态记录”“表行”“路径”“字节”“解码后的特征”“模型输出”“列”“关系对象”“解码”“特征提取”“模型推理”。

### `guides/multimodal-pipeline.mdx` - 高优先级

- 问题：`SQL-first multimodal data preparation pattern`、`metadata filtering`、`media-specific step`、`inspection`、`curated output` 等翻译痕迹明显。
- 例子：第 5 行、第 19 行、第 145 行。
- 建议：改为“SQL 优先的多模态数据准备模式”“元数据过滤”“媒体专用步骤”“检查”“整理后的输出”。

### `guides/performance-tuning.mdx` - 中高优先级

- 问题：性能页英文词很多，`Runner`、`Batch Size`、`record batch`、`logical plan`、`query driver`、`benchmark-specific file location`、`deployment default`。
- 例子：第 21 行、第 94 行、第 123 行。
- 建议：标题和正文中保留 `runner`、`batch size`、`driver`、`benchmark`；其他可改为“记录 batch”“逻辑计划”“query driver”“benchmark 专用文件位置”“部署默认值”。

### `guides/structured-data-load.mdx` - 中优先级

- 问题：第 5 行英文词簇过密，`multimodal workflow`、`table-shaped input`、`media manifest`、`document metadata`、`text record`、`prompt table`、`evaluation sample`。
- 例子：第 5 行、第 41 行、第 53 行。
- 建议：保留 `workflow`；其他改为“多模态 workflow”“表格形态输入”“媒体清单”“文档元数据”“文本记录”“提示词表”“评估样本”。`glob` 可保留，但需首次解释为“通配路径”。

### `guides/structured-transformation.mdx` - 高优先级

- 问题：`pipeline` 按白名单保留，但 `filtering`、`text processing`、`deduplication`、`cleaning`、`relation management`、`write path`、`deterministic signature function` 等未中文化。
- 例子：第 5 行、第 7 行、第 143 行。
- 建议：保留 `pipeline`，其他统一为“过滤”“文本处理”“去重”“清洗”“关系对象管理”“写出路径”“确定性的签名函数”。

### `index.mdx` - 低优先级

- 问题：正文整体较好，主要是链接标题保留英文，如 `Quickstart`、`Custom Python UDFs`、`Embeddings at Scale`、`Single-node deployment`。
- 例子：第 21-36 行、第 43 行。
- 建议：如果导航标题允许本地化，建议翻译链接文本；如果链接标题必须与英文页面标题一致，可接受保留。

### `quickstart/installation.mdx` - 中优先级

- 问题：安装页保留了很多可以中文化的工程词：`import package`、`release package`、`runtime dependency`、`data-science extras`、`lazy load`、`release artifact`；`worker`、`provider` 按白名单保留。
- 例子：第 5 行、第 23 行、第 77 行、第 132 行、第 139 行。
- 建议：代码包名、命令、`worker`、`provider` 保留；说明文字改为“导入包”“发布包”“运行时依赖”“数据科学 extras 分组”“按需加载”“provider 凭证”“发布产物”。

### `quickstart/quickstart.mdx` - 高优先级

- 问题：Quickstart 是新用户第一入口，英文混排会直接影响中文体验。`data pipeline`、`provider` 按白名单保留；`inline data`、`remote storage`、`relation`、`media type`、`business priority`、`output column` 等仍需统一处理。
- 例子：第 6 行、第 8 行、第 47 行、第 96 行、第 220 行、第 291 行。
- 建议：优先通篇润色，尤其是步骤标题和解释段。`Quickstart` 可译为“快速开始”，并在必要时保留英文标题。

### `quickstart/what-is-vane-data.mdx` - 最高优先级

- 问题：产品介绍页英文密度很高，且很多是价值主张中的关键词：`AI-oriented dataset`、`batch inference pipeline`、`helper function`、`relation workflow`、`glue code`、`offline captioning`、`auto-labeling`、`quality scoring`、`dataset packaging`。
- 例子：第 5 行、第 17 行、第 27 行。
- 建议：这是最应该先人工重写的页面。建议不要逐词替换，而是重写为中文产品叙述，并保留白名单术语，例如“面向 AI 的数据集”、`batch inference pipeline`、“辅助函数”、`relation workflow`、“胶水代码/集成代码”“离线字幕生成”“自动标注”“质量评分”“数据集打包”。

## 建议修复顺序

1. 先定保留英文白名单和中文化清单：尤其是 `pipeline`、`schema`、`provider`、`backend`、`runner`、`worker`、`driver`、`benchmark`、`batch`、`embedding` 等保留英文词，以及 `relation`、`stage`、`prompt` 等待统一词。
2. 先改入口页和概念页：`quickstart/what-is-vane-data.mdx`、`quickstart/quickstart.mdx`、`concepts/architecture.mdx`、`concepts/execution-model.mdx`、`concepts/udfs.mdx`。
3. 再改高流量指南：`guides/custom-python-udfs.mdx`、`guides/gpu-inference.mdx`、`guides/ai-functions.mdx`、`guides/multimodal-ingest.mdx`、`guides/multimodal-pipeline.mdx`。
4. 最后改部署页、示例页和贡献页。

## 可接受保留英文的边界

建议保留：

- 产品名和项目名：`Vane Data`、`DuckDB`、`Ray`、`vLLM`、`MinIO`、`Iceberg`、`Doris`。
- 编程语言、文件格式和生态名：`Python`、`SQL`、`JSON`、`CSV`、`Parquet`、`Arrow`、`PyArrow`。
- 项目核心术语：`UDF`、`AI Function`、`Ray actor`、`pipeline`、`workflow`、`schema`、`provider`、`backend`、`runner`、`worker`、`driver`、`benchmark`、`embedding`、`batch`。
- API、函数名、参数名、环境变量、包名、命令和代码枚举值。
- 业界缩写：`UDF`、`GPU`、`CPU`、`LLM`、`OCR`、`S3`。

建议翻译：

- 白名单之外的普通技术名词和解释性短语。
- 标题、表头、列表项中除白名单术语以外的说明文字。
- 业务场景词，如 insurance、tender、procurement、compliance、review、audit、policy、claim。

## 结论

这批中文文档需要的是“术语统一 + 中文化重写”，不是简单搜索替换。最有价值的改法是先固定术语表，再按入口页、概念页、核心指南、示例页的顺序改。否则会继续出现“同一概念多种译法”和“中文句子里夹英文名词串”的问题。
