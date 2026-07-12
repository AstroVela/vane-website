# 首页与解决方案页代码示例优化设计

## 目标

简化首页、Enterprise Agent 解决方案页和 Training Data 解决方案页的代码示例，同时让三页共同表达 Vane 的核心特点：在同一条 Relation Pipeline 中组合 SQL、Python UDF 与 AI Function，并在不改业务逻辑的情况下从本地执行切换到 Ray。

三页采用渐进式分工，不重复展示同一段完整流水线：

1. 首页负责让第一次接触 Vane 的用户一眼看懂最短主路径。
2. Enterprise Agent 页负责展示 Python 业务规则与 AI Function 在同一条 SQL 中执行，并保留可审计上下文。
3. Training Data 页负责展示 Python batch UDF、SQL AI Function 与 Ray 分布式 GPU 执行的完整组合。

本次不增加新的视觉组件，也不改变页面整体结构；只调整现有代码块、文件名和紧邻代码的说明文字。

## 首页

首页示例保持 SQL-first，只展示：

```text
Parquet 输入 → SQL ai_embed → Parquet 输出
```

具体调整：

- 删除代码中的 `vane.configure(runner="ray")`，让最短示例使用默认本地执行。
- 将输入从泛化的 `media` 改为语义明确的 `documents`，代码窗口文件名改为 `embed_documents.py`。
- 保留显式 provider 与 model，使示例不依赖读者猜测默认配置。
- 删除与示例不匹配的 “multimodal” 命名。
- 在代码附近用一句话说明：Vane 默认本地运行，增加 `vane.configure(runner="ray")` 即可让同一流水线运行在 Ray 上。

首页不展示 Python UDF、actor 数量、GPU 或 batch 参数。这些能力由两个解决方案页逐步展开。

## Enterprise Agent 解决方案页

将当前 `docs → reviewed → final` 三层临时 Relation 改为一条查询：

```text
Python policy UDF → SQL alias
                         \
Parquet → SQL projection + ai_prompt → auditable rows → Parquet
```

具体调整：

- 使用 `@vane.func(return_dtype="VARCHAR")` 定义一个简短的 `policy_check` Python 规则。
- 使用 `vane.attach_function(..., parameters=["VARCHAR"], connection=con)` 将其注册为 SQL alias。
- 在同一个 `SELECT` 中调用 `policy_check(text)` 与 `ai_prompt(text, options)`。
- 每一行继续保留 `claim_id`、`document_id` 和 `source_uri`，并输出 `rule_hit` 与 `ai_finding`。
- 删除两个 `to_table()`、三阶段查询和没有实际筛选价值的最终过滤层。
- 将结果直接写为 `audit_findings.parquet`，补全简洁的输入到输出闭环。

代码附近的说明文字强调：普通 Python 规则注册一次后即可在 SQL 中与 AI Function 并排调用，业务标识和来源列始终跟随结果。

## Training Data 解决方案页

保留这页作为三页中信息最完整的示例，但将流水线压缩为四个必要步骤：

```text
SQL selection → Ray GPU batch UDF → SQL quality/dedupe + ai_embed → release
```

具体调整：

- 保留 `vane.configure(runner="ray")`，使规模化执行在本页成为明确主题。
- 保留 `CaptionAndScore` callable class、`gpus=1` 与 `actor_number=4`，体现模型在 Ray actor 中复用。
- 删除显式 `execution_backend="ray_actor"`；增强版运行时可从 active runner 与 actor 配置推导执行后端。
- 删除非必要的 `batch_size`，避免执行调优参数抢占主线。
- 仅将 Python batch UDF 的结果物化一次，以便后续 SQL 引用。
- 使用 `WHERE` 和 `QUALIFY row_number()` 在同一个 SQL 查询中完成质量过滤、按内容哈希去重和 `ai_embed`。
- 删除 `curated` 中间 Relation 及其第二次 `to_table()`。
- 保留明确的版本化 S3 输出路径。

代码附近说明 `CaptionAndScore` 是用户提供的 batch UDF；删除 Ray 配置行即可让相同流水线回到本地执行，其余业务代码无需变化。

## API 与内容准确性

- SQL AI Function 继续使用增强版支持的 `ai_prompt(messages [, options])` 与 `ai_embed(text [, options])`。
- SQL options 使用 constant `struct_pack(...)`，并通过环境变量提供凭据，不在示例内嵌密钥。
- `policy_check` 使用增强版 `vane.func` 与 `vane.attach_function` SQL alias 路径。
- Training Data 页继续使用 Relation `map_batches`，因为 GPU caption/labeling 返回多列训练数据，更适合表形转换而不是单列 Expression UDF。
- 首页与 Enterprise Agent 页优先使用 SQL 表达式；Relation API 只在多列 GPU batch 转换中出现。

## 现有检查与验证

- 更新三页现有检查脚本中与旧代码精确绑定的断言，使其验证新的页面分工和关键 API，而不是继续要求已删除的临时 Relation 或执行参数。
- 不新增页面专用内容契约。
- 运行三页现有内容检查、TypeScript 检查和生产构建。
- 启动或复用本地官网服务，确认三个路由可访问，并人工检查桌面与窄屏下代码窗口没有异常横向溢出。
- Docs 内容和 Docs Examples 不在本次范围内。
