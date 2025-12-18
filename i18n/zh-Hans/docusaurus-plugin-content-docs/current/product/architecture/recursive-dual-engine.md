---
sidebar_position: 1
title: 核心架构：递归式双引擎架构
---

# 递归式双引擎架构

![递归式双引擎架构示意图](/img/recursive-engine-diagram.jpg)

## 摘要

**递归式双引擎 (Recursive Dual-Engine)** 是 Memfit AI 的基础架构创新，旨在解决自主 AI 代理中战略规划与战术执行之间的根本张力。该架构借鉴认知科学的双过程理论 (Kahneman, 2011) 和层次任务网络规划 (Erol et al., 1994)，通过嵌套执行模型实现 **分形任务分解**，其中战略规划可以作为战术执行循环中的原子动作被递归调用。

本文档提供了递归双引擎架构的全面、代码支撑的分析，检视其理论基础、实现细节以及两个组成引擎交互产生的涌现特性。

---

## 理论基础

### 双过程范式

递归式双引擎架构实例化了一个计算性双过程模型，直接汲取认知心理学的灵感：

| 认知系统 | 引擎 | 特征 | 响应时间 | 认知负载 |
|---------|------|------|---------|---------|
| 系统 2 (深思熟虑型) | Plan 引擎 | 目标分解、依赖分析、战略推理 | 秒到分钟级 | 高 |
| 系统 1 (反应型) | ReAct 引擎 | 工具执行、错误恢复、动态适应 | 毫秒到秒级 | 低 |

该设计受以下基础研究启发：

- **ReAct: 语言模型中推理与行动的协同** (Yao et al., 2022) — 为战术层提供理论基础，证明交错推理和行动优于纯推理或纯行动方法。
- **Plan-and-Solve 提示工程** (Wang et al., 2023) — 确立了复杂任务执行前显式规划的重要性，形成战略层的基础。
- **层次任务网络 (HTN) 规划** (Erol et al., 1994) — 为复杂任务递归分解为原始操作提供形式化框架。
- **双过程理论** (Kahneman, 2011) — 解释为何分离快/慢思维能提高决策质量的认知科学基础。

### 递归原则：规划即动作

关键的架构洞见是 **规划本身构成一个有效动作**。当 ReAct Loop 遇到超出其即时能力的任务时，它可以调用 Plan 引擎生成子计划，该子计划生成自己的 ReAct Loops 集合。这创建了一种 **分形执行结构**，任务可以被无限细分，直到它们成为可用工具可解决的原子操作。

这一原则在动作注册中被形式化捕获：

```go
// 来自 loopinfra/action_request_plan_and_execution.go
var loopAction_RequestPlanAndExecution = &reactloops.LoopAction{
    AsyncMode:   true,
    ActionType:  schema.AI_REACT_LOOP_ACTION_REQUEST_PLAN_EXECUTION,
    Description: `请求详细计划并逐步执行以实现用户目标。`,
    ActionHandler: func(loop *reactloops.ReActLoop, action *aicommon.Action, 
        operator *reactloops.LoopActionHandlerOperator) {
        // ReAct Loop 可以将 Plan 引擎作为动作调用
        invoker := loop.GetInvoker()
        invoker.AsyncPlanAndExecute(task.GetContext(), rewriteQuery, func(err error) {
            loop.FinishAsyncTask(task, err)
        })
    },
}
```

### 组合产生的涌现特性

双引擎架构展现出单一引擎无法独立实现的涌现特性：

| 特性 | 仅 Plan 引擎 | 仅 ReAct 引擎 | 组合架构 |
|------|-------------|--------------|---------|
| **复杂度处理** | 僵化（无法处理意外子任务） | 有限（丢失全局上下文） | **自适应分形分解** |
| **错误恢复** | 差（无运行时适应） | 良好（逐动作） | **多层级恢复** |
| **上下文保持** | 优秀（全局视野） | 差（局部视野） | **层次化上下文流** |
| **执行效率** | 低（过度规划） | 高（反应式） | **最优（按需规划）** |

---

## 1. 架构概览

### 1.1 系统分层

系统被组织为三个独立层级，每层具有明确的职责和定义良好的接口：

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         层级 1：协调器 (Coordinator)                          │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│   │  生命周期   │  │   上下文    │  │  事件总线  │  │   记忆     │       │
│   │   管理器    │  │   容器     │  │   路由器   │  │   分拣器   │       │
│   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
├─────────────────────────────────────────────────────────────────────────────┤
│                         层级 2：Plan 引擎                                    │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│   │  任务树    │  │  依赖关系  │  │   调度器   │  │   审查     │       │
│   │  生成器    │  │  分析器    │  │   (DFS)    │  │   网关     │       │
│   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
├─────────────────────────────────────────────────────────────────────────────┤
│                         层级 3：ReAct 运行时                                  │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│   │  OODA 循环 │  │   工具     │  │   错误     │  │   自我     │       │
│   │  执行器    │  │  调用器    │  │   恢复     │  │   反思     │       │
│   └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│                              ↓                                               │
│        [可通过 RequestPlanExecution 递归调用层级 2]                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 层级职责

| 层级 | 主要角色 | 关键组件 | 状态所有权 |
|------|---------|----------|-----------|
| **协调器** | 编排协调 | Config, Timeline, EventManager | 全局会话状态 |
| **Plan 引擎** | 战略规划 | PlanRequest, TaskTree, Scheduler | 任务分解状态 |
| **ReAct 运行时** | 战术执行 | ReActLoop, ActionHandlers | 动作执行状态 |

---

## 2. 核心数据结构

### 2.1 AiTask 任务树

基础数据结构是 `AiTask`，支持带有完整父子关系跟踪的递归任务定义：

```go
// 来自 task.go - 递归任务结构
type AiTask struct {
    *Coordinator                           // 指向编排协调器的引用
    *aicommon.AIStatefulTaskBase           // 状态管理混入
    
    Index      string    `json:"index"`    // 层次索引 (如 "1-2-3")
    Name       string    `json:"name"`     // 人类可读的任务名称
    Goal       string    `json:"goal"`     // 任务目标规范
    ParentTask *AiTask   `json:"parent_task"` // 父任务引用 (根任务为 nil)
    Subtasks   []*AiTask `json:"subtasks"` // 递归子任务
    
    // 执行状态跟踪
    StatusSummary string `json:"status_summary"` // 实时状态
    TaskSummary   string `json:"task_summary"`   // 完成摘要
    ShortSummary  string `json:"short_summary"`  // 简要摘要
    LongSummary   string `json:"long_summary"`   // 详细摘要
    
    // 工具调用跟踪
    toolCallResultIds *omap.OrderedMap[int64, *aitool.ToolResult]
}
```

### 2.2 层次索引系统

层次索引系统支持跨任意深度嵌套级别的精确任务标识。索引遵循基于路径的表示法，每个级别由连字符分隔：

```go
// 来自 task.go - 递归索引分配
func _assignHierarchicalIndicesRecursive(currentTask *AiTask, currentIndex string) {
    if currentTask == nil {
        return
    }
    currentTask.Index = currentIndex
    currentTask.SetID(currentIndex)

    for i, subTask := range currentTask.Subtasks {
        // 子索引 = 父索引 + 子序号 (1-based)
        // 示例：父任务 "1-2" → 子任务 "1-2-1", "1-2-2", "1-2-3"
        subTaskIndex := fmt.Sprintf("%s-%d", currentIndex, i+1)
        _assignHierarchicalIndicesRecursive(subTask, subTaskIndex)
    }
}

// GenerateIndex 确保从任意节点开始的一致索引
func (t *AiTask) GenerateIndex() {
    if t == nil {
        return
    }

    root := t
    // 向上遍历找到实际根节点（带安全限制）
    for i := 0; i < 1000 && root.ParentTask != nil; i++ {
        root = root.ParentTask
    }

    // 从根节点开始，索引为 "1"
    _assignHierarchicalIndicesRecursive(root, "1")
}
```

