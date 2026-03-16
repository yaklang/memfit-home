---
sidebar_position: 2
title: 数据流与人机交互
---

# 数据流与交互控制

Memfit AI 的数据流设计支持**递归执行**和**状态连续性**。与无状态聊天机器人不同，Memfit AI 维护一个持续的"执行线程"（时间线），流经不同的引擎（Plan & ReAct）和递归层级。本文档全面介绍数据流架构的技术细节。

## 理论基础

数据流架构建立在分布式系统和并发编程的几个基本原则之上：

1. **发布-订阅模式**：解耦的事件分发实现组件间的松耦合。
2. **上下文传播**：层次化的上下文继承确保父子状态一致性。
3. **事件溯源**：所有状态变化都作为事件序列捕获在时间线中。
4. **CQRS（命令查询责任分离）**：读取（Orient）和写入（Act）操作的分离。

## 1. 统一事件总线（InputEventManager）

交互模型的核心是 `AIInputEventProcessor`。它作为**发布/订阅系统**，确保用户信号（中断、消息、审查）到达当前活跃的智能体，无论它在递归栈中有多深。

### 1.1 事件处理器架构

`AIInputEventProcessor` 维护多个回调注册表用于不同的事件类型：

```go
// 来自 config_inputevent_loop.go
type AIInputEventProcessor struct {
    syncCallback      map[string]func(event *ypb.AIInputEvent) error
    freeInputCallback func(event *ypb.AIInputEvent) error
    mirrorCallback    map[string]func(event *ypb.AIInputEvent)
    mu                sync.Mutex
}
```

| 回调类型 | 目的 | 注册模式 |
|---------|------|---------|
| **syncCallback** | 同步请求-响应模式 | `RegisterSyncCallback(syncType, callback)` |
| **freeInputCallback** | 用户自由文本输入处理 | `SetFreeInputCallback(callback)` |
| **mirrorCallback** | 事件复制到子智能体 | `RegisterMirrorOfAIInputEvent(id, callback)` |

### 1.2 事件处理管道

事件处理遵循层次化分发模式：

```go
// 来自 config_inputevent_loop.go - processInputEvent
func (c *Config) processInputEvent(event *ypb.AIInputEvent) error {
    // 步骤 1：镜像事件到所有注册的子项
    if c.InputEventManager != nil {
        c.InputEventManager.CallMirrorOfAIInputEvent(event)
    }

    // 步骤 2：处理交互消息（固定响应）
    if event.IsInteractiveMessage {
        if event.InteractiveId != "" {
            // 提取结构化 JSON 输入
            jsonextractor.ExtractStructuredJSON(
                event.InteractiveJSONInput,
                jsonextractor.WithObjectCallback(func(data map[string]any) {
                    params := aitool.InvokeParams(data)
                    c.Epm.Feed(event.InteractiveId, params)
                }),
            )
        }
    } else if c.InputEventManager != nil {
        // 步骤 3：委托给 InputEventManager 处理其他事件类型
        return c.InputEventManager.processEvent(event)
    }

    return nil
}
```

### 1.3 事件镜像机制

当父智能体（如 Coordinator）生成子智能体（如用于特定任务的 ReAct Loop）时，事件镜像确保实时信号传播：

#### 1.3.1 镜像注册

```go
// 来自 invoke_plan_and_execute.go - 计划调用期间的镜像注册
inputChannel := chanx.NewUnlimitedChan[*ypb.AIInputEvent](r.config.Ctx, 10)

r.config.InputEventManager.RegisterMirrorOfAIInputEvent(uid, func(event *ypb.AIInputEvent) {
    go func() {
        switch event.SyncType {
        case SYNC_TYPE_QUEUE_INFO:
            // 队列信息事件单独处理
        default:
            log.Infof("InvokePlanAndExecute: Received AI input event: %v", event)
        }
        inputChannel.SafeFeed(event)
    }()
})

// 完成时清理
defer func() {
    r.config.InputEventManager.UnregisterMirrorOfAIInputEvent(uid)
}()
```

#### 1.3.2 镜像分发

