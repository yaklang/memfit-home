---
sidebar_position: 1
title: 架构详解
---

# Memfit AI 架构详解

Memfit AI 突破了单一范式的局限，创新性地采用了 **ReAct 与 Plan-Execute 递归耦合** 的混合架构。该架构通过 Coordinator（协调器）将宏观的 **战略规划 (Strategic Planning)** 与微观的 **战术执行 (Tactical Execution)** 有机融合，实现了任务处理中确定性与灵活性的统一。

本文档将详细介绍 Memfit AI 的核心架构设计、数据流转、关键组件以及规划与执行的闭环机制。

## 递归式双引擎混合架构

本架构的核心在于 **Plan 引擎**（战略层）与 **ReAct 引擎**（战术层）之间的非线性嵌套关系。

*   **Plan 引擎 (战略层)：** 负责任务的宏观解构。面对复杂、模糊或长周期的用户意图，系统启动规划引擎，将顶层目标拆解为具备时序依赖与逻辑关联的结构化 **任务树 (Task Tree)**。这为 Agent 提供了全局视野与执行骨架，防止其在长链路操作中迷失方向。
*   **ReAct 引擎 (战术层)：** 负责原子任务的动态执行。针对规划生成的每一个子任务，系统实例化独立的 **ReAct Loop**，通过 "观察 (Observation) - 推理 (Thought) - 行动 (Action)" 的闭环机制与环境交互。这赋予了 Agent 应对非确定性环境的能力。

**递归耦合机制 (Recursive Coupling Mechanism)：**
当 ReAct 引擎在执行过程中遇到超出当前能力范畴的复杂子问题时，可动态触发 Plan 引擎进行 **次级规划 (Sub-planning)**；反之，Plan 引擎生成的每一个叶子节点任务均由 ReAct 引擎承接落地。这种递归调用机制支持了任务的分形扩展，可适应任意复杂度的业务场景。

[图片: 递归式双引擎混合架构示意图]

## 数据流与交互控制

Memfit AI 的数据流是一个支持双向交互、动态分支的复杂网络，根据用户入口的不同智能适配控制流。

### 双模态用户入口

1.  **Coordinator 入口 (Plan-Execute 模式)：**
    *   **适用场景：** 任务模糊、复杂（如“对目标进行全面安全审计”）。
    *   **控制流：** 用户 -> Coordinator -> 规划循环 (生成任务树) -> 审查 (Review) -> 运行时 -> ReAct Loops。
    *   **交互点：** 包括 **规划审查 (Planning Review)**（用户修改或批准规划）和 **全局中断 (Global Interrupt)**。

2.  **ReAct 入口 (即时执行模式)：**
    *   **适用场景：** 指令明确、原子化（如“扫描指定 IP”）。
    *   **控制流：** 用户 -> ReAct Loop -> 思考 -> 行动 -> 观察。
    *   **交互点：** 包括 **请求澄清 (Ask for Clarification)**（信息缺失时）和 **行动确认 (Action Confirmation)**（敏感操作时）。

### 核心数据流转闭环

无论从哪个入口启动，数据都会在以下组件间形成闭环：
1.  **上下文构建 (Context Construction)：** 输入 (Query + History) 经过 **Memory Triage** (长期记忆) 和 **RAG System** (领域知识) 的增强。
2.  **决策制定 (Decision Making)：** LLM 结合增强后的上下文输出结构化指令（Plan JSON 或 ReAct Thought/Action）。
3.  **执行与交互 (Execution & Interaction)：** 调用工具（本地或 MCP）或触发人机协作。
4.  **反馈与学习 (Feedback & Learning)：** 工具输出提供短期反馈；Memory Triage 异步分析执行链路（Trace），提取关键信息沉淀至向量数据库。

## 关键组件详解

[图片: 关键组件关系图]

### 协调器 (Coordinator) 与 ReActLoop

*   **Coordinator：** 系统总线与生命周期管理器。它管理 Session 上下文、加载配置，并作为用户意图与系统执行间的桥梁。它维护全局任务状态机并监控子任务执行。
*   **ReActLoop：** 最小执行单元。在一个独立的上下文中驱动 "Reasoning-Acting" 循环。支持 **动态挂起** 以请求帮助或新规划，并能无缝切换至 Plan 模式。

### ReAct Loops (执行引擎)

ReAct Loop 是一个高可扩展的状态机执行环境。
*   **核心构成：** 包含 **LoopEngine** (状态流转)、**Action Registry** (动作注册表) 和 **Prompt Manager** (提示词管理)。
*   **专注模式 (Focus Mode)：** 允许定义特定模式（如代码审计）。一个 Loop 可被封装为 Action，允许 Agent 压栈当前上下文并启动专注于特定领域的子 Loop。
*   **可靠性保障：** 内置 **自我反思 (SelfReflection)**（分析失败）和 **自旋检测 (Spin Detector)**（防止动作或逻辑死循环）。

### Tools 与 Forges (能力层)

[图片: 工具与 Forges 示意图]

*   **Tools：** 标准化原子能力（如 "ReadFile", "ShellExec"）。支持 **MCP** (Model Context Protocol)、**Yaklang 原生** 工具以及 **Agentic Search** (运行时动态发现工具)。
*   **Forges：** 场景化能力模组 (AI Blueprints)。Forge 是针对特定垂直领域的 Prompt、工具集和逻辑的集合（如 "Java 代码审计 Forge"）。Coordinator 可将 Forge 实例化为一个子任务。

### 记忆层与 RAG 系统

*   **Memory Triage (智能海马体)：** 通过 **C.O.R.E. P.A.C.T. 框架** 对记忆片段进行多维度评分（关联度、来源、相关性、情感、偏好、可操作性、时效性）。高分记忆被持久化并建立 "潜在问题" 索引。
*   **RAG System (外脑)：** 主动式、代理化的知识服务。支持 **混合索引** (向量 + 关键词)、**标量过滤** 和 **多跳检索**。它融合了领域知识、工具/Forges 信息以及历史记忆。

## 规划与执行闭环

Memfit AI 基于 "规划-执行-反思" 的闭环流程运行。

### Coordinator 规划流程

[图片: Coordinator 规划流程图]

1.  **上下文初始化：** 并行调用 Memory Triage 与 RAG System。
2.  **规划生成：** 启动规划专用 ReAct Loop 生成 **AiTask** 任务树。
3.  **人工介入 (Human-in-the-Loop Review)：** 用户查看、修改或批准规划。
4.  **运行时分发：** 调度器为叶子节点实例化 ReAct Loop。

### ReAct 执行流程

[图片: ReAct 执行流程图]

遵循 **OODA (观察-调整-决策-行动)** 循环：
1.  **观察 (Observation)：** 收集环境状态和反馈。
2.  **推理 (Reasoning)：** LLM 进行推理，伴随自旋检测。
3.  **动作分发 (Action Dispatch)：** LLM 输出动作；敏感操作进行权限审查。
4.  **反馈 (Feedback)：** 执行结果驱动下一轮迭代。

### 可靠性保障机制 (Reliability Assurance)

*   **自我反思 (Self-Reflection)：** 触发于错误或步数超限。分析失败原因并生成修正计划 (Correction Plan) 注入下一轮提示词。
*   **自旋检测 (Spin Detection)：** 检测 **动作自旋** (参数重复) 和 **逻辑自旋** (语义重复)。通过注入干扰信息或强制反思进行干预。
*   **记忆增强恢复 (Memory-Augmented Recovery)：** 检索历史相似错误案例以辅助当前决策。

