---
sidebar_position: 1
title: 递归式双引擎
---

# 递归式双引擎架构

## 什么是递归式双引擎？

**递归式双引擎 (Recursive Dual-Engine)** 是 Memfit AI 的核心架构创新。它不仅仅是两种模式之间的简单切换，而是一种 **嵌套执行模型**，其中战略规划引擎可以作为战术执行循环中的一个原子动作被递归调用。

*   **Plan 引擎 (战略层)：** 将复杂目标解构为结构化的 **任务树 (Task Tree)**（有向无环图）。它处理依赖关系、并行性和全局状态。
*   **ReAct 引擎 (战术层)：** 使用 **OODA 循环**（观察-调整-决策-行动）执行原子任务。它处理工具调用、错误恢复和动态推理。

**"递归"的含义是：**
执行叶子节点任务的 ReAct Loop 可以决定"这个任务太复杂了"，并触发 Plan 引擎为该特定节点生成一个 *子计划*。这创造了一种分形结构，任务可以被无限细分，直到它们可以被原子工具解决。

![递归双引擎图解](/img/recursive-engine-diagram.jpg)

## 解决了什么问题？

### 1. "迷失方向"问题 (Lost in the Weeds)
纯 ReAct Agent 往往在执行 10 步以上后忘记其高层目标。
*   **解决方案：** Plan 引擎维护 **全局任务状态**。即使一个子任务需要 50 步，父级 Coordinator 也确切知道它在整体路线图中的位置。

### 2. "僵化"问题 (The "Rigidity" Problem)
纯 Plan-Execute Agent 在初始计划有缺陷时会失败（例如，"扫描服务器 A"失败因为服务器 A 宕机）。
*   **解决方案：** ReAct 引擎处理 **运行时适应**。它可以重试、修改参数，甚至触发 *重规划* 事件，而无需中止整个任务。

### 3. "复杂度视界"问题 (The "Complexity Horizon" Problem)
没有单一的 Prompt 可以处理需要 100+ 工具的任务。
*   **解决方案：** **分形分解**。复杂任务被分解，直到它适应 LLM 的上下文窗口和推理能力。

## 工作原理：系统分层

系统分层以确保关注点分离：

> **[图片占位符]**
> *描述：* 一个 3D "千层蛋糕" 架构图展示关注点分离。
> *   **层级 1 (顶层): 协调器 (Coordinator)。** 视觉化为指挥中心或系统总线。标签："生命周期管理器"、"共享时间线"、"用户接口"。
> *   **层级 2 (中层): Plan 引擎 (Plan Engine)。** 视觉化为战略地图或流程图生成器。标签："任务树生成"、"调度器"、"依赖控制"。
> *   **层级 3 (底层): ReAct 运行时 (ReAct Runtime)。** 视觉化为执行网格，有多个工人。标签："ReAct Loop 1"、"ReAct Loop 2"、"工具执行器"。
> *   **连接：** 连接各层的垂直数据管道，以及一个特殊的"递归调用"箭头，从层级 3 循环回层级 1。

### 层级 1：协调器 (Coordinator) - 系统总线
*   **角色：** 生命周期管理器和上下文容器。
*   **职责：**
    *   初始化会话。
    *   管理所有层级间的 **共享记忆 (Shared Memory)**（时间线）。
    *   处理用户中断和审查。

### 层级 2：Plan 引擎 (Plan Engine) - 战略家
*   **角色：** 任务生成器和调度器。
*   **职责：**
    *   从用户意图生成 `AiTask` 树。
    *   管理 **控制流**（顺序、并行、If-Else）。
    *   将叶子任务分发给运行时。

### 层级 3：ReAct 运行时 (ReAct Runtime) - 战术家
*   **角色：** 工作单元。
*   **职责：**
    *   为每个叶子任务实例化 `ReActLoop`。
    *   执行工具（`PortScan`, `ShellExec`）。
    *   **关键点：** 可以调用 `RequestPlanExecution` 作为动作，回调至层级 1。

## 核心实现技术

基于 Yaklang 代码库分析，递归机制依赖于几个关键技术：

### 1. 规划即动作 (Planning as an Action)
在 `reactloop.go` 中，规划能力被注册为一个标准的工具动作：
`AI_REACT_LOOP_ACTION_REQUEST_PLAN_EXECUTION`。
这意味着对于 LLM 来说，"创建子计划"就像"读取文件"一样，只是一个工具。

### 2. 上下文嵌套与镜像 (Context Nesting & Mirroring)
当子计划被触发时 (`invoke_plan_and_execute.go`)：
*   一个新的 `CoordinatorContext` 被创建，继承父级的 `Timeline`。
*   **事件镜像 (Event Mirroring)：** `InputEventManager` 将父级的输入事件流桥接到子 Coordinator，允许用户无缝地与深层子任务交互。

### 3. 任务树数据结构
`AiTask` 结构支持递归定义：

```go
type AiTask struct {
    Name     string
    Subtasks []*AiTask  // 递归定义
    Status   TaskStatus // Pending, Running, Completed, Failed
    // ...
}
```

Coordinator 使用 DFS（深度优先搜索）策略遍历此树来调度 ReAct Loops。

### 4. Forges 作为预编译计划
**Forges** (AI Blueprints) 被实现为预定义的 Plan。当 ReAct Loop 调用 Forge（例如"Java 审计 Forge"）时，技术上它是在触发一个带有预设模板的递归 Plan Execution。

## 参考资料

*   **Yaklang 代码库：** `common/ai/aid/aireact/reactloops/reactloop.go` (循环逻辑)
*   **Yaklang 代码库：** `common/ai/aid/coordinator.go` (任务调度)
*   **论文：** *ReAct: Synergizing Reasoning and Acting in Language Models* (Yao et al., 2022) - 战术层的基础。
*   **论文：** *Plan-and-Solve Prompting* (Wang et al., 2023) - 战略层的基础。