索引方案提供几个关键能力：

| 功能 | 实现 | 示例 |
|-----|------|-----|
| **唯一标识** | 基于路径的索引 | 任务 "1-2-3" 可唯一寻址 |
| **层次编码** | 连字符分隔的级别 | "1-2-3" 编码 3 级嵌套 |
| **兄弟排序** | 序号后缀 | "1-2-1", "1-2-2" 保持顺序 |
| **快速查找** | 带索引匹配的 DFS 遍历 | O(n)，n = 总任务数 |

### 2.3 任务状态机

任务遵循定义良好的状态机，具有显式转换和事件发射：

```go
// 来自 aicommon/taskif.go - 任务状态定义
type AITaskState string

const (
    AITaskState_Created    AITaskState = "created"    // 实例化后的初始状态
    AITaskState_Queueing   AITaskState = "queueing"   // 在执行队列中等待
    AITaskState_Processing AITaskState = "processing" // 正在执行
    AITaskState_Completed  AITaskState = "completed"  // 成功完成
    AITaskState_Aborted    AITaskState = "aborted"    // 失败或异常终止
    AITaskState_Skipped    AITaskState = "skipped"    // 用户主动跳过
)
```

状态转换具有完整的可观测性：

```go
// 来自 aicommon/taskif.go - 带事件发射的状态转换
func (s *AIStatefulTaskBase) SetStatus(status AITaskState) {
    old := s.status
    s.status = status

    defer func() {
        if s.IsFinished() {
            s.Cancel()  // 终态时清理上下文
        }
    }()

    if old != status {
        log.Debugf("Task %s status changed: %s -> %s", s.GetId(), old, status)
        if s.Emitter != nil {
            // 发射结构化事件用于 UI 更新和日志记录
            s.Emitter.EmitStructured("react_task_status_changed", map[string]any{
                "react_task_id":         s.GetId(),
                "react_task_old_status": old,
                "react_task_now_status": status,
            })
        }
    }
}
```

状态转换图：

```
                    ┌─────────────────────────────────────────┐
                    │                                         │
   ┌────────┐     ┌─▼───────┐     ┌───────────┐     ┌────────▼───┐
   │Created │────►│Queueing │────►│Processing │────►│ Completed  │
   └────────┘     └─────────┘     └─────┬─────┘     └────────────┘
                                        │
                       ┌────────────────┼────────────────┐
                       ▼                                 ▼
                 ┌──────────┐                     ┌──────────┐
                 │ Aborted  │                     │ Skipped  │
                 └──────────┘                     └──────────┘
```

---

## 3. 协调器 (层级 1)

### 3.1 角色与职责

`Coordinator` 作为 **系统总线**、**生命周期管理器** 和 **上下文容器**：

```go
// 来自 coordinator.go - 核心 Coordinator 结构
type Coordinator struct {
    *aicommon.Config                      // 继承的配置
    userInput       string                // 原始用户请求
    runtime         *runtime              // 任务调度器引用
    PlanMocker      func(config *Coordinator) *PlanResponse  // 测试钩子
    ContextProvider *PromptContextProvider // 动态上下文注入
    ResultHandler   func(cod *Coordinator)  // 完成回调
    rootTask        *AiTask               // 任务树根节点
}
```

Coordinator 的职责跨越多个关注点：

| 职责 | 实现 | 影响 |
|-----|------|-----|
| **会话初始化** | `NewCoordinatorContext()` | 创建执行环境 |
| **共享记忆管理** | `Timeline` 对象 | 跨层级保持上下文 |
| **用户交互处理** | `Epm` (端点管理器) | 处理中断、审查 |
| **事件路由** | `InputEventManager` | 将事件分发到处理器 |
| **任务树管理** | `FindSubtaskByIndex()` | 支持动态任务操作 |

### 3.2 执行生命周期

`Coordinator.Run()` 方法通过五个不同阶段编排完整的执行生命周期：

```go
// 来自 coordinator.go - 完整的执行编排
func (c *Coordinator) Run() error {
    c.registerPEModeInputEventCallback()
    c.EmitCurrentConfigInfo()
    
    // ═══════════════════════════════════════════════════════════
    // 阶段 1：计划请求创建
    // ═══════════════════════════════════════════════════════════
    c.EmitInfo("start to create plan request")
    planReq, err := c.createPlanRequest(c.userInput)
    if err != nil {
        c.EmitError("create planRequest failed: %v", err)
        return utils.Errorf("coordinator: create planRequest failed: %v", err)
    }

    // ═══════════════════════════════════════════════════════════
    // 阶段 2：计划生成 (AI 驱动的分解)
    // ═══════════════════════════════════════════════════════════
    c.EmitInfo("start to invoke plan request")
    rsp, err := planReq.Invoke()
    if err != nil {
        c.EmitError("invoke planRequest failed(first): %v", err)
        return utils.Errorf("coordinator: invoke planRequest failed: %v", err)
    }

    // ═══════════════════════════════════════════════════════════
    // 阶段 3：人机协同审查
    // ═══════════════════════════════════════════════════════════
    ep := c.Epm.CreateEndpointWithEventType(schema.EVENT_TYPE_PLAN_REVIEW_REQUIRE)
    ep.SetDefaultSuggestionContinue()
    c.EmitRequireReviewForPlan(rsp, ep.GetId())
    c.DoWaitAgree(c.GetContext(), ep)  // 阻塞等待用户响应
    
    params := ep.GetParams()
    c.ReleaseInteractiveEvent(ep.GetId(), params)
    if params == nil {
        c.EmitError("user review params is nil, plan failed")
        return utils.Errorf("coordinator: user review params is nil")
    }
    
    // ═══════════════════════════════════════════════════════════
    // 阶段 4：基于审查的计划细化
    // ═══════════════════════════════════════════════════════════
    c.EmitInfo("start to handle review plan response")
    rsp, err = planReq.handleReviewPlanResponse(rsp, params)
    if err != nil {
        c.EmitError("handle review plan response failed: %v", err)
        return utils.Errorf("coordinator: handle review plan response failed: %v", err)
    }

    // ═══════════════════════════════════════════════════════════
    // 阶段 5：运行时创建和任务执行
    // ═══════════════════════════════════════════════════════════
    if rsp.RootTask == nil {
        c.EmitError("root aiTask is nil, plan failed")
        return utils.Errorf("coordinator: root aiTask is nil")
    }
    
    root := rsp.RootTask
    c.rootTask = root
    c.ContextProvider.StoreRootTask(root)
    
    // 验证任务树
    if len(root.Subtasks) <= 0 {
        c.EmitError("no subtasks found, this task is not a valid task")
        return utils.Errorf("coordinator: no subtasks found")
    }
    
    // 记录执行计划
    log.Infof("create aiTask pipeline: %v", root.Name)
    for stepIdx, taskIns := range root.Subtasks {
        log.Infof("step %d: %v", stepIdx, taskIns.Name)
    }
    
    // 创建并调用运行时调度器
    c.EmitInfo("start to create runtime")
    rt := c.createRuntime()
    c.runtime = rt
    return rt.Invoke(root)
}
```

### 3.3 任务操作：跳过与重做

Coordinator 支持通过用户发起的事件进行动态任务操作，实现人类监督：

