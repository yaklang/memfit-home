---
sidebar_position: 2
title: Data Flow & Human Interaction
---

# Data Flow and Interaction

Memfit AI's data flow is designed to support **recursive execution** and **state continuity**. Unlike stateless chatbots, Memfit AI maintains a continuous "Thread of Execution" (Timeline) that flows across different engines (Plan & ReAct) and recursive levels. This document provides a comprehensive technical exposition of the data flow architecture.

## Theoretical Foundation

The data flow architecture is built upon several fundamental principles from distributed systems and concurrent programming:

1. **Publish-Subscribe Pattern**: Decoupled event distribution enabling loose coupling between components.
2. **Context Propagation**: Hierarchical context inheritance ensuring parent-child state consistency.
3. **Event Sourcing**: All state changes are captured as a sequence of events in the Timeline.
4. **CQRS (Command Query Responsibility Segregation)**: Separation of read (Orient) and write (Act) operations.

## 1. Unified Event Bus (InputEventManager)

At the heart of the interaction model is the `AIInputEventProcessor`. It acts as a **Pub/Sub System** ensuring that user signals (interrupts, messages, reviews) reach the currently active agent, no matter how deep it is in the recursion stack.

### 1.1 Event Processor Architecture

The `AIInputEventProcessor` maintains multiple callback registries for different event types:

```go
// From config_inputevent_loop.go
type AIInputEventProcessor struct {
    syncCallback      map[string]func(event *ypb.AIInputEvent) error
    freeInputCallback func(event *ypb.AIInputEvent) error
    mirrorCallback    map[string]func(event *ypb.AIInputEvent)
    mu                sync.Mutex
}
```

| Callback Type | Purpose | Registration Pattern |
|--------------|---------|---------------------|
| **syncCallback** | Synchronous request-response patterns | `RegisterSyncCallback(syncType, callback)` |
| **freeInputCallback** | User free-text input handling | `SetFreeInputCallback(callback)` |
| **mirrorCallback** | Event replication to child agents | `RegisterMirrorOfAIInputEvent(id, callback)` |

### 1.2 Event Processing Pipeline

The event processing follows a hierarchical dispatch pattern:

```go
// From config_inputevent_loop.go - processInputEvent
func (c *Config) processInputEvent(event *ypb.AIInputEvent) error {
    // Step 1: Mirror events to all registered children
    if c.InputEventManager != nil {
        c.InputEventManager.CallMirrorOfAIInputEvent(event)
    }

    // Step 2: Handle interactive messages (fixed responses)
    if event.IsInteractiveMessage {
        if event.InteractiveId != "" {
            // Extract structured JSON input
            jsonextractor.ExtractStructuredJSON(
                event.InteractiveJSONInput,
                jsonextractor.WithObjectCallback(func(data map[string]any) {
                    params := aitool.InvokeParams(data)
                    c.Epm.Feed(event.InteractiveId, params)
                }),
            )
        }
    } else if c.InputEventManager != nil {
        // Step 3: Delegate to InputEventManager for other event types
        return c.InputEventManager.processEvent(event)
    }

    return nil
}
```

### 1.3 Event Mirroring Mechanism

When a Parent Agent (e.g., The Coordinator) spawns a Child Agent (e.g., A ReAct Loop for a specific task), the event mirroring ensures real-time signal propagation:

#### 1.3.1 Mirror Registration

```go
// From invoke_plan_and_execute.go - Mirror registration during plan invocation
inputChannel := chanx.NewUnlimitedChan[*ypb.AIInputEvent](r.config.Ctx, 10)

r.config.InputEventManager.RegisterMirrorOfAIInputEvent(uid, func(event *ypb.AIInputEvent) {
    go func() {
        switch event.SyncType {
        case SYNC_TYPE_QUEUE_INFO:
            // Queue info events are handled separately
        default:
            log.Infof("InvokePlanAndExecute: Received AI input event: %v", event)
        }
        inputChannel.SafeFeed(event)
    }()
})

// Cleanup on completion
defer func() {
    r.config.InputEventManager.UnregisterMirrorOfAIInputEvent(uid)
}()
```

#### 1.3.2 Mirror Dispatch