```go
// 来自 config_inputevent_loop.go - CallMirrorOfAIInputEvent
func (p *AIInputEventProcessor) CallMirrorOfAIInputEvent(event *ypb.AIInputEvent) {
    p.mu.Lock()
    defer p.mu.Unlock()
    for _, f := range p.mirrorCallback {
        f(event) // 广播到所有注册的镜像
    }
}
```

![事件镜像机制](/img/data-flow-event-mirroring.jpg)

> **[图表占位符：事件镜像与分发]**
> *   **布局：** 带分支的自上而下数据流。
> *   **节点：**
>     1.  **用户输入源** (Web UI / CLI / API)
>     2.  **AIInputEventProcessor** (中央调度器)
>     3.  **SyncCallback 注册表** (请求-响应处理器)
>     4.  **FreeInputCallback** (自由文本处理器)
>     5.  **MirrorCallback 注册表** (子事件复制)
>     6.  **父智能体通道** (Coordinator, SessionID: A)
>     7.  **子智能体通道** (ReActLoop, SessionID: B)
> *   **连接：**
>     *   用户输入 → AIInputEventProcessor
>     *   AIInputEventProcessor → CallMirrorOfAIInputEvent → 所有子项
>     *   AIInputEventProcessor → processEvent → SyncCallback / FreeInputCallback
> *   **注释：**
>     *   显示"停止信号"即时传播到父项和子项
>     *   标注异步事件传递的 goroutine 生成
> *   **关键要点：** 子智能体通过镜像机制接收实时控制信号，而不阻塞父执行。

### 1.4 事件类型分类

系统处理四种不同的事件类别：

```go
// 来自 re-act.go - processInputEvent
func (r *ReAct) processInputEvent(event *ypb.AIInputEvent) error {
    // 首先广播到所有镜像
    r.CallMirrorOfAIInputEvent(event)

    if event.IsFreeInput {
        return r.handleFreeValue(event)      // 用户自由文本
    } else if event.IsInteractiveMessage {
        return r.handleInteractiveEvent(event) // 结构化响应
    } else if event.IsSyncMessage {
        return r.handleSyncMessage(event)      // 同步请求
    }

    log.Warnf("No valid input found in event: %v", event)
    return nil
}
```

| 事件类型 | 字段 | 处理器 | 用例 |
|---------|------|--------|------|
| **FreeInput** | `IsFreeInput` | `handleFreeValue` | 用户在执行中添加新指令 |
| **Interactive** | `IsInteractiveMessage` | `handleInteractiveEvent` | 用户响应 AI 提示 |
| **Sync** | `IsSyncMessage` | `handleSyncMessage` | 状态查询、队列信息 |

## 2. 上下文流（时间线）

数据不仅仅"向下"流向智能体；上下文"伴随"它们流动。**时间线**是保留世界状态的共享内存结构。

### 2.1 时间线架构

时间线实现了一个复杂的时间有序数据结构，具有多个索引路径：

```go
// 来自 timeline.go - Timeline 结构体
type Timeline struct {
    extraMetaInfo func() string // 运行时元数据（如会话 ID）
    config        AICallerConfigIf
    ai            AICaller

    // 多种索引策略以实现高效访问
    idToTs           *omap.OrderedMap[int64, int64]           // ID → 时间戳
    tsToTimelineItem *omap.OrderedMap[int64, *TimelineItem]   // 时间戳 → 项目
    idToTimelineItem *omap.OrderedMap[int64, *TimelineItem]   // ID → 项目
    summary          *omap.OrderedMap[int64, *linktable.LinkTable[*TimelineItem]]  // 压缩摘要
    reducers         *omap.OrderedMap[int64, *linktable.LinkTable[string]]         // 批量压缩

    // 内存管理的内容大小限制
    perDumpContentLimit   int64
    totalDumpContentLimit int64

    compressing *utils.Once  // 压缩同步
}
```

### 2.2 时间线项目类型

时间线支持多种项目类型，每种都实现 `TimelineItemValue` 接口：

```go
// 来自 timeline_item.go - TimelineItemValue 接口
type TimelineItemValue interface {
    String() string
    GetID() int64
    GetShrinkResult() string
    GetShrinkSimilarResult() string
    SetShrinkResult(string)
}
```