```go
// 来自 coordinator.go - 跳过子任务处理
func (c *Coordinator) HandleSkipSubtaskInPlan(event *ypb.AIInputEvent) error {
    // 从事件解析参数
    subtaskIndex := utils.InterfaceToString(params["subtask_index"])
    userReason := utils.InterfaceToString(params["reason"])

    // 通过 DFS 定位目标任务
    task := c.FindSubtaskByIndex(subtaskIndex)
    if task == nil {
        return utils.Errorf("subtask with index %s not found", subtaskIndex)
    }

    // 更新状态并取消上下文
    task.SetStatus(aicommon.AITaskState_Skipped)
    task.Cancel()

    // 记录到时间线以保持上下文
    timelineMessage := fmt.Sprintf("用户主动跳过了当前子任务，原因: %s", userReason)
    c.Timeline.PushText(c.AcquireId(), 
        "[user-skiped-subtask] 任务 %s (%s) 被用户主动跳过: %s", 
        task.Index, task.Name, timelineMessage)

    return nil
}

// 来自 coordinator.go - 通过层次索引查找子任务
func (c *Coordinator) FindSubtaskByIndex(index string) *AiTask {
    if c.rootTask == nil {
        return nil
    }

    // 使用 DFS 遍历查找匹配的任务
    taskLink := DFSOrderAiTask(c.rootTask)
    for i := 0; i < taskLink.Len(); i++ {
        task, ok := taskLink.Get(i)
        if !ok {
            continue
        }
        if task.Index == index {
            return task
        }
    }
    return nil
}
```

---

## 4. Plan 引擎 (层级 2)

### 4.1 角色与职责

Plan 引擎作为 **战略层**，负责将复杂目标分解为可执行的子任务树：

| 能力 | 描述 | 实现 |
|-----|------|-----|
| **目标分解** | 将复杂目标分解为子任务 | `planRequest.Invoke()` |
| **依赖分析** | 确定执行顺序 | 隐含在子任务排序中 |
| **任务树构建** | 构建层次化 `AiTask` 结构 | `generateAITask()` |
| **审查集成** | 允许人工修改 | `handleReviewPlanResponse()` |

### 4.2 计划生成过程

计划过程作为专门的 ReAct Loop 实现，产生结构化的任务定义：

```go
// 来自 plan.go - 带任务提取的计划调用
func (pr *planRequest) Invoke() (*PlanResponse, error) {
    // 检查模拟/模板计划（测试和领域特定快捷方式）
    if pr.cod.PlanMocker != nil {
        pr.cod.EmitThoughtStream("mock task", "使用模版预设任务")
        planRes := pr.cod.PlanMocker(pr.cod)
        if utils.IsNil(planRes) {
            return nil, utils.Error("planMocker returns nil, unknown error")
        }
        return planRes, nil
    }

    var rootTask = pr.cod.generateAITaskWithName("root-default", "root-default")
    
    // 确保计划提取后配置传播
    defer func() {
        var propagateConfig func(task *AiTask)
        propagateConfig = func(task *AiTask) {
            if task == nil {
                return
            }
            task.Coordinator = pr.cod
            for _, sub := range task.Subtasks {
                sub.ParentTask = task  // 建立父子链接
                propagateConfig(sub)
            }
        }
        propagateConfig(rootTask)
        rootTask.GenerateIndex()  // 分配层次索引
    }()

    // 为规划阶段创建专用任务
    planTask := aicommon.NewStatefulTaskBase(
        "plan-task",
        pr.rawInput,
        pr.cod.Ctx,
        pr.cod.Emitter,
        true,
    )
    
    // 执行计划生成 ReAct Loop
    err := pr.cod.ExecuteLoopTask(
        schema.AI_REACT_LOOP_NAME_PLAN,
        planTask,
        reactloops.WithOnPostIteraction(func(loop *reactloops.ReActLoop, 
            iteration int, task aicommon.AIStatefulTask, isDone bool, reason any) {
            if isDone {
                // 从 AI 响应提取结构化计划
                planData := loop.Get(loop_plan.PLAN_DATA_KEY)
                action, err := aicommon.ExtractAction(planData, "plan", "plan")
                if err != nil {
                    log.Errorf("extract action from plan data failed: %v", err)
                    return
                }
                
                // 从提取的数据构建根任务
                rootTask = pr.cod.generateAITaskWithName(
                    action.GetAnyToString("main_task"), 
                    action.GetAnyToString("main_task_goal"))

                // 构建子任务
                for _, subtask := range action.GetInvokeParamsArray("tasks") {
                    if subtask.GetAnyToString("subtask_name") == "" {
                        continue
                    }
                    rootTask.Subtasks = append(rootTask.Subtasks, 
                        pr.cod.generateAITask(subtask))
                }
            }
        }))
    
    if err != nil {
        return nil, err
    }
    return pr.cod.newPlanResponse(rootTask), nil
}
```

### 4.3 计划模式定义

AI 根据严格的 JSON 模式生成计划，确保结构化、可解析的输出：

```json
// 来自 jsonschema/plan/plan.json - 计划模式定义
{
  "type": "object",
  "required": ["main_task", "main_task_goal", "tasks"],
  "properties": {
    "main_task": {
      "type": "string",
      "description": "捕获用户请求完整范围的精炼、综合任务描述。"
    },
    "main_task_goal": {
      "type": "string", 
      "description": "定义主任务成功完成的具体、可衡量目标。"
    },
    "tasks": {
      "type": "array",
      "description": "将主任务分解为可执行步骤的有序子任务列表。",
      "items": {
        "type": "object",
        "required": ["subtask_name", "subtask_goal"],
        "properties": {
          "subtask_name": {
            "type": "string",
            "description": "使用 '动词+名词' 格式的简洁名称（如 '分析需求'、'部署服务'）。"
          },
          "subtask_goal": {
            "type": "string",
            "description": "此子任务具有明确完成标准的具体目标。"
          }
        }
      }
    }
  }
}
```

### 4.4 任务生成与上下文保持

每个任务在添加结构化元数据的同时保持原始用户上下文：

```go
// 来自 plan.go - 带上下文注入的任务生成
func (c *Coordinator) generateAITaskWithName(name, goal string) *AiTask {
    task := &AiTask{
        Coordinator: c,
        Name:        name,
        Goal:        goal,
    }

    // 创建带格式化输入的有状态任务基类
    taskBase := aicommon.NewStatefulTaskBase(
        "plan-task"+uuid.NewString(),
        fmt.Sprintf("任务名称: %s\n任务目标: %s", task.Name, task.Goal),
        c.Ctx,
        c.Emitter,
        true,
    )
    task.AIStatefulTaskBase = taskBase

    // 注入原始用户输入以保持上下文
    nonce := utils.RandStringBytes(4)
    taskInput := task.GetUserInput()
    enhancedInput := utils.MustRenderTemplate(`
<|用户原始需求_{{.nonce}}|>
{{ .RawUserInput }}
<|用户原始需求_END_{{.nonce}}|>
--- 
{{ .Origin }}
`,
        map[string]any{
            "nonce":        nonce,
            "RawUserInput": c.userInput,
            "Origin":       taskInput,
        })
    task.SetUserInput(enhancedInput)

    return task
}
```

---

## 5. ReAct 运行时 (层级 3)

### 5.1 角色与职责

ReAct 运行时作为 **战术层**，通过迭代的 OODA（观察-调整-决策-行动）循环执行原子任务：