```go
// From config_inputevent_loop.go - CallMirrorOfAIInputEvent
func (p *AIInputEventProcessor) CallMirrorOfAIInputEvent(event *ypb.AIInputEvent) {
    p.mu.Lock()
    defer p.mu.Unlock()
    for _, f := range p.mirrorCallback {
        f(event) // Broadcast to all registered mirrors
    }
}
```

![Event Mirroring Architecture](/img/data-flow-event-mirroring.jpg)

### 1.4 Event Type Classification

The system processes four distinct event categories:

```go
// From re-act.go - processInputEvent
func (r *ReAct) processInputEvent(event *ypb.AIInputEvent) error {
    // Broadcast to all mirrors first
    r.CallMirrorOfAIInputEvent(event)

    if event.IsFreeInput {
        return r.handleFreeValue(event)      // User free-text
    } else if event.IsInteractiveMessage {
        return r.handleInteractiveEvent(event) // Structured response
    } else if event.IsSyncMessage {
        return r.handleSyncMessage(event)      // Sync request
    }

    log.Warnf("No valid input found in event: %v", event)
    return nil
}
```

| Event Type | Field | Handler | Use Case |
|-----------|-------|---------|----------|
| **FreeInput** | `IsFreeInput` | `handleFreeValue` | User adds new instructions mid-execution |
| **Interactive** | `IsInteractiveMessage` | `handleInteractiveEvent` | User responds to AI prompts |
| **Sync** | `IsSyncMessage` | `handleSyncMessage` | Status queries, queue info |

## 2. The Context Stream (Timeline)

Data does not just flow "down" to agents; context flows "along" with them. The **Timeline** is the shared memory structure that preserves the state of the world.

### 2.1 Timeline Architecture

The Timeline implements a sophisticated time-ordered data structure with multiple index paths:

```go
// From timeline.go - Timeline structure
type Timeline struct {
    extraMetaInfo func() string // Runtime metadata (e.g., session ID)
    config        AICallerConfigIf
    ai            AICaller

    // Multiple indexing strategies for efficient access
    idToTs           *omap.OrderedMap[int64, int64]           // ID → Timestamp
    tsToTimelineItem *omap.OrderedMap[int64, *TimelineItem]   // Timestamp → Item
    idToTimelineItem *omap.OrderedMap[int64, *TimelineItem]   // ID → Item
    summary          *omap.OrderedMap[int64, *linktable.LinkTable[*TimelineItem]]  // Compressed summaries
    reducers         *omap.OrderedMap[int64, *linktable.LinkTable[string]]         // Batch compressions

    // Content size limits for memory management
    perDumpContentLimit   int64
    totalDumpContentLimit int64

    compressing *utils.Once  // Compression synchronization
}
```

### 2.2 Timeline Item Types

The Timeline supports multiple item types, each implementing the `TimelineItemValue` interface:

```go
// From timeline_item.go - TimelineItemValue interface
type TimelineItemValue interface {
    String() string
    GetID() int64
    GetShrinkResult() string
    GetShrinkSimilarResult() string
    SetShrinkResult(string)
}
```

| Item Type | Structure | Purpose |
|-----------|-----------|---------|
| **ToolResult** | `*aitool.ToolResult` | Results from tool executions |
| **UserInteraction** | `*UserInteraction` | User prompts and responses |
| **TextTimelineItem** | `*TextTimelineItem` | Free-form text entries |

```go
// From timeline_item.go - UserInteraction structure
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

### 2.3 Timeline Operations

#### 2.3.1 Push Operations

The Timeline supports three primary push operations:

```go
// From timeline.go - Push operations

// Push tool execution result
func (m *Timeline) PushToolResult(toolResult *aitool.ToolResult) {
    now := time.Now()
    ts := now.UnixMilli()
    
    // Handle timestamp collision
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
    
    // Auto-shrink if exceeds per-item limit
    if m.perDumpContentLimit > 0 && int64(len(item.String())) > m.perDumpContentLimit {
        m.shrink(item)
    }
    
    m.tsToTimelineItem.Set(ts, item)
    m.idToTimelineItem.Set(id, item)
    m.dumpSizeCheck() // Trigger compression if needed
}

// Push user interaction
func (m *Timeline) PushUserInteraction(stage UserInteractionStage, id int64, 
                                        systemPrompt string, userExtraPrompt string)