| 项目类型 | 结构 | 目的 |
|---------|------|------|
| **ToolResult** | `*aitool.ToolResult` | 工具执行结果 |
| **UserInteraction** | `*UserInteraction` | 用户提示和响应 |
| **TextTimelineItem** | `*TextTimelineItem` | 自由格式文本条目 |

```go
// 来自 timeline_item.go - UserInteraction 结构体
type UserInteractionStage string

const (
    UserInteractionStage_BeforePlan UserInteractionStage = "before_plan"
    UserInteractionStage_Review     UserInteractionStage = "review"
    UserInteractionStage_FreeInput  UserInteractionStage = "free_input"
)

type UserInteraction struct {
    ID              int64                `json:"id"`
    SystemPrompt    string               `json:"prompt"`
    UserExtraPrompt string               `json:"extra_prompt"`
    Stage           UserInteractionStage `json:"stage"`
    ShrinkResult    string               `json:"shrink_result,omitempty"`
}
```

### 2.3 时间线操作

#### 2.3.1 推送操作

时间线支持三种主要推送操作：

```go
// 来自 timeline.go - 推送操作

// 推送工具执行结果
func (m *Timeline) PushToolResult(toolResult *aitool.ToolResult) {
    now := time.Now()
    ts := now.UnixMilli()
    
    // 处理时间戳冲突
    if m.tsToTimelineItem.Have(ts) {
        time.Sleep(time.Millisecond * 10)
        now = time.Now()
        ts = now.UnixMilli()
    }
    
    id := toolResult.GetID()
    m.idToTs.Set(id, ts)
    
    item := &TimelineItem{
        createdAt: now,
        value:     toolResult,
    }
    
    // 如果超过单项限制则自动压缩
    if m.perDumpContentLimit > 0 && int64(len(item.String())) > m.perDumpContentLimit {
        m.shrink(item)
    }
    
    m.tsToTimelineItem.Set(ts, item)
    m.idToTimelineItem.Set(id, item)
    m.dumpSizeCheck() // 如果需要则触发压缩
}

// 推送用户交互
func (m *Timeline) PushUserInteraction(stage UserInteractionStage, id int64, 
                                        systemPrompt string, userExtraPrompt string)

// 推送自由格式文本
func (m *Timeline) PushText(id int64, fmtText string, items ...any)
```

#### 2.3.2 上下文继承

当触发子计划时，新的 Coordinator 继承父时间线的**引用**：

```go
// 来自 memory.go - 时间线引用共享
func (m *PromptContextProvider) CopyReducibleMemory() *PromptContextProvider {
    mem := &PromptContextProvider{
        PersistentData:        m.PersistentData.Copy(),
        DisableTools:          m.DisableTools,
        Tools:                 m.Tools,
        toolsKeywordsCallback: m.toolsKeywordsCallback,
        InteractiveHistory:    m.InteractiveHistory.Copy(),
        // 任务和计划不可约简
        CurrentTask: nil,
        RootTask:    nil,
        PlanHistory: nil,
    }

    // 复制带有共享引用的时间线
    if m.timeline != nil {
        mem.timeline = m.timeline.CopyReducibleTimelineWithMemory()
    } else {
        mem.timeline = aicommon.NewTimeline(nil, mem.CurrentTaskInfo)
    }

    return mem
}
```

**关键属性：**
*   **继承：** 子上下文接收父时间线的副本。
*   **同步：** 子执行的动作写入此共享时间线。
*   **可见性：** 当控制返回父项时，它立即"看到"子项添加的新数据。

### 2.4 子时间线创建

对于作用域上下文窗口，时间线支持创建子视图：