```go
// 来自 reactloops/reactloop.go - ReActLoop 结构
type ReActLoop struct {
    invoker   aicommon.AIInvokeRuntime
    config    aicommon.AICallerConfigIf
    emitter   *aicommon.Emitter
    
    maxIterations int           // 迭代安全限制
    loopName      string        // 循环类型标识符
    
    // 能力开关（动态功能切换）
    allowAIForge      func() bool  // AI 蓝图调用
    allowPlanAndExec  func() bool  // 递归规划
    allowRAG          func() bool  // 检索增强生成
    allowToolCall     func() bool  // 外部工具调用
    allowUserInteract func() bool  // 用户交互请求
    
    // 动作管理
    actions      *omap.OrderedMap[string, *LoopAction]
    loopActions  *omap.OrderedMap[string, LoopActionFactory]
    streamFields *omap.OrderedMap[string, *LoopStreamField]
    aiTagFields  *omap.OrderedMap[string, *LoopAITagField]
    
    // 记忆管理
    memorySizeLimit int
    currentMemories *omap.OrderedMap[string, *aicommon.MemoryEntity]
    memoryTriage    aicommon.MemoryTriage
    
    // 自我反思支持
    enableSelfReflection bool
    
    // 自旋检测阈值
    sameActionTypeSpinThreshold int
    sameLogicSpinThreshold      int
    
    // 动作历史用于模式检测
    actionHistory         []*ActionRecord
    actionHistoryMutex    *sync.Mutex
    currentIterationIndex int
}
```

### 5.2 OODA 执行循环

每次 ReAct 迭代遵循 OODA（观察-调整-决策-行动）循环，增强了自我反思：

```go
// 来自 reactloops/exec.go - 主执行循环
LOOP:
for {
    iterationCount++
    
    // ═══════════════════════════════════════════════════════════
    // 安全边界：最大迭代检查
    // ═══════════════════════════════════════════════════════════
    if iterationCount > maxIterations {
        r.finishIterationLoopWithError(iterationCount, task, 
            utils.Errorf("达到最大迭代次数 (%d)，停止代码生成循环", maxIterations))
        log.Warnf("Reached max iterations (%d), stopping code generation loop", maxIterations)
        needSummary.SetTo(true)
        break LOOP
    }

    // ═══════════════════════════════════════════════════════════
    // OBSERVE 阶段：加载上下文和记忆
    // ═══════════════════════════════════════════════════════════
    waitMem := make(chan struct{})
    go func() {
        defer close(waitMem)
        r.fastLoadSearchMemoryWithoutAI(task.GetUserInput())
    }()
    
    r.loadingStatus("记忆快速装载中 / waiting for fast memories to load...")
    select {
    case <-task.GetContext().Done():
        return utils.Errorf("task context done before execute ReActLoop")
    case <-waitMem:
        r.loadingStatus("记忆已装载 / memories loaded")
    case <-time.After(200 * time.Millisecond):
        r.loadingStatus("跳过快速记忆装载，原因：超时")
    }

    // ═══════════════════════════════════════════════════════════
    // ORIENT 阶段：生成带完整上下文的提示
    // ═══════════════════════════════════════════════════════════
    r.loadingStatus("执行中... / executing...")
    prompt, finalError = r.generateLoopPrompt(
        nonce,
        task.GetUserInput(),
        r.GetCurrentMemoriesContent(),
        operator,
    )
    if finalError != nil {
        r.finishIterationLoopWithError(iterationCount, task, finalError)
        return finalError
    }

    // ═══════════════════════════════════════════════════════════
    // DECIDE 阶段：AI 决定下一个动作
    // ═══════════════════════════════════════════════════════════
    streamWg := new(sync.WaitGroup)
    actionParams, handler, transactionErr := r.callAITransaction(streamWg, prompt, nonce)
    
    if transactionErr != nil {
        r.finishIterationLoopWithError(iterationCount, task, transactionErr)
        break LOOP
    }

    if utils.IsNil(actionParams) {
        r.finishIterationLoopWithError(iterationCount, task, 
            utils.Error("action is nil in ReActLoop"))
        break LOOP
    }

    // ═══════════════════════════════════════════════════════════
    // ACT 阶段：执行选定的动作
    // ═══════════════════════════════════════════════════════════
    actionName := actionParams.Name()
    r.loadingStatus(fmt.Sprintf("[%v]执行中 / [%v] executing action...", actionName, actionName))

    // 记录动作用于历史跟踪和自旋检测
    r.actionHistoryMutex.Lock()
    r.currentIterationIndex = iterationCount
    actionRecord := &ActionRecord{
        ActionType:     actionParams.ActionType(),
        ActionName:     actionName,
        ActionParams:   make(map[string]interface{}),
        IterationIndex: iterationCount,
    }
    for k, v := range actionParams.GetParams() {
        actionRecord.ActionParams[k] = v
    }
    r.actionHistory = append(r.actionHistory, actionRecord)
    r.actionHistoryMutex.Unlock()

    // 添加迭代信息到时间线
    msg := fmt.Sprintf("[%v]======== ReAct iteration %d ========", loopName, iterationCount)
    if reason := actionParams.GetString("human_readable_thought"); reason != "" {
        msg += "\nReason/Next-Step: " + reason
    }
    r.GetInvoker().AddToTimeline("iteration", msg)

    // 执行动作处理器
    actionStartTime := time.Now()
    handler.ActionHandler(r, actionParams, operator)
    actionExecutionDuration := time.Since(actionStartTime)

    // ═══════════════════════════════════════════════════════════
    // REFLECT 阶段：自我评估（如果启用）
    // ═══════════════════════════════════════════════════════════
    reflectionLevel := r.shouldTriggerReflection(handler, operator, iterationCount)
    if reflectionLevel != ReflectionLevel_None {
        r.loadingStatus(fmt.Sprintf("[%v]反思中 / [%v] self-reflecting...", actionName, actionName))
        r.executeReflection(handler, actionParams, operator, reflectionLevel, 
            iterationCount, actionExecutionDuration)
    }

    // 检查终止条件
    if isTerminated, err := operator.IsTerminated(); isTerminated {
        log.Infof("ReactLoop[%v] terminated", r.loopName)
        if err != nil {
            finalError = err
            r.finishIterationLoopWithError(iterationCount, task, finalError)
            return finalError
        }
        r.finishIterationLoopWithError(iterationCount, task, nil)
        return nil
    }

    // 处理异步模式转换
    if handler.AsyncMode {
        r.loadingStatus("当前任务进入异步模式 / Async mode, ending loop")
        r.finishIterationLoopWithError(iterationCount, task, nil)
        return nil
    }
}
```

### 5.3 动作历史跟踪

每个动作都被记录用于自旋检测、调试和模式分析：

```go
// 来自 reactloops/reactloop.go - 动作记录结构
type ActionRecord struct {
    ActionType     string                 `json:"action_type"`
    ActionName     string                 `json:"action_name"`
    ActionParams   map[string]interface{} `json:"action_params"`
    IterationIndex int                    `json:"iteration_index"`
}
```

动作历史支持复杂的模式检测：

| 检测类型 | 实现 | 目的 |
|---------|------|-----|
| **相同动作类型自旋** | `IsInSameActionTypeSpin()` | 检测重复动作 |
| **逻辑自旋** | `IsInSameLogicSpinWithAI()` | AI 驱动的语义分析 |
| **迭代跟踪** | `currentIterationIndex` | 进度监控 |

---

## 6. 递归机制

### 6.1 规划即动作

关键创新是将 Plan 引擎注册为 ReAct Loop 内的标准动作，实现无缝递归调用：