// Push free-form text
func (m *Timeline) PushText(id int64, fmtText string, items ...any)
```

#### 2.3.2 Context Inheritance

When a sub-plan is triggered, the new Coordinator inherits the **reference** to the parent's Timeline:

```go
// From memory.go - Timeline reference sharing
func (m *PromptContextProvider) CopyReducibleMemory() *PromptContextProvider {
    mem := &PromptContextProvider{
        PersistentData:        m.PersistentData.Copy(),
        DisableTools:          m.DisableTools,
        Tools:                 m.Tools,
        toolsKeywordsCallback: m.toolsKeywordsCallback,
        InteractiveHistory:    m.InteractiveHistory.Copy(),
        // Task & Plan are not reducible
        CurrentTask: nil,
        RootTask:    nil,
        PlanHistory: nil,
    }

    // Copy timeline with shared reference
    if m.timeline != nil {
        mem.timeline = m.timeline.CopyReducibleTimelineWithMemory()
    } else {
        mem.timeline = aicommon.NewTimeline(nil, mem.CurrentTaskInfo)
    }

    return mem
}
```

**Key Properties:**
*   **Inheritance:** Child contexts receive a copy of the parent's Timeline.
*   **Synchronization:** Actions performed by the child are written to this shared Timeline.
*   **Visibility:** When control returns to the parent, it instantly "sees" the new data added by the child.

### 2.4 Sub-Timeline Creation

For scoped context windows, the Timeline supports creating sub-views:

```go
// From timeline.go - CreateSubTimeline
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
        // Copy summaries and reducers
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

### 2.5 Timeline Compression

To prevent unbounded memory growth, the Timeline implements intelligent compression:

#### 2.5.1 Per-Item Shrinking

```go
// From timeline.go - shrink individual item
func (m *Timeline) shrink(currentItem *TimelineItem) {
    if m.ai == nil {
        log.Error("ai is nil, memory cannot emit memory shrink")
        return
    }

    // Call AI to summarize the item
    response, err := m.ai.CallAI(NewAIRequest(m.renderSummaryPrompt(currentItem)))
    if err != nil {
        log.Errorf("shrink call ai failed: %v", err)
        return
    }
    
    // Extract summarized content
    action, err := ExtractValidActionFromStream(ctx, r, "timeline-shrink")
    if err != nil {
        log.Errorf("extract timeline action failed: %v", err)
        return
    }
    
    // Store shrink result
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

#### 2.5.2 Batch Compression

When total content exceeds limits, batch compression is triggered:

```go
// From timeline.go - compressForSizeLimit
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

    // Compress to half size when limit exceeded
    targetSize := int(total / 2)
    if targetSize < 1 {
        targetSize = 1
    }

    log.Infof("content size %d > limit %d, compressing to half size: %d items",
        currentSize, m.totalDumpContentLimit, targetSize)

    // Async compression with once guard
    go func() {
        m.compressing.DoOr(func() {
            m.batchCompressByTargetSize(targetSize)
        }, func() {
            log.Info("batch compress is already running, skip this compress request")
        })
    }()
}
```

### 2.6 Timeline Differ

For memory generation, the system tracks Timeline changes:

```go
// From timeline_differ.go - TimelineDiffer
type TimelineDiffer struct {
    timeline    *Timeline
    lastDump    string           // Previous Timeline dump
    lastDumpMux sync.RWMutex
}