```go
// 来自 timeline.go - CreateSubTimeline
func (m *Timeline) CreateSubTimeline(ids ...int64) *Timeline {
    tl := NewTimeline(m.ai, m.extraMetaInfo)
    if m.config != nil {
        tl.config = m.config
    }
    if len(ids) == 0 {
        return nil
    }
    
    tl.ai = m.ai
    for _, id := range ids {
        ts, ok := m.idToTs.Get(id)
        if !ok {
            continue
        }
        tl.idToTs.Set(id, ts)
        if ret, ok := m.idToTimelineItem.Get(id); ok {
            tl.idToTimelineItem.Set(id, ret)
        }
        if ret, ok := m.tsToTimelineItem.Get(ts); ok {
            tl.tsToTimelineItem.Set(ts, ret)
        }
        // 复制摘要和约简器
        if ret, ok := m.summary.Get(id); ok {
            tl.summary.Set(id, ret)
        }
        if ret, ok := m.reducers.Get(id); ok {
            tl.reducers.Set(id, ret)
        }
    }
    return tl
}
```

### 2.5 时间线压缩

为防止内存无限增长，时间线实现智能压缩：

#### 2.5.1 单项压缩

```go
// 来自 timeline.go - 压缩单个项目
func (m *Timeline) shrink(currentItem *TimelineItem) {
    if m.ai == nil {
        log.Error("ai is nil, memory cannot emit memory shrink")
        return
    }

    // 调用 AI 总结项目
    response, err := m.ai.CallAI(NewAIRequest(m.renderSummaryPrompt(currentItem)))
    if err != nil {
        log.Errorf("shrink call ai failed: %v", err)
        return
    }
    
    // 提取总结内容
    action, err := ExtractValidActionFromStream(ctx, r, "timeline-shrink")
    if err != nil {
        log.Errorf("extract timeline action failed: %v", err)
        return
    }
    
    // 存储压缩结果
    pers := action.GetString("persistent")
    newItem := *currentItem
    newItem.SetShrinkResult(pers)
    
    if lt, ok := m.summary.Get(currentItem.GetID()); ok {
        lt.Push(&newItem)
    } else {
        m.summary.Set(currentItem.GetID(), linktable.NewUnlimitedLinkTable(&newItem))
    }
}
```

#### 2.5.2 批量压缩

当总内容超过限制时，触发批量压缩：

```go
// 来自 timeline.go - compressForSizeLimit
func (m *Timeline) compressForSizeLimit() {
    if m.ai == nil || m.totalDumpContentLimit <= 0 {
        return
    }

    total := int64(m.idToTimelineItem.Len())
    if total <= 1 {
        return
    }

    currentSize := m.calculateActualContentSize()
    if currentSize <= m.totalDumpContentLimit {
        return
    }

    // 超过限制时压缩到一半大小
    targetSize := int(total / 2)
    if targetSize < 1 {
        targetSize = 1
    }

    log.Infof("content size %d > limit %d, compressing to half size: %d items",
        currentSize, m.totalDumpContentLimit, targetSize)

    // 带有 once 守卫的异步压缩
    go func() {
        m.compressing.DoOr(func() {
            m.batchCompressByTargetSize(targetSize)
        }, func() {
            log.Info("batch compress is already running, skip this compress request")
        })
    }()
}
```

### 2.6 时间线差异器

为了记忆生成，系统跟踪时间线变化：

```go
// 来自 timeline_differ.go - TimelineDiffer
type TimelineDiffer struct {
    timeline    *Timeline
    lastDump    string           // 上一次时间线转储
    lastDumpMux sync.RWMutex
}

// Diff 计算自上次调用以来的变化
func (d *TimelineDiffer) Diff() (string, error) {
    d.lastDumpMux.Lock()
    defer d.lastDumpMux.Unlock()

    currentDump := d.timeline.Dump()
    
    // 使用 yakdiff 进行高效差异计算
    diff, err := yakdiff.Diff(d.lastDump, currentDump)
    if err != nil {
        return "", err
    }

    // 更新基准
    d.lastDump = currentDump
    return diff, nil
}
```

![时间线差异追踪](/img/data-flow-timeline-differ.jpg)

> **[图表占位符：时间线数据结构]**
> *   **布局：** 多层索引结构
> *   **层次：**
>     1.  **时间戳索引** (tsToTimelineItem) - 按时间排序
>     2.  **ID 索引** (idToTimelineItem) - 按 ID 直接访问
>     3.  **摘要层** (summary) - 压缩的旧项目
>     4.  **约简器层** (reducers) - 批量压缩结果
> *   **操作：**
>     *   **Push**：添加带时间戳和 ID 索引的新项目
>     *   **Shrink**：压缩超过大小限制的单个项目
>     *   **BatchCompress**：当总量超过限制时压缩最旧的项目
>     *   **CreateSubTimeline**：为特定 ID 创建作用域视图
> *   **关键要点：** 多种索引策略实现高效访问模式，同时压缩机制防止无限增长。

