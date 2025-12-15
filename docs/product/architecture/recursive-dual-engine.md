---
sidebar_position: 1
title: Recursive Dual-Engine
---

# Recursive Dual-Engine Architecture

## What is the Recursive Dual-Engine?

The **Recursive Dual-Engine** is Memfit AI's core architectural innovation. It is not just a switch between two modes, but a **nested execution model** where a strategic planning engine can be invoked recursively as an atomic action within a tactical execution loop.

*   **Plan Engine (Strategic):** Deconstructs complex goals into a structured **Task Tree** (Directed Acyclic Graph). It handles dependencies, parallelism, and global state.
*   **ReAct Engine (Tactical):** Executes atomic tasks using an **OODA Loop** (Observe-Orient-Decide-Act). It handles tool invocation, error recovery, and dynamic reasoning.

**The "Recursive" aspect means:**
A ReAct Loop executing a leaf node task can decide, "This is too complex," and trigger the Plan Engine to generate a *sub-plan* for that specific node. This creates a fractal structure where tasks can be infinitely subdivided until they are solvable by atomic tools.

![Recursive Fractal Structure](/img/recursive-dual-engine-fractal.jpg)

## What Problems Does It Solve?

### 1. The "Lost in the Weeds" Problem
Pure ReAct agents often forget their high-level goal after 10+ steps of execution.
*   **Solution:** The Plan Engine maintains the **Global Task State**. Even if a sub-task takes 50 steps, the parent Coordinator knows exactly where it fits in the overall roadmap.

### 2. The "Rigidity" Problem
Pure Plan-Execute agents fail when the initial plan is flawed (e.g., "Scan server A" fails because server A is down).
*   **Solution:** The ReAct Engine handles **Runtime Adaptation**. It can retry, modify parameters, or even trigger a *re-planning* event without aborting the entire mission.

### 3. The "Complexity Horizon" Problem
No single prompt can handle a task requiring 100+ tools.
*   **Solution:** **Fractal Decomposition**. A complex task is broken down until it fits within the context window and reasoning capability of the LLM.

## How It Works: System Layering

The system is layered to ensure separation of concerns:

![Dual Engine Layering](/img/recursive-dual-engine-layering.jpg)

### Layer 1: The Coordinator (System Bus)
*   **Role:** Lifecycle manager and context container.
*   **Responsibility:**
    *   Initializes the session.
    *   Manages **Shared Memory** (Timeline) across all layers.
    *   Handles User Interrupts and Reviews.

### Layer 2: The Plan Engine (Strategist)
*   **Role:** Task generator and scheduler.
*   **Responsibility:**
    *   Generates the `AiTask` Tree from user intent.
    *   Manages **Control Flow** (Sequential, Parallel, If-Else).
    *   Dispatches leaf tasks to the Runtime.

### Layer 3: The ReAct Runtime (Tactician)
*   **Role:** Worker unit.
*   **Responsibility:**
    *   Instantiates `ReActLoop` for each leaf task.
    *   Executes Tools (`PortScan`, `ShellExec`).
    *   **Crucially:** Can invoke `RequestPlanExecution` as an action, calling back to Layer 1.

## Core Implementation Technologies

Based on the Yaklang codebase analysis, the recursive mechanism relies on several key technologies:

### 1. Planning as an Action
In `reactloop.go`, the Planning capability is registered as a standard tool action:
`AI_REACT_LOOP_ACTION_REQUEST_PLAN_EXECUTION`.
This means to the LLM, "Create a Sub-plan" is just a tool like "ReadFile".

### 2. Context Nesting & Mirroring
When a sub-plan is triggered (`invoke_plan_and_execute.go`):
*   A new `CoordinatorContext` is created, inheriting the parent's `Timeline`.
*   **Event Mirroring:** The `InputEventManager` bridges the parent's event stream to the child, allowing the user to interact with the deep sub-task seamlessly.

### 3. The Task Tree Data Structure
The `AiTask` structure supports recursive definitions:
```go
type AiTask struct {
    Name     string
    Subtasks []*AiTask  // Recursive definition
    Status   TaskStatus // Pending, Running, Completed, Failed
    // ...
}
```
The Coordinator traverses this tree using a DFS (Depth-First Search) strategy to schedule ReAct Loops.

### 4. Forges as Pre-compiled Plans
**Forges** (AI Blueprints) are implemented as pre-defined Plans. When a ReAct Loop invokes a Forge (e.g., "Java Audit Forge"), it is technically triggering a recursive Plan Execution with a preset template.

## References

*   **Yaklang Codebase:** `common/ai/aid/aireact/reactloops/reactloop.go` (Loop Logic)
*   **Yaklang Codebase:** `common/ai/aid/coordinator.go` (Task Scheduling)
*   **Paper:** *ReAct: Synergizing Reasoning and Acting in Language Models* (Yao et al., 2022) - The basis for the tactical layer.
*   **Paper:** *Plan-and-Solve Prompting* (Wang et al., 2023) - The basis for the strategic layer.