// Diff calculates changes since last call
func (d *TimelineDiffer) Diff() (string, error) {
    d.lastDumpMux.Lock()
    defer d.lastDumpMux.Unlock()

    currentDump := d.timeline.Dump()
    
    // Use yakdiff for efficient difference calculation
    diff, err := yakdiff.Diff(d.lastDump, currentDump)
    if err != nil {
        return "", err
    }

    // Update baseline
    d.lastDump = currentDump
    return diff, nil
}
```

![Timeline Differ Architecture](/img/data-flow-timeline-differ.jpg)

## 3. Core Data Flow Loop

Regardless of the entry point (Coordinator or ReAct), the data processing follows a rigorous **OODA (Observe-Orient-Decide-Act)** loop enriched by external memory.

### 3.1 Step 1: Context Construction (The "Orient" Phase)

Before the LLM makes a decision, the raw input is hydrated with context:

#### 3.1.1 Memory Pool Assembly

```go
// Context construction includes multiple memory sources
type PromptContextProvider struct {
    Query string                                              // User's original query
    PersistentData *omap.OrderedMap[string, *PersistentDataRecord]  // User/AI set data
    CurrentTask *AiTask                                       // Current execution context
    RootTask    *AiTask                                       // Root of task tree
    PlanHistory []*PlanRecord                                 // Previous planning cycles
    Tools func() []*aitool.Tool                               // Available tool registry
    InteractiveHistory *omap.OrderedMap[string, *InteractiveEventRecord]  // User interactions
    timeline *aicommon.Timeline                               // Execution history
}
```

#### 3.1.2 Context Sources

| Source | Content | Purpose |
|--------|---------|---------|
| **Short-Term Memory** | Current Timeline | Recent tool outputs, thoughts, reflections |
| **Long-Term Memory** | MemoryTriage results | Past experiences, learned patterns |
| **RAG Knowledge** | Vector search results | Documentation, vulnerability data |
| **Persistent Data** | User-defined variables | Session-level preferences |
| **Tool Registry** | Available tools list | Capability awareness |

#### 3.1.3 Timeline Rendering

The Timeline is rendered with temporal markers for context:

```go
// From timeline.go - DumpBefore
func (m *Timeline) DumpBefore(beforeId int64) string {
    buf := bytes.NewBuffer(nil)
    
    // Show reducer summaries for old content
    if reduceredStartId > 0 {
        val, ok := m.reducers.Get(reduceredStartId)
        if ok {
            buf.WriteString(fmt.Sprintf("--[%s] id: %v reducer-memory: %v\n", 
                reducerTimeStr, reduceredStartId, val.Value()))
        }
    }

    // Iterate through items in timestamp order
    m.idToTimelineItem.ForEach(func(id int64, item *TimelineItem) bool {
        ts, ok := m.idToTs.Get(item.GetID())
        t := time.Unix(0, ts*int64(time.Millisecond))
        timeStr := t.Format(utils.DefaultTimeFormat3)

        // Use shrunk version for old items
        if shrinkStartId > 0 && item.GetID() <= shrinkStartId {
            val, ok := m.summary.Get(shrinkStartId)
            if ok && !val.Value().deleted {
                buf.WriteString(fmt.Sprintf("--[%s] id: %v memory: %v\n", 
                    timeStr, item.GetID(), val.Value().GetShrinkResult()))
            }
            return true
        }

        // Full content for recent items
        buf.WriteString(fmt.Sprintf("--[%s]\n", timeStr))
        for _, line := range utils.ParseStringToRawLines(item.String()) {
            buf.WriteString(fmt.Sprintf("     %s\n", line))
        }
        return true
    })
    
    return buf.String()
}
```

### 3.2 Step 2: Decision & Execution (The "Decide & Act" Phase)

The LLM generates a structured payload (JSON or Function Call).

#### 3.2.1 Action Extraction and Validation

```go
// From re-act_mainloop.go - Main loop execution
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

#### 3.2.2 Pre-Execution Checks

Before execution, the system performs several validation steps:

1. **SPIN Detection**: Check for cognitive or action loops
2. **Context Validation**: Verify task context is active
3. **Tool Availability**: Confirm requested tool exists

```go
// From exec.go - Pre-execution checks
select {
case <-task.GetContext().Done():
    return utils.Errorf("task context done in executing ReActLoop(before ActionHandler): %v", 
                       task.GetContext().Err())
default:
}

// Record action start time
actionStartTime := time.Now()

// Execute action handler
handler.ActionHandler(r, actionParams, operator)

// Calculate execution duration
actionExecutionDuration := time.Since(actionStartTime)
```

#### 3.2.3 Tool Dispatch Categories

Valid actions are routed to different execution paths:

| Route | Description | Example |
|-------|-------------|---------|
| **Local Tools** | Built-in Go functions | PortScan, FileRead, CodeExec |
| **MCP Tools** | External agents via Model Context Protocol | Custom integrations |
| **Recursive Calls** | `RequestPlanExecution` | Spawn new engine instance |