## 3. 核心数据流循环

无论从哪个入口点（Coordinator 或 ReAct），数据处理都遵循严格的 **OODA（观察-调整-决策-行动）** 循环，并通过外部记忆增强。

### 3.1 步骤 1：上下文构建（"调整"阶段）

在 LLM 做出决策之前，原始输入通过上下文增强：

#### 3.1.1 记忆池组装

```go
// 上下文构建包含多个记忆源
type PromptContextProvider struct {
    Query string                                              // 用户的原始查询
    PersistentData *omap.OrderedMap[string, *PersistentDataRecord]  // 用户/AI 设置的数据
    CurrentTask *AiTask                                       // 当前执行上下文
    RootTask    *AiTask                                       // 任务树根
    PlanHistory []*PlanRecord                                 // 先前的规划周期
    Tools func() []*aitool.Tool                               // 可用工具注册表
    InteractiveHistory *omap.OrderedMap[string, *InteractiveEventRecord]  // 用户交互
    timeline *aicommon.Timeline                               // 执行历史
}
```

#### 3.1.2 上下文来源

| 来源 | 内容 | 目的 |
|------|------|------|
| **短期记忆** | 当前时间线 | 最近的工具输出、思考、反思 |
| **长期记忆** | MemoryTriage 结果 | 过去的经验、学习的模式 |
| **RAG 知识** | 向量搜索结果 | 文档、漏洞数据 |
| **持久数据** | 用户定义的变量 | 会话级偏好 |
| **工具注册表** | 可用工具列表 | 能力感知 |

#### 3.1.3 时间线渲染

时间线通过时间标记渲染用于上下文：

```go
// 来自 timeline.go - DumpBefore
func (m *Timeline) DumpBefore(beforeId int64) string {
    buf := bytes.NewBuffer(nil)
    
    // 为旧内容显示约简器摘要
    if reduceredStartId > 0 {
        val, ok := m.reducers.Get(reduceredStartId)
        if ok {
            buf.WriteString(fmt.Sprintf("--[%s] id: %v reducer-memory: %v\n", 
                reducerTimeStr, reduceredStartId, val.Value()))
        }
    }

    // 按时间戳顺序遍历项目
    m.idToTimelineItem.ForEach(func(id int64, item *TimelineItem) bool {
        ts, ok := m.idToTs.Get(item.GetID())
        t := time.Unix(0, ts*int64(time.Millisecond))
        timeStr := t.Format(utils.DefaultTimeFormat3)

        // 为旧项目使用压缩版本
        if shrinkStartId > 0 && item.GetID() <= shrinkStartId {
            val, ok := m.summary.Get(shrinkStartId)
            if ok && !val.Value().deleted {
                buf.WriteString(fmt.Sprintf("--[%s] id: %v memory: %v\n", 
                    timeStr, item.GetID(), val.Value().GetShrinkResult()))
            }
            return true
        }

        // 最近项目的完整内容
        buf.WriteString(fmt.Sprintf("--[%s]\n", timeStr))
        for _, line := range utils.ParseStringToRawLines(item.String()) {
            buf.WriteString(fmt.Sprintf("     %s\n", line))
        }
        return true
    })
    
    return buf.String()
}
```

### 3.2 步骤 2：决策与执行（"决策与行动"阶段）

LLM 生成结构化载荷（JSON 或函数调用）。

#### 3.2.1 动作提取和验证

```go
// 来自 re-act_mainloop.go - 主循环执行
func (r *ReAct) executeMainLoop(userQuery string) (bool, error) {
    currentTask := r.GetCurrentTask()
    currentTask.SetUserInput(userQuery)
    
    defaultFocus := r.config.Focus
    if defaultFocus == "" {
        defaultFocus = schema.AI_REACT_LOOP_NAME_DEFAULT
    }
    
    return r.ExecuteLoopTask(defaultFocus, currentTask)
}
```

