---
sidebar_position: 3
title: 你好，Memfit！
---

# 你好，Memfit！

本章是 Memfit 的基础导览。它不会把每个功能都讲完，而是帮助你建立第一张地图：Memfit 的界面由哪些区域组成、第一次任务如何开始、遇到知识库和 Skills 时应该去读哪篇教程。

如果你已经完成安装和 [基础配置与自定义 AI 配置](/docs/help/quick-start/tier-ai)，可以从这里开始认识 Memfit。

![Memfit 会话工作区概览](/img/help/quick-start/conversation-workspace-overview.png)

## Memfit 是什么

Memfit 是一个可执行任务的 AI Agent 工作台。它不只回答问题，还会根据任务需要调用工具、读取上下文、请求权限、生成计划，并把执行过程展示给你。

在日常使用中，你会遇到四类核心能力：

| 能力 | 你会看到什么 | 继续学习 |
| --- | --- | --- |
| **Agent 执行** | 对话、计划、工具调用、Review 确认、执行结果 | [Agent 使用教程](/docs/help/tutorials/ai-agent) |
| **知识库系统** | 知识库列表、文档导入、知识检索、知识挂载 | [知识库系统教程](/docs/help/tutorials/knowledge-base) |
| **Skills** | 技能列表、技能选择、技能参数确认、技能导入导出 | [如何加载和使用 SKILLS](/docs/help/tutorials/skills) |
| **高级使用** | 用量统计、上下文压力、模型表现、技能工具自定义 | [高级使用](/docs/help/tutorials/advanced) |

## 第一次打开主界面

启动 Memfit 后，进入 AI Agent 主界面。你通常会看到这些区域：

| 区域 | 作用 |
| --- | --- |
| **左侧资源栏** | 查看历史会话、配置、AI 模型、MCP 等入口，也会显示已打开的文件与扩展资源。 |
| **中央欢迎区 / 资源工作区** | 初始状态展示首页推荐；进入任务后集中展示工具、技能、知识库、会话文件和执行产物。 |
| **首页推荐区** | 推荐常用工具、技能和知识库，适合第一次不知道从哪里开始时快速选择。 |
| **输入与快捷操作区** | 输入任务、上传附件、切换人工介入或专注模式，并选择可用模型。 |
| **底部知识库面板** | 浏览知识库、技能库、工具库，并支持搜索、添加和导入资源。 |

![Memfit 首页欢迎页概览](/img/help/quick-start/home-welcome-overview.png)

进入一次真实会话后，界面会更像一个工作台：左侧显示任务时间线与近期记忆，中间承载资源和文件，右侧显示自由对话，顶部显示上下文压力、响应速度、Tokens 和日志入口。这些信息能帮助你判断任务是否还在执行、模型是否压力过高、结果来自哪一步。

![Memfit 会话与资源协同工作区](/img/help/quick-start/home-resource-workspace.png)

## 发送第一条任务

在对话框输入一个小任务，例如：

```text
你好，请用三句话介绍 Memfit 能帮我做什么。
```

发送后，你可以观察三件事：

1. AI 是否直接回答，还是先生成计划。
2. 是否出现 Review 确认。
3. 回复中是否引用了工具、知识库或 Skills。

如果只是普通问答，Memfit 会直接回复。如果你让它分析文件、调用工具或执行复杂任务，它会进入更完整的 Agent 流程。

![发送第一条消息后的会话与模型入口](/img/help/quick-start/first-message-and-model-entry.png)

## 认识执行过程

### 执行过程：ReAct 模式

基础执行模式是 ReAct。它遵循“推理 - 行动 - 观察 - 再推理”的循环：Memfit 会先理解用户输入和当前上下文，再决定是否需要调用工具；工具执行后，AI 会读取返回结果，继续判断下一步，直到能给出最终答案或产物。

在 ReAct 视图中，你可以重点看这几个区域：

| 区域 | 你能判断什么 |
| --- | --- |
| **顶部会话区** | 当前用户请求、系统状态提示，以及 ReAct 推理的起点。 |
| **工具审阅与参数区** | 即将调用的工具、关键参数和执行入口，适合检查是否有高风险操作。 |
| **工具输出区** | 工具调用结果、执行状态和结构化证据。 |
| **中间推理与任务拆解区** | AI 如何根据观察结果继续拆解任务、推进下一步行动。 |
| **AI 总结结果区** | 任务目标、执行结果、关键发现和后续建议。 |
| **底部输入区** | 继续追问、人工介入或切换模式。 |