### 3.3 Step 3: Feedback & Persistence (The "Observe" Phase)

Execution results are not just returned; they are **Triaged**.

#### 3.3.1 Immediate Feedback

Results are added to the Timeline for the next loop iteration:

```go
// From exec.go - Post-action processing
r.GetInvoker().AddToTimeline("iteration", 
    fmt.Sprintf("[%v]ReAct Iteration Done[%v] max:%v continue to next iteration", 
                loopName, iterationCount, maxIterations))
```

#### 3.3.2 Self-Reflection Trigger

After action execution, the system evaluates whether reflection is needed:

```go
// From exec.go - Post-action reflection
reflectionLevel := r.shouldTriggerReflection(handler, operator, iterationCount)
if reflectionLevel != ReflectionLevel_None {
    r.loadingStatus(fmt.Sprintf("[%v]反思中 / [%v] self-reflecting...", actionName, actionName))
    r.executeReflection(handler, actionParams, operator, reflectionLevel, 
                       iterationCount, actionExecutionDuration)
}
```

#### 3.3.3 Asynchronous Learning

The `MemoryTriage` system analyzes the execution trace in the background:

```go
// From re-act_mainloop.go - Post-iteration memory processing
reactloops.WithOnPostIteraction(func(loop *reactloops.ReActLoop, iteration int, 
                                     task aicommon.AIStatefulTask, isDone bool, reason any) {
    // Calculate timeline diff
    diffStr, err := r.config.TimelineDiffer.Diff()
    if err != nil || diffStr == "" {
        return // No changes to record
    }

    go func() {
        // Build contextual input
        contextualInput := fmt.Sprintf("ReAct迭代 %d/%s: %s\n任务状态: %s\n完成状态: %v\n原因: %v",
            iteration, task.GetId(), diffStr, 
            string(task.GetStatus()), isDone, reason)

        // Intelligent memory processing (deduplication, scoring, saving)
        err := r.memoryTriage.HandleMemory(contextualInput)
        if err != nil {
            log.Warnf("intelligent memory processing failed: %v", err)
        }
    }()
})
```

![OODA Loop Feedback](/img/data-flow-ooda-loop.jpg)

## 4. Recursive Data Flow (The "Call Stack")

This section illustrates what happens when the "Dual-Engine" switch activates.

### 4.1 Recursive Invocation Pattern

```go
// From invoke_plan_and_execute.go - Recursive plan invocation
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

    // Generate unique ID for child context
    uid := uuid.New().String()
    params := map[string]any{
        "re-act_id":      r.config.Id,
        "re-act_task":    r.GetCurrentTask().GetId(),
        "coordinator_id": uid,
    }
    
    // Emit start event
    r.EmitJSON(schema.EVENT_TYPE_START_PLAN_AND_EXECUTION, r.config.Id, params)
    defer func() {
        if finalErr != nil {
            r.EmitPlanExecFail(finalErr.Error())
        }
        r.EmitJSON(schema.EVENT_TYPE_END_PLAN_AND_EXECUTION, r.config.Id, params)
    }()

    // Create child context with cancellation
    planCtx, cancel := context.WithCancel(ctx)
    defer cancel()

    // Register event mirror for child
    inputChannel := chanx.NewUnlimitedChan[*ypb.AIInputEvent](r.config.Ctx, 10)
    r.config.InputEventManager.RegisterMirrorOfAIInputEvent(uid, func(event *ypb.AIInputEvent) {
        go func() {
            inputChannel.SafeFeed(event)
        }()
    })
    defer func() {
        r.config.InputEventManager.UnregisterMirrorOfAIInputEvent(uid)
    }()
    
    // Execute child coordinator...
}
```

### 4.2 Execution Stack Lifecycle

| Phase | Parent State | Child State | Data Flow |
|-------|-------------|-------------|-----------|
| **1. Trigger** | Running | — | ReAct → `RequestPlanExecution` |
| **2. Context Switch** | Paused (Awaiting) | Initializing | Parent Timeline → Child Context |
| **3. Mirror Setup** | Paused | Active | Events mirrored to Child |
| **4. Execution** | Paused | Running Tools | Child writes to shared Timeline |
| **5. Completion** | Resuming | Completing | Child → Summary Report → Parent |
| **6. Cleanup** | Running | — | Unregister mirror, cleanup |

