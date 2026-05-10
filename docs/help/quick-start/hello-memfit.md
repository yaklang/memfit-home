---
sidebar_position: 3
title: 你好，Memfit！
---

# 你好，Memfit！

本章是 Memfit 的基础导览。它不会把每个功能都讲完，而是帮助你建立第一张地图：Memfit 的界面由哪些区域组成、第一次任务如何开始、遇到知识库和 Skills 时应该去读哪篇教程。

如果你已经完成安装和 [基础配置与自定义 AI 配置](/docs/help/quick-start/tier-ai)，可以从这里开始认识 Memfit。

【配图：Memfit AI Agent 首页总览，标注对话区、资源区、模型/用量入口、配置入口】

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
| **对话区** | 输入任务、查看 AI 回复、观察执行流。 |
| **资源区** | 管理知识库、Skills、工具等可被 Agent 使用的资源。 |
| **模型与用量入口** | 查看当前模型、上下文 token、输入输出消耗、压力和速度。 |
| **Review 面板** | 当任务涉及计划、工具调用或技能执行时，确认是否允许继续。 |
| **配置入口** | 修改基础配置、权限控制、AI 模型配置和调用模式。 |

【配图：主界面区域标注图】

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

【配图：第一次发送消息后的对话结果】

## 认识执行过程

Memfit 的任务执行通常由这几类事件组成：

| 事件 | 含义 | 你需要做什么 |
| --- | --- | --- |
| **计划** | AI 把复杂任务拆成步骤。 | 检查方向是否正确，必要时修改。 |
| **工具调用** | AI 准备使用外部工具或系统能力。 | 阅读参数，确认是否允许执行。 |
| **观察结果** | 工具返回数据，AI 继续分析。 | 等待或根据提示补充信息。 |
| **最终回复** | AI 汇总结论、产物或下一步建议。 | 验收结果，继续追问或开启新任务。 |

这也是 Memfit 与普通聊天工具最大的区别：你能看到它如何行动，而不是只看到最后一句回答。

【配图：一次任务中的计划、工具调用、观察结果、最终回复】

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