```go
// 来自 loopinfra/action_request_plan_and_execution.go
var loopAction_RequestPlanAndExecution = &reactloops.LoopAction{
    AsyncMode:   true,  // 不阻塞当前循环
    ActionType:  schema.AI_REACT_LOOP_ACTION_REQUEST_PLAN_EXECUTION,
    Description: `请求详细计划并逐步执行以实现用户目标。`,
    Options: []aitool.ToolOption{
        aitool.WithStringParam(
            "plan_request_payload",
            aitool.WithParam_Description("提供需要多步骤计划的复杂任务的一句话摘要。"),
        ),
    },
    StreamFields: []*reactloops.LoopStreamField{
        {FieldName: `plan_request_payload`},
    },
    ActionVerifier: func(loop *reactloops.ReActLoop, action *aicommon.Action) error {
        // 防止嵌套计划执行冲突
        invoker := loop.GetInvoker()
        if reactInvoker, ok := invoker.(interface {
            GetCurrentPlanExecutionTask() aicommon.AIStatefulTask
        }); ok {
            if reactInvoker.GetCurrentPlanExecutionTask() != nil {
                return utils.Errorf("另一个计划执行任务正在运行，" +
                    "请等待其完成或使用 directly_answer")
            }
        }

        improveQuery := action.GetString("plan_request_payload")
        if improveQuery == "" {
            improveQuery = action.GetInvokeParams("next_action").GetString("plan_request_payload")
        }
        if improveQuery == "" {
            return utils.Errorf("request_plan_and_execution 动作必须有 'plan_request_payload' 字段")
        }
        loop.Set("plan_request_payload", improveQuery)
        return nil
    },
    ActionHandler: func(loop *reactloops.ReActLoop, action *aicommon.Action, 
        operator *reactloops.LoopActionHandlerOperator) {
        task := operator.GetTask()
        rewriteQuery := loop.Get("plan_request_payload")
        invoker := loop.GetInvoker()
        
        // 带完成回调的异步调用计划和执行
        invoker.AsyncPlanAndExecute(task.GetContext(), rewriteQuery, func(err error) {
            loop.FinishAsyncTask(task, err)
        })
    },
}
```

### 6.2 递归调用实现

当 ReAct 引擎触发子计划时，它通过事件镜像创建具有共享上下文的新 Coordinator：

```go
// 来自 aireact/invoke_plan_and_execute.go
func (r *ReAct) invokePlanAndExecute(doneChannel chan struct{}, ctx context.Context, 
    planPayload string, forgeName string, forgeParams any) (finalErr error) {
    
    doneOnce := new(sync.Once)
    done := func() {
        doneOnce.Do(func() { close(doneChannel) })
    }
    defer func() {
        done()
        if err := recover(); err != nil {
            log.Errorf("invokePlanAndExecute panic: %v", err)
            utils.PrintCurrentGoroutineRuntimeStack()
        }
    }()

    uid := uuid.New().String()
    params := map[string]any{
        "re-act_id":      r.config.Id,
        "re-act_task":    r.GetCurrentTask().GetId(),
        "coordinator_id": uid,
    }
    r.EmitJSON(schema.EVENT_TYPE_START_PLAN_AND_EXECUTION, r.config.Id, params)
    defer func() {
        if finalErr != nil {
            r.EmitPlanExecFail(finalErr.Error())
        }
        r.EmitJSON(schema.EVENT_TYPE_END_PLAN_AND_EXECUTION, r.config.Id, params)
    }()

    if ctx == nil {
        ctx = r.config.Ctx
    }
    planCtx, cancel := context.WithCancel(ctx)
    defer cancel()

    // ═══════════════════════════════════════════════════════════
    // 事件镜像：将父级事件流桥接到子级
    // ═══════════════════════════════════════════════════════════
    inputChannel := chanx.NewUnlimitedChan[*ypb.AIInputEvent](r.config.Ctx, 10)
    r.config.InputEventManager.RegisterMirrorOfAIInputEvent(uid, func(event *ypb.AIInputEvent) {
        go func() {
            switch event.SyncType {
            case SYNC_TYPE_QUEUE_INFO:
                // 队列信息单独处理
            default:
                log.Infof("InvokePlanAndExecute: Received AI input event: %v", event)
            }
            inputChannel.SafeFeed(event)
        }()
    })
    defer func() {
        r.config.InputEventManager.UnregisterMirrorOfAIInputEvent(uid)
    }()

    // ═══════════════════════════════════════════════════════════
    // 创建具有继承上下文的子 Coordinator
    // ═══════════════════════════════════════════════════════════
    baseOpts := aicommon.ConvertConfigToOptions(r.config)
    baseOpts = append(baseOpts,
        aicommon.WithID(uid),
        aicommon.WithTimeline(r.config.Timeline),  // 共享时间线以保持上下文连续！
        aicommon.WithAICallback(r.config.OriginalAICallback),
        aicommon.WithEventInputChanx(inputChannel),
        aicommon.WithContext(planCtx),
        aicommon.WithPersistentSessionId(r.config.PersistentSessionId),
    )

    cod, err := aid.NewCoordinatorContext(planCtx, planPayload, baseOpts...)
    if err != nil {
        return utils.Errorf("failed to create coordinator: %v", err)
    }
    
    return cod.Run()
}
```

### 6.3 上下文嵌套与继承

子 Coordinator 继承父级的 Timeline，实现跨递归级别的无缝上下文传播：

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 父 ReAct Loop (SessionID: A)                                                │
│   ├── Timeline: 共享                                                        │
│   ├── Context: ctx-parent                                                   │
│   └── 触发: RequestPlanExecution                                            │
│         ↓                                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 子 Coordinator (SessionID: B, 继承自 A)                                      │
│   ├── Timeline: 继承自父级（写入对父级可见）                                   │
│   ├── Context: ctx-child (派生自 ctx-parent)                                │
│   ├── EventMirror: 接收来自父级 InputEventManager 的事件                      │
│   └── 创建: 具有自己层次索引的新任务树                                         │
│         ↓                                                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 子 ReAct Loops（针对每个叶子任务）                                             │
│   ├── Timeline: 同一共享实例                                                 │
│   └── 可以递归触发更多 RequestPlanExecution 动作                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

此架构确保：

| 属性 | 机制 | 好处 |
|-----|------|-----|
| **上下文连续性** | 共享 Timeline | 子动作对父级可见 |
| **事件传播** | 镜像回调 | 用户中断到达所有级别 |
| **资源隔离** | 派生上下文 | 取消正确传播 |
| **索引独立性** | 独立任务树 | 索引不冲突 |

---

## 7. 任务调度与执行

### 7.1 运行时调度器

`runtime` 结构使用深度优先搜索遍历管理任务调度：

```go
// 来自 runtime.go - 运行时调度器结构
type runtime struct {
    RootTask     *AiTask                         // 任务树根节点
    config       *Coordinator                    // 指向 coordinator 的引用
    currentIndex int                             // 遍历中的当前位置
    TaskLink     *linktable.LinkedList[*AiTask]  // 线性化的任务序列
    statusMutex  sync.Mutex                      // 状态更新同步
}

func (c *Coordinator) createRuntime() *runtime {
    r := &runtime{
        config:   c,
        TaskLink: linktable.New[*AiTask](),
    }
    return r
}
```

### 7.2 DFS 遍历算法

任务按深度优先顺序处理，确保父上下文在子任务之前建立：