#### 3.2.2 预执行检查

执行前，系统执行多个验证步骤：

1. **SPIN 检测**：检查认知或动作循环
2. **上下文验证**：验证任务上下文是否活跃
3. **工具可用性**：确认请求的工具存在

```go
// 来自 exec.go - 预执行检查
select {
case <-task.GetContext().Done():
    return utils.Errorf("task context done in executing ReActLoop(before ActionHandler): %v", 
                       task.GetContext().Err())
default:
}

// 记录动作开始时间
actionStartTime := time.Now()

// 执行动作处理器
handler.ActionHandler(r, actionParams, operator)

// 计算执行时长
actionExecutionDuration := time.Since(actionStartTime)
```

#### 3.2.3 工具分发类别

有效动作路由到不同的执行路径：

| 路由 | 描述 | 示例 |
|------|------|------|
| **本地工具** | 内置 Go 函数 | PortScan、FileRead、CodeExec |
| **MCP 工具** | 通过模型上下文协议的外部智能体 | 自定义集成 |
| **递归调用** | `RequestPlanExecution` | 生成新引擎实例 |

### 3.3 步骤 3：反馈与持久化（"观察"阶段）

执行结果不仅仅返回；它们被**分拣**。

#### 3.3.1 即时反馈

结果添加到时间线用于下一个循环迭代：

```go
// 来自 exec.go - 动作后处理
r.GetInvoker().AddToTimeline("iteration", 
    fmt.Sprintf("[%v]ReAct Iteration Done[%v] max:%v continue to next iteration", 
                loopName, iterationCount, maxIterations))
```

#### 3.3.2 自我反思触发

动作执行后，系统评估是否需要反思：

```go
// 来自 exec.go - 动作后反思
reflectionLevel := r.shouldTriggerReflection(handler, operator, iterationCount)
if reflectionLevel != ReflectionLevel_None {
    r.loadingStatus(fmt.Sprintf("[%v]反思中 / [%v] self-reflecting...", actionName, actionName))
    r.executeReflection(handler, actionParams, operator, reflectionLevel, 
                       iterationCount, actionExecutionDuration)
}
```

#### 3.3.3 异步学习

`MemoryTriage` 系统在后台分析执行跟踪：

```go
// 来自 re-act_mainloop.go - 迭代后记忆处理
reactloops.WithOnPostIteraction(func(loop *reactloops.ReActLoop, iteration int, 
                                     task aicommon.AIStatefulTask, isDone bool, reason any) {
    // 计算时间线差异
    diffStr, err := r.config.TimelineDiffer.Diff()
    if err != nil || diffStr == "" {
        return // 没有变化需要记录
    }

    go func() {
        // 构建上下文输入
        contextualInput := fmt.Sprintf("ReAct迭代 %d/%s: %s\n任务状态: %s\n完成状态: %v\n原因: %v",
            iteration, task.GetId(), diffStr, 
            string(task.GetStatus()), isDone, reason)

        // 智能记忆处理（去重、评分、保存）
        err := r.memoryTriage.HandleMemory(contextualInput)
        if err != nil {
            log.Warnf("intelligent memory processing failed: %v", err)
        }
    }()
})
```

![OODA 循环执行](/img/data-flow-ooda-loop.jpg)

> **[图表占位符：带记忆集成的 OODA 循环]**
> *   **布局：** 带外部记忆连接的循环流
> *   **阶段：**
>     1.  **观察**：收集时间线差异、执行结果
>     2.  **调整**：用时间线、LTM、RAG 增强上下文
>     3.  **决策**：LLM 生成带 SPIN 检查的动作
>     4.  **行动**：工具分发（本地/MCP/递归）
> *   **记忆连接：**
>     *   调整 ← 短期记忆（时间线）
>     *   调整 ← 长期记忆（MemoryTriage）
>     *   观察 → 异步学习（时间线差异）
> *   **关键要点：** 每个阶段都有记忆集成以实现上下文感知执行。

## 4. 递归数据流（"调用栈"）

本节说明"双引擎"切换激活时发生的情况。

### 4.1 递归调用模式

