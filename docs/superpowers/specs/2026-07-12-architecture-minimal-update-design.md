# Architecture 文档最小化更新设计

## 目标

将英文和中文 `architecture.mdx` 恢复到提交 `dfa0befa2aadbafd3e09909d6` 的文档结构，并只补充增强版 Expression UDF 与 AI Function 所需的架构说明。避免把 Architecture 页面改写成 API 分类说明或执行模型详解。

## 结构约束

两种语言都严格保留基线中的八个二级章节及其顺序：

1. System view / 系统视图
2. Public user surface / 公开用户接口
3. Runner modes / runner 模式
4. UDF execution layer / UDF 执行层
5. AI Function layer / AI Function 层
6. Configuration model / 配置模型
7. Worker environment / worker 环境
8. Data movement / 数据流动

不增加 Public API models、Shared planning and execution、AI provider lifecycle、Boundaries and next steps 等独立章节，也不加入新的架构图。

## 内容调整

- 在系统视图中保留原有四层架构，只简要说明 Expression API 产生 projection 结果、Relation API 负责表形转换；SQL 是 Expression 的推荐入口。
- 在公开用户接口中补充 SQL UDF alias、`ai_prompt`、`ai_embed`、Python Expression UDF/AI 入口，同时保留已有 Relation 方法。
- 在 UDF 执行层说明 Expression UDF 与 Relation UDF 共用 task/actor backend，但输出契约不同。
- 在 AI Function 层修正“AI Function 仅是 Relation method”的旧描述，覆盖 SQL Expression、Python Expression 和 Python Relation 入口。
- 在 worker 环境中简要说明 provider 在 worker 侧创建，凭据通过 worker 环境变量提供。
- 在数据流动中区分 Expression 结果回填 projection 与 Relation 操作返回完整表形结果。
- runner 与配置章节只保留基线内容，并做增强版 API 所必需的准确性修正。

Architecture 不承载完整任务示例、详细函数签名、参数表或逐项调用限制；这些内容继续由 Guides 和 API Reference 承担。

## 中英文同步

英文与中文使用相同标题结构、信息顺序和技术结论。允许语言表达自然化，但不得出现一侧新增独立概念、另一侧缺失的情况。

## 内容契约处理

删除 `scripts/udf-ai-v2-content-check.mjs` 中仅针对 Architecture 页面注册、标题顺序、章节内容和示例语言的专用 schema/assertion。保留其他页面及全站内容契约。Architecture 页面改由人工审阅，并继续接受通用 MDX lint、链接、构建和路由检查。

## 验证

- 对比基线提交，确认八个二级标题及顺序完全一致。
- 人工检查中英文内容对应关系以及 Expression/Relation、SQL-first 结论。
- 运行文档 lint、剩余 UDF/AI 内容检查、生成产物检查、类型检查和生产构建。
- 确认英文与中文 Architecture 路由均返回 HTTP 200。
- 确认 Docs Examples 仍然没有变化。