```go
// 来自 task_dfs.go - DFS 遍历实现
func DFSOrderAiTask(root *AiTask) *linktable.LinkedList[*AiTask] {
    result := linktable.New[*AiTask]()

    treeStack := []*AiTask{root}
    for len(treeStack) > 0 {
        // 从栈中弹出节点
        lastIndex := len(treeStack) - 1
        currentTask := treeStack[lastIndex]
        treeStack = treeStack[:lastIndex]
        
        result.PushBack(currentTask)
        
        // 逆序压入子节点（最右边的先入栈）
        // 这确保最左边的子节点先被处理
        children := currentTask.Subtasks
        for i := len(children) - 1; i >= 0; i-- {
            treeStack = append(treeStack, children[i])
        }
    }

    return result
}

// 后序遍历变体用于清理操作
func DFSOrderAiTaskPostOrder(root *AiTask) *linktable.LinkedList[*AiTask] {
    result := linktable.New[*AiTask]()
    if root == nil {
        return result
    }

    treeStack := make([]*AiTask, 0)
    var lastVisited *AiTask

    treeStack = append(treeStack, root)

    for len(treeStack) > 0 {
        peekNode := treeStack[len(treeStack)-1]

        // 访问条件：
        // 1. 叶子节点（无子节点）
        // 2. 所有子节点已被访问
        isLeaf := len(peekNode.Subtasks) == 0
        allChildrenVisited := !isLeaf && lastVisited == peekNode.Subtasks[len(peekNode.Subtasks)-1]

        if isLeaf || allChildrenVisited {
            result.PushBack(peekNode)
            treeStack = treeStack[:len(treeStack)-1]
            lastVisited = peekNode
        } else {
            // 从右到左压入子节点以实现从左到右处理
            for i := len(peekNode.Subtasks) - 1; i >= 0; i-- {
                treeStack = append(treeStack, peekNode.Subtasks[i])
            }
        }
    }

    return result
}
```

### 7.3 带状态管理的任务执行

运行时以全面的状态管理调用任务：

```go
// 来自 runtime.go - 带状态处理的任务调用
func (r *runtime) Invoke(task *AiTask) error {
    if r.RootTask == nil {
        r.RootTask = task
    }
    r.updateTaskLink()  // 构建 DFS 遍历顺序
    r.currentIndex = 0

    invokeTask := func(current *AiTask) error {
        // 检查用户主动跳过（Skipped ≠ Aborted）
        if current.GetStatus() == aicommon.AITaskState_Skipped {
            r.config.EmitInfo("subtask %s was skipped by user, moving to next task", current.Name)
            return nil
        }

        // 检查全局上下文取消
        if r.config.IsCtxDone() {
            return utils.Errorf("coordinator context is done")
        }

        // 检查任务局部上下文（可能被 skip/redo 重置）
        if current.IsCtxDone() {
            if current.GetStatus() == aicommon.AITaskState_Skipped {
                r.config.EmitInfo("subtask %s context cancelled (skipped), moving to next task", current.Name)
                return nil
            }
            return utils.Errorf("task context is done")
        }

        r.config.EmitInfo("invoke subtask: %v", current.Name)
        
        // 只有叶子节点（无子任务）被执行
        if len(current.Subtasks) == 0 {
            current.SetStatus(aicommon.AITaskState_Processing)
        }
        
        r.config.EmitPushTask(current)
        defer func() {
            r.config.EmitUpdateTaskStatus(current)
            r.config.EmitPopTask(current)
        }()

        // 只执行叶子节点
        if len(current.Subtasks) == 0 {
            return current.executeTaskPushTaskIndex()
        }
        return nil  // 非叶子节点只是组织性的
    }

    // 主执行循环
    for {
        currentTask, ok := r.NextStep()
        if !ok {
            return nil  // 所有任务完成
        }
        
        if err := invokeTask(currentTask); err != nil {
            // 处理用户主动跳过 vs 实际失败
            isSkipped := currentTask.GetStatus() == aicommon.AITaskState_Skipped
            isContextCanceled := strings.Contains(err.Error(), "context canceled") || 
                                 strings.Contains(err.Error(), "context done")

            if isSkipped || (isContextCanceled && currentTask.GetStatus() == aicommon.AITaskState_Skipped) {
                r.config.EmitInfo("task %s was skipped by user, continuing to next task", currentTask.Name)
                continue
            }

            // 检查全局取消
            if r.config.IsCtxDone() {
                r.config.EmitInfo("coordinator context cancelled, stopping execution")
                return err
            }

            r.config.EmitPlanExecFail("invoke task[%s] failed: %v", currentTask.Name, err)
            r.config.EmitError("invoke subtask failed: %v", err)
            log.Errorf("invoke subtask failed: %v", err)
            return err
        }
    }
}

func (r *runtime) updateTaskLink() {
    if r.RootTask == nil {
        return
    }
    r.TaskLink = DFSOrderAiTask(r.RootTask)
}
```

### 7.4 带上下文传播的叶子节点执行

任务执行包括复杂的上下文传播：

```go
// 来自 task_execute.go - 带父上下文的任务执行
func (t *AiTask) GetUserInput() string {
    if utils.IsNil(t.ParentTask) {
        return t.AIStatefulTaskBase.GetUserInput()
    }
    
    var buf bytes.Buffer

    // 收集父任务链输入（递归最多 20 级）
    var collectParentInputs func(task *AiTask, depth int) []string
    collectParentInputs = func(task *AiTask, depth int) []string {
        if task == nil || task.ParentTask == nil || depth >= 20 {
            return nil
        }

        var inputs []string
        // 首先收集更高层级的父输入
        if task.ParentTask.ParentTask != nil {
            inputs = collectParentInputs(task.ParentTask, depth+1)
        }

        // 然后添加当前父级的输入
        if task.ParentTask.AIStatefulTaskBase != nil {
            input := task.ParentTask.AIStatefulTaskBase.GetUserInput()
            if input != "" {
                inputs = append(inputs, input)
            }
        }

        return inputs
    }

    var parentInputs []string
    if !utils.IsNil(t.ParentTask) {
        parentInputs = collectParentInputs(t, 0)
    }

    var currentInput string
    if t.AIStatefulTaskBase != nil {
        currentInput = t.AIStatefulTaskBase.GetUserInput()
    }

    // 格式化输出，清晰划分
    if len(parentInputs) > 0 {
        buf.WriteString("<|PARENT_TASK|>\n")
        for i, input := range parentInputs {
            if i > 0 {
                buf.WriteString("\n")
            }
            buf.WriteString(input)
        }
        buf.WriteString("\n<|PARENT_TASK_END|>\n\n")
    }

    buf.WriteString("<|CURRENT_TASK|>\n")
    if currentInput != "" {
        buf.WriteString(currentInput)
    }
    buf.WriteString("\n<|CURRENT_TASK_END|>\n\n")

    // 添加执行指南
    buf.WriteString("<|INSTRUCTION|>\n")
    buf.WriteString("## 任务执行原则\n\n")
    buf.WriteString("**核心要求**：请专注于完成 `<|CURRENT_TASK|>` 中定义的任务目标。\n\n")
    buf.WriteString("**父任务的作用**：`<|PARENT_TASK|>` 中的信息仅作为上下文参考...\n")

    return buf.String()
}
```

---

## 8. 进度跟踪与可视化

### 8.1 层次化进度显示

系统为 AI 上下文和用户可视化生成人类可读的进度指示器：

```go
// 来自 runtime.go - 进度渲染
func (t *AiTask) dumpProgressEx(i int, w io.Writer, details bool) {
    prefix := strings.Repeat(" ", i)

    executing := false
    finished := false
    
    // 确定非叶子节点的聚合状态
    if len(t.Subtasks) > 0 {
        allFinished := true
        haveExecutedTask := false
        for _, subtask := range t.Subtasks {
            if !subtask.executed() {
                allFinished = false
            } else if !haveExecutedTask && subtask.executed() {
                haveExecutedTask = true
            }
        }
        if haveExecutedTask && !allFinished {
            executing = true
        } else if allFinished {
            finished = true
        }
    } else {
        finished = t.executed()
    }

    var fill = " "
    var note string
    
    if finished {
        fill = "x"
        if t.TaskSummary != "" {
            note = fmt.Sprintf(" (Finished:%s)", t.TaskSummary)
        }
    } else if executing {
        fill = "~"
        note = " (部分完成)"
    }

    if t.executing() {
        fill = "-"
        note = " (执行中)"
        if ret := t.SingleLineStatusSummary(); ret != "" {
            note += fmt.Sprintf(" (status:%s)", ret)
        }
    }

    taskNameShow := strconv.Quote(t.Name)
    if details {
        if t.Goal != "" {
            taskNameShow = taskNameShow + "(目标:" + strconv.Quote(t.Goal) + ")"
        }
        if t.Index != "" {
            taskNameShow = t.Index + ". " + taskNameShow
        }
    }
    
    if strings.TrimSpace(note) == "" {
        note = "(未开始)"
    }
    
    fmt.Fprintf(w, "%s -[%v] %s %v\n", prefix, fill, taskNameShow, note)
    
    // 递归渲染子任务
    if len(t.Subtasks) > 0 {
        for _, subtask := range t.Subtasks {
            subtask.dumpProgressEx(i+1, w, details)
        }
    }
}
```