### 4.3 Coordinator Task Execution

```go
// From coordinator_invoker.go - ExecuteLoopTask
func (c *Coordinator) ExecuteLoopTask(taskTypeName string, task aicommon.AIStatefulTask, 
                                       options ...reactloops.ReActLoopOption) error {
    taskCtx := task.GetContext()
    
    // Create dedicated input channel for this task
    inputChannel := chanx.NewUnlimitedChan[*ypb.AIInputEvent](taskCtx, 10)
    uid := uuid.NewString()
    
    // Register mirror for event propagation
    c.InputEventManager.RegisterMirrorOfAIInputEvent(uid, func(event *ypb.AIInputEvent) {
        go func() {
            inputChannel.SafeFeed(event)
        }()
    })
    defer func() {
        c.InputEventManager.UnregisterMirrorOfAIInputEvent(uid)
    }()
    
    // Create child context with cancellation
    ctx, cancel := context.WithCancel(taskCtx)
    defer cancel()
    
    // Subscribe to hotpatch updates
    hotpatchChan := c.Config.HotPatchBroadcaster.Subscribe()
    
    // Configure base options with inherited settings
    baseOpts := aicommon.ConvertConfigToOptions(c.Config)
    baseOpts = append(baseOpts,
        aicommon.WithID(c.Config.Id),
        aicommon.WithPersistentSessionId(c.Config.PersistentSessionId),
        aicommon.WithWrapperedAICallback(c.QualityPriorityAICallback),
        aicommon.WithAllowPlanUserInteract(true),
        aicommon.WithEventInputChanx(inputChannel),
        aicommon.WithContext(ctx),
        aicommon.WithEnablePlanAndExec(false), // Prevent infinite recursion
        aicommon.WithHotPatchOptionChan(hotpatchChan),
    )
    
    // Create and execute loop
    mainloop, err := reactloops.CreateLoopByName(taskTypeName, invoker, defaultOptions...)
    // ...
}
```

### 4.4 Task State Management

```go
// From runtime.go - Task invocation with state tracking
func invokeTask(current *AiTask) error {
    // Check if task was skipped by user
    if current.GetStatus() == aicommon.AITaskState_Skipped {
        r.config.EmitInfo("subtask %s was skipped by user, moving to next task", current.Name)
        return nil
    }

    // Check global context
    if r.config.IsCtxDone() {
        return utils.Errorf("coordinator context is done")
    }

    // Check task-specific context
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

![Recursive Stack Architecture](/img/data-flow-recursive-stack.jpg)

## 5. Data Flow Metrics

### 5.1 Event Processing Guarantees

| Guarantee | Mechanism | Description |
|-----------|-----------|-------------|
| **Delivery** | Mirror callback chain | Events reach all active agents |
| **Ordering** | Timestamp-ordered maps | Timeline maintains temporal order |
| **Consistency** | Shared Timeline reference | Parent-child see same data |
| **Durability** | Database persistence | Timeline survives restarts |

### 5.2 Memory Management Strategy

| Strategy | Trigger | Action |
|----------|---------|--------|
| **Per-Item Shrink** | Item size > `perDumpContentLimit` | AI summarization |
| **Batch Compress** | Total size > `totalDumpContentLimit` | Compress oldest 50% |
| **Reducer Storage** | Post compression | Store summary in `reducers` map |
| **Soft Delete** | Item removal | Mark as deleted, preserve in summaries |

## 6. Conclusion

The Memfit AI data flow architecture achieves several critical properties:

1. **Real-Time Event Propagation**: The Mirror mechanism ensures user signals reach active agents instantly, regardless of recursion depth.

2. **Continuous Context**: The Timeline maintains a complete execution history, compressed intelligently to balance context richness with memory efficiency.

3. **Recursive Composability**: The OODA loop can be nested arbitrarily, with each level maintaining proper context isolation while sharing the global Timeline.

4. **Memory Integration**: Every phase of execution is enriched by both short-term (Timeline) and long-term (MemoryTriage) memory systems.

This architecture enables Memfit AI to maintain coherent, context-aware execution across complex, multi-step tasks while remaining responsive to real-time user control signals.