![ReAct 模式概览：推理、工具调用与结果总结](/img/help/quick-start/react-mode-overview.png)

### 执行过程：Plan 模式

Plan 模式适合更复杂、更长链路的任务。Memfit 会先通过 ReAct 收集足够信息，再生成计划，把任务拆成多个可跟踪的子任务。每个子任务真正执行时，仍然会回到 ReAct 循环，因此 Plan 更像“任务规划层”，ReAct 是“具体执行层”。

在 Plan 视图中，你可以重点看：

| 区域 | 你能判断什么 |
| --- | --- |
| **顶部运行指标** | 上下文压力、响应速度、Tokens、日志等运行信息。 |
| **左侧任务列表** | 当前计划步骤、执行状态与近期记忆，便于追踪任务进度。 |
| **中央规划与执行区** | 深度规划、工具输出、阶段总结和正在执行的子任务。 |
| **右侧自由对话区** | 用户请求、系统反馈和任务执行总结，便于理解整体进度。 |
| **底部控制与输入区** | 人工介入、全局指令、跳过子任务、继续输入。 |

![Plan 模式概览：任务规划与执行协同](/img/help/quick-start/plan-mode-overview.png)

Memfit 的任务执行通常由这几类事件组成：

| 事件 | 含义 | 你需要做什么 |
| --- | --- | --- |
| **计划** | AI 把复杂任务拆成步骤。 | 检查方向是否正确，必要时修改。 |
| **工具调用** | AI 准备使用外部工具或系统能力。 | 阅读参数，确认是否允许执行。 |
| **观察结果** | 工具返回数据，AI 继续分析。 | 等待或根据提示补充信息。 |
| **最终回复** | AI 汇总结论、产物或下一步建议。 | 验收结果，继续追问或开启新任务。 |

这也是 Memfit 与普通聊天工具最大的区别：你能看到它如何行动，而不是只看到最后一句回答。

## 什么时候读哪篇教程

### 只想开始执行任务

阅读 [Agent 使用教程](/docs/help/tutorials/ai-agent)。它会讲清楚：

- 如何输入任务和补充上下文
- 如何使用 Review 确认计划和工具调用
- 如何附加文件、选择模型、查看执行结果
- 如何把一个大任务拆成可执行的小任务

### 想让 AI 理解你的资料

阅读 [知识库系统教程](/docs/help/tutorials/knowledge-base)。它会讲清楚：

- 如何创建知识库
- 如何导入文档或拖拽文件生成知识库
- 如何构建、诊断、查询知识库
- 如何在 Agent 对话中挂载知识库

### 想使用场景化能力

阅读 [如何加载和使用 SKILLS](/docs/help/tutorials/skills)。它会讲清楚：

- Skills 和普通工具有什么区别
- 如何从资源区加载、选择、导入、导出 Skills
- 如何在对话里显式引用一个 Skill
- 为什么有些 Skill 会要求填写参数或 Review

### 想优化成本、性能或自定义能力

阅读 [高级使用](/docs/help/tutorials/advanced)。它会讲清楚：

- [用量与模型表现](/docs/help/tutorials/advanced/usage-and-model-performance)：查看 token 用量、缓存命中、上下文压力、速度和抖动。
- [人工干预与上下文修改](/docs/help/tutorials/advanced/intervention-and-context)：在执行过程中修改方向、补充约束、区分全局上下文和部分上下文。
- [自定义工具与自定义 SKILL](/docs/help/tutorials/advanced/custom-tools-and-skills)：封装团队脚本、固定流程和可复用能力。

## 建议的学习路径

如果你是第一次使用，建议按这个顺序：

1. 完成 [安装 Memfit](/docs/help/quick-start/installation)。
2. 完成 [基础配置与自定义 AI 配置](/docs/help/quick-start/tier-ai)。
3. 阅读本章，认识主界面和核心概念。
4. 跟着 [Agent 使用教程](/docs/help/tutorials/ai-agent) 执行第一个真实任务。
5. 根据需要继续学习知识库、Skills 和高级使用。

## 下一步

继续阅读：

1. [Agent 使用教程](/docs/help/tutorials/ai-agent)
2. [知识库系统教程](/docs/help/tutorials/knowledge-base)
3. [如何加载和使用 SKILLS](/docs/help/tutorials/skills)
4. [高级使用](/docs/help/tutorials/advanced)