示例输出可视化：

```
 -[x] 1. "分析安全需求" (Finished: 识别了 5 个关键区域)
   -[x] 1-1. "审查认证" (Finished: OAuth2 实现已验证)
   -[-] 1-2. "审计授权" (执行中) (status: 检查角色权限)
   -[ ] 1-3. "检查加密" (未开始)
 -[~] 2. "实施修复" (部分完成)
   -[x] 2-1. "更新认证模块" (Finished: 添加了 MFA 支持)
   -[ ] 2-2. "应用安全补丁" (未开始)
```

### 8.2 进度感知的上下文注入

每次 ReAct 迭代通过响应式数据构建接收当前进度上下文：

```go
// 来自 task_execute.go - 进度上下文注入
reactloops.WithReactiveDataBuilder(func(loop *reactloops.ReActLoop, 
    feedback *bytes.Buffer, nonce string) (string, error) {
    
    reactiveData := utils.MustRenderTemplate(`
当前 Plan-Execution 模式进度信息：

<|PROGRESS_TASK_{{.Nonce}}|>
{{ .Progress }}

--- CURRENT_TASK ---
{{ .CurrentProgress }}
--- CURRENT_TASK_END ---

<|PROGRESS_TASK_END_{{ .Nonce }}|>

- 进度信息语义约定：
  1) 任务树状态约定
     - 标记含义：
       - [-] 表示该节点任务"执行中"
       - [ ] 表示该节点任务"未开始"
       - [x] 表示该节点任务"已完成"
     - 层级缩进表示父子任务关系
  2) 当前任务边界
     - "当前任务(CURRENT_TASK)"指明你唯一允许推进的任务节点
  3) 行为准则（必须遵守）
     - 不要假设或回填未在进度信息中出现的状态
     - 不要"预完成"尚未执行的步骤
  4) 只读规则（重要）
     - 进度信息对 AI 是只读的
     - 框架会根据实际执行进度自动更新任务清单与状态

`, map[string]interface{}{
        "Progress":        t.rootTask.Progress(),
        "CurrentProgress": t.Progress(),
        "Nonce":           nonce,
    })

    return reactiveData, nil
})
```

---

## 9. AI 蓝图 (Forges)：预编译的计划模板

### 9.1 概念

**AI 蓝图**（内部称为 "Forges"）是预定义的计划模板，可作为专门的递归 Plan Execution 调用。它们支持具有预配置参数的领域特定自动化：

```go
// 来自 loopinfra/action_require_ai_blueprint_forge.go
var loopAction_RequireAIBlueprintForge = &reactloops.LoopAction{
    AsyncMode:   true,
    ActionType:  schema.AI_REACT_LOOP_ACTION_REQUIRE_AI_BLUEPRINT,
    Description: `请求 AI 蓝图来完成需要专业 AI 能力的复杂任务。`,
    Options: []aitool.ToolOption{
        aitool.WithStringParam(
            "blueprint_payload",
            aitool.WithParam_Description("提供要使用的 AI 蓝图名称。"),
        ),
    },
    ActionHandler: func(loop *reactloops.ReActLoop, action *aicommon.Action, 
        operator *reactloops.LoopActionHandlerOperator) {
        forgeName := action.GetString("blueprint_payload")
        invoker := loop.GetInvoker()
        task := operator.GetTask()

        invoker.RequireAIForgeAndAsyncExecute(task.GetContext(), forgeName, func(err error) {
            loop.FinishAsyncTask(task, err)
        })
    },
}
```

### 9.2 蓝图调用流程

```go
// 来自 aireact/invoke_plan_and_execute.go - 蓝图调用
func (r *ReAct) RequireAIForgeAndAsyncExecute(
    ctx context.Context, forgeName string, onFinished func(error)) {

    // 验证蓝图名称
    if forgeName == "" {
        errMsg := "AI 蓝图名称为空，无法执行"
        r.AddToTimeline("[BLUEPRINT_EMPTY_NAME]", errMsg)
        r.Emitter.EmitError(errMsg)
        onFinished(utils.Error(errMsg))
        return
    }

    // 记录调用尝试
    r.AddToTimeline("[BLUEPRINT_INVOKE_START]", 
        fmt.Sprintf("Invoking AI Blueprint: %s", forgeName))

    // 查找并验证蓝图
    ins, forgeParams, err := r.invokeBlueprint(forgeName)
    if err != nil {
        r.AddToTimeline("[BLUEPRINT_INVOKE_FAILED]", 
            fmt.Sprintf("Failed to invoke '%s': %v", forgeName, err))
        r.Emitter.EmitError(fmt.Sprintf("Failed to invoke AI Blueprint '%s'", forgeName))
        onFinished(fmt.Errorf("failed to invoke ai-blueprint[%v]: %w", forgeName, err))
        return
    }

    // 使用蓝图参数调用计划
    r.invokePlanAndExecute(taskDone, ctx, "", forgeName, forgeParams)
}
```

### 9.3 蓝图查找与参数提取

```go
// 来自 aireact/invoke_blueprint.go - 蓝图解析
func (r *ReAct) invokeBlueprint(forgeName string) (*schema.AIForge, aitool.InvokeParams, error) {
    manager := r.config.AiForgeManager

    // 在注册表中查找蓝图
    ins, err := manager.GetAIForge(forgeName)
    if err != nil {
        r.AddToTimeline("[BLUEPRINT_NOT_FOUND]", 
            fmt.Sprintf("AI Blueprint '%s' does not exist", forgeName))
        return nil, nil, utils.Errorf("AI Blueprint '%s' not found: %v", forgeName, err)
    }

    if ins == nil {
        r.AddToTimeline("[BLUEPRINT_NULL_INSTANCE]", 
            fmt.Sprintf("AI Blueprint '%s' returned nil instance", forgeName))
        return nil, nil, utils.Errorf("AI Blueprint '%s' instance is nil", forgeName)
    }

    // 记录成功查找
    r.AddToTimeline("[BLUEPRINT_FOUND]", 
        fmt.Sprintf("AI Blueprint: %s (%s)", ins.ForgeName, ins.ForgeVerboseName))

    // 生成参数模式
    forgeSchema, err := manager.GenerateAIJSONSchemaFromSchemaAIForge(ins)
    if err != nil {
        return nil, nil, utils.Errorf("generate schema failed: %v", err)
    }

    // 使用 AI 从当前上下文提取参数
    prompt, err := r.promptManager.GenerateAIBlueprintForgeParamsPrompt(ins, forgeSchema)
    if err != nil {
        return nil, nil, utils.Errorf("generate prompt failed: %v", err)
    }

    var forgeParams = make(aitool.InvokeParams)
    err = aicommon.CallAITransaction(
        r.config, prompt, r.config.CallAI,
        func(rsp *aicommon.AIResponse) error {
            action, err := aicommon.ExtractActionFromStream(
                r.config.GetContext(),
                rsp.GetOutputStreamReader("call-forge", false, r.config.GetEmitter()),
                "call-ai-blueprint",
            )
            if err != nil {
                return utils.Errorf("extract action failed: %v", err)
            }
            forgeParams = action.GetInvokeParams("params")
            if len(forgeParams) <= 0 {
                return utils.Error("forge params is empty")
            }
            return nil
        },
    )
    
    if err != nil {
        return nil, nil, err
    }

    return ins, forgeParams, nil
}
```