```go
// 来自 invoke_plan_and_execute.go - 递归计划调用
func (r *ReAct) invokePlanAndExecute(doneChannel chan struct{}, ctx context.Context, 
                                      planPayload string, forgeName string, forgeParams any) (finalErr error) {
    doneOnce := new(sync.Once)
    done := func() {
        doneOnce.Do(func() {
            close(doneChannel)
        })
    }
    defer func() {
        done()
        if err := recover(); err != nil {
            log.Errorf("invokePlanAndExecute panic: %v", err)
        }
    }()

    // 为子上下文生成唯一 ID
    uid := uuid.New().String()
    params := map[string]any{
        "re-act_id":      r.config.Id,
        "re-act_task":    r.GetCurrentTask().GetId(),
        "coordinator_id": uid,
    }
    
    // 发出开始事件
    r.EmitJSON(schema.EVENT_TYPE_START_PLAN_AND_EXECUTION, r.config.Id, params)
    defer func() {
        if finalErr != nil {
            r.EmitPlanExecFail(finalErr.Error())
        }
        r.EmitJSON(schema.EVENT_TYPE_END_PLAN_AND_EXECUTION, r.config.Id, params)
    }()

    // 创建带取消的子上下文
    planCtx, cancel := context.WithCancel(ctx)
    defer cancel()

    // 为子注册事件镜像
    inputChannel := chanx.NewUnlimitedChan[*ypb.AIInputEvent](r.config.Ctx, 10)
    r.config.InputEventManager.RegisterMirrorOfAIInputEvent(uid, func(event *ypb.AIInputEvent) {
        go func() {
            inputChannel.SafeFeed(event)
        }()
    })
    defer func() {
        r.config.InputEventManager.UnregisterMirrorOfAIInputEvent(uid)
    }()
    
    // 执行子 coordinator...
}
```

### 4.2 执行栈生命周期

| 阶段 | 父状态 | 子状态 | 数据流 |
|------|--------|--------|--------|
| **1. 触发** | 运行中 | — | ReAct → `RequestPlanExecution` |
| **2. 上下文切换** | 暂停（等待中） | 初始化中 | 父时间线 → 子上下文 |
| **3. 镜像设置** | 暂停 | 活跃 | 事件镜像到子 |
| **4. 执行** | 暂停 | 运行工具 | 子写入共享时间线 |
| **5. 完成** | 恢复中 | 完成中 | 子 → 摘要报告 → 父 |
| **6. 清理** | 运行中 | — | 注销镜像、清理 |

### 4.3 Coordinator 任务执行

```go
// 来自 coordinator_invoker.go - ExecuteLoopTask
func (c *Coordinator) ExecuteLoopTask(taskTypeName string, task aicommon.AIStatefulTask, 
                                       options ...reactloops.ReActLoopOption) error {
    taskCtx := task.GetContext()
    
    // 为此任务创建专用输入通道
    inputChannel := chanx.NewUnlimitedChan[*ypb.AIInputEvent](taskCtx, 10)
    uid := uuid.NewString()
    
    // 注册事件传播镜像
    c.InputEventManager.RegisterMirrorOfAIInputEvent(uid, func(event *ypb.AIInputEvent) {
        go func() {
            inputChannel.SafeFeed(event)
        }()
    })
    defer func() {
        c.InputEventManager.UnregisterMirrorOfAIInputEvent(uid)
    }()
    
    // 创建带取消的子上下文
    ctx, cancel := context.WithCancel(taskCtx)
    defer cancel()
    
    // 订阅热补丁更新
    hotpatchChan := c.Config.HotPatchBroadcaster.Subscribe()
    
    // 配置带继承设置的基础选项
    baseOpts := aicommon.ConvertConfigToOptions(c.Config)
    baseOpts = append(baseOpts,
        aicommon.WithID(c.Config.Id),
        aicommon.WithPersistentSessionId(c.Config.PersistentSessionId),
        aicommon.WithWrapperedAICallback(c.QualityPriorityAICallback),
        aicommon.WithAllowPlanUserInteract(true),
        aicommon.WithEventInputChanx(inputChannel),
        aicommon.WithContext(ctx),
        aicommon.WithEnablePlanAndExec(false), // 防止无限递归
        aicommon.WithHotPatchOptionChan(hotpatchChan),
    )
    
    // 创建并执行循环
    mainloop, err := reactloops.CreateLoopByName(taskTypeName, invoker, defaultOptions...)
    // ...
}
```