### 9.4 使用场景

| 蓝图类型 | 领域 | 示例工作流 |
|---------|------|-----------|
| **Java 审计 Forge** | 安全 | 代码审查 → 漏洞扫描 → 报告生成 |
| **渗透测试 Forge** | 安全 | 侦察 → 扫描 → 利用 → 报告 |
| **文档 Forge** | DevOps | 代码分析 → API 提取 → 文档生成 |
| **迁移 Forge** | DevOps | 依赖分析 → 代码转换 → 测试 |

---

## 10. 双引擎架构解决的问题

### 10.1 "迷失方向"问题

**症状**：纯 ReAct 代理在执行 10+ 步后经常忘记其高层目标，变得短视地专注于即时子问题。

**根本原因**：缺乏层次化目标表示；所有目标被扁平化到即时提示中。

**解决方案**：Plan 引擎维护 **全局任务状态**。即使子任务需要 50+ 次迭代，父 Coordinator 也确切知道它在整体路线图中的位置。进度通过响应式数据构建器持续反馈到每次 ReAct 迭代。

```go
// 每次迭代接收完整的进度上下文
reactiveData := fmt.Sprintf(`
<|PROGRESS_TASK|>
%s
--- CURRENT_TASK ---
%s
<|PROGRESS_TASK_END|>
`, t.rootTask.Progress(), t.Progress())
```

### 10.2 "僵化"问题

**症状**：纯 Plan-Execute 代理在初始计划有缺陷时失败（例如，"扫描服务器 A"失败因为服务器 A 宕机）。

**根本原因**：无运行时适应能力；假设计划在生成时是完美的。

**解决方案**：ReAct 引擎处理 **运行时适应**。它可以：
- 使用不同参数重试
- 跳过不可用资源
- 通过 `RequestPlanExecution` 触发重规划
- 通过交互请求用户指导

### 10.3 "复杂度视界"问题

**症状**：没有单一提示可以在 LLM 上下文限制内处理需要 100+ 工具的任务。

**根本原因**：LLM 上下文窗口限制；推理深度的认知负载限制。

**解决方案**：**分形分解**。复杂任务被递归分解，直到每个叶子任务适应 LLM 的上下文窗口和推理能力。

```
原始任务 (需要 100 个工具)
    ├── 子任务 A (30 个工具) → 仍然太复杂
    │   ├── 子任务 A.1 (10 个工具) ✓ 可执行
    │   ├── 子任务 A.2 (10 个工具) ✓ 可执行
    │   └── 子任务 A.3 (10 个工具) ✓ 可执行
    ├── 子任务 B (40 个工具) → 仍然太复杂
    │   └── ... (递归分解)
    └── 子任务 C (30 个工具) → 仍然太复杂
        └── ... (递归分解)
```

### 10.4 对比分析

| 问题 | 传统代理 | Memfit 双引擎 |
|-----|---------|--------------|
| 迷失方向 | ~10 步后失败 | 无限期保持全局上下文 |
| 僵化规划 | 单一计划，无适应 | 任意级别动态重规划 |
| 复杂度视界 | ~20 工具限制 | 通过递归无限制 |
| 错误恢复 | 仅逐动作重试 | 多层级恢复策略 |
| 人类监督 | 难以干预 | 任意任务级别可跳过/重做 |

---

## 11. 性能特征

### 11.1 计算复杂度

| 操作 | 时间复杂度 | 空间复杂度 |
|-----|-----------|-----------|
| 任务树构建 | O(n) | O(n) |
| DFS 遍历 | O(n) | O(d)，d = 最大深度 |
| 索引查找 | O(n) | O(1) |
| 事件镜像 | O(m)，m = 注册镜像数 | O(m) |

### 11.2 内存管理

系统通过 Timeline 压缩实现智能内存管理：

- **逐项限制**：单个时间线项有内容大小限制
- **批量压缩**：空间受限时可将多个项一起压缩
- **选择性保留**：重要项（错误、用户交互）优先保留

### 11.3 并发模型

```
主线程                        异步操作
  │                            │
  ├── Coordinator.Run()        │
  │       │                    │
  │       ├── planRequest.Invoke() ───────► AI 调用 (goroutine)
  │       │                    │
  │       ├── 用户审查 (阻塞)           │
  │       │                    │
  │       └── runtime.Invoke() │
  │               │            │
  │               ├── 任务 1 ───────────► ReAct Loop (goroutine)
  │               │            │              │
  │               │            │              └── AsyncPlanAndExecute
  │               │            │                      │
  │               │            │                      └── 子 Coordinator
  │               │            │
  │               └── 任务 2 (任务 1 完成后)
  │                            │
  └──────────────────────────────
```

---

## 12. 结论

递归式双引擎架构代表了构建能够处理任意复杂度任务的自主 AI 代理的原则性方法。通过将战略规划与战术执行相结合，并支持两层之间的递归调用，Memfit AI 实现了：

1. **可扩展性**：任意复杂度的任务都可以通过分形递归分解到可管理
2. **鲁棒性**：任意层级的失败都会通过自我反思触发适当的恢复机制
3. **透明性**：层次化进度跟踪使人类监督能够覆盖每个层级
4. **灵活性**：动态重规划通过规划即动作适应运行时条件
5. **上下文保持**：共享 Timeline 确保跨递归级别不丢失信息

该架构同时植根于认知科学（双过程理论）和经典人工智能（层次任务网络），提供了坚实的理论基础，而代码支撑的实现确保了在实际场景中的可部署性。

---

## 参考资料

### 学术文献
- Yao, S. et al. (2022). *ReAct: Synergizing Reasoning and Acting in Language Models*. ICLR 2023.
- Wang, L. et al. (2023). *Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning*. ACL 2023.
- Erol, K. et al. (1994). *HTN Planning: Complexity and Expressivity*. AAAI 1994.
- Kahneman, D. (2011). *Thinking, Fast and Slow*. Farrar, Straus and Giroux.
- Boyd, J. (1987). *A Discourse on Winning and Losing*. (OODA Loop 概念化)

### 代码库参考
- `common/ai/aid/task.go` — AiTask 结构和层次索引
- `common/ai/aid/task_dfs.go` — DFS 遍历算法
- `common/ai/aid/coordinator.go` — Coordinator 编排
- `common/ai/aid/runtime.go` — 任务调度和执行
- `common/ai/aid/plan.go` — 计划生成和任务提取
- `common/ai/aid/task_execute.go` — 带上下文传播的任务执行
- `common/ai/aid/aireact/reactloops/reactloop.go` — ReAct Loop 实现
- `common/ai/aid/aireact/reactloops/exec.go` — OODA 执行循环
- `common/ai/aid/aireact/invoke_plan_and_execute.go` — 递归调用
- `common/ai/aid/aireact/invoke_blueprint.go` — AI 蓝图处理
- `common/ai/aid/aireact/reactloops/loopinfra/action_request_plan_and_execution.go` — 规划即动作
- `common/ai/aid/aireact/reactloops/loopinfra/action_require_ai_blueprint_forge.go` — 蓝图动作
- `common/ai/aid/aicommon/taskif.go` — 任务状态机