### 4.4 任务状态管理

```go
// 来自 runtime.go - 带状态跟踪的任务调用
func invokeTask(current *AiTask) error {
    // 检查任务是否被用户跳过
    if current.GetStatus() == aicommon.AITaskState_Skipped {
        r.config.EmitInfo("subtask %s was skipped by user, moving to next task", current.Name)
        return nil
    }

    // 检查全局上下文
    if r.config.IsCtxDone() {
        return utils.Errorf("coordinator context is done")
    }

    // 检查任务特定上下文
    if current.IsCtxDone() {
        if current.GetStatus() == aicommon.AITaskState_Skipped {
            r.config.EmitInfo("subtask %s context cancelled (skipped)", current.Name)
            return nil
        }
        return utils.Errorf("task context is done")
    }

    r.config.EmitInfo("invoke subtask: %v", current.Name)
    if len(current.Subtasks) == 0 {
        current.SetStatus(aicommon.AITaskState_Processing)
    }
    
    r.config.EmitPushTask(current)
    defer func() {
        r.config.EmitUpdateTaskStatus(current)
        r.config.EmitPopTask(current)
    }()

    return current.executeTaskPushTaskIndex()
}
```

![递归栈与共享状态](/img/data-flow-recursive-stack.jpg)

> **[图表占位符：递归栈与共享状态]**
> *   **布局：** 垂直栈（表示深度）+ 侧边栏（表示共享状态）
> *   **栈层次：**
>     *   **级别 0（顶部）：** 父 ReAct Loop。状态：*[暂停 / 等待中]*
>     *   **级别 1（中间）：** 子 Coordinator。状态：*[活跃 / 调度中]*
>     *   **级别 2（底部）：** 叶子 ReAct Loops。状态：*[运行工具]*
> *   **侧边栏：**
>     *   **共享时间线：** 跨越所有级别的垂直条
>     *   **事件镜像链：** 显示事件传播的箭头
> *   **连接：**
>     *   **向下：** 级别 0 调用 `RequestPlanExecution` → 生成级别 1
>     *   **横向：** 所有级别读写共享时间线
>     *   **向上：** 级别 1 完成 → 返回 `摘要报告` → 恢复级别 0
> *   **关键要点：** 可视化"函数调用"模型，共享时间线确保递归级别间的数据一致性。

## 5. 数据流指标

### 5.1 事件处理保证

| 保证 | 机制 | 描述 |
|------|------|------|
| **传递** | 镜像回调链 | 事件到达所有活跃智能体 |
| **排序** | 时间戳排序映射 | 时间线保持时间顺序 |
| **一致性** | 共享时间线引用 | 父子看到相同数据 |
| **持久性** | 数据库持久化 | 时间线在重启后保留 |

### 5.2 内存管理策略

| 策略 | 触发器 | 动作 |
|------|--------|------|
| **单项压缩** | 项目大小 > `perDumpContentLimit` | AI 总结 |
| **批量压缩** | 总大小 > `totalDumpContentLimit` | 压缩最旧的 50% |
| **约简器存储** | 压缩后 | 在 `reducers` 映射中存储摘要 |
| **软删除** | 项目移除 | 标记为删除，保留在摘要中 |

## 6. 结论

Memfit AI 数据流架构实现了几个关键属性：

1. **实时事件传播**：镜像机制确保用户信号即时到达活跃智能体，无论递归深度如何。

2. **持续上下文**：时间线维护完整的执行历史，智能压缩以平衡上下文丰富度和内存效率。

3. **递归可组合性**：OODA 循环可以任意嵌套，每个级别保持适当的上下文隔离，同时共享全局时间线。

4. **记忆集成**：执行的每个阶段都通过短期（时间线）和长期（MemoryTriage）记忆系统增强。

该架构使 Memfit AI 能够在复杂的多步骤任务中保持连贯、上下文感知的执行，同时对实时用户控制信号保持响应。
