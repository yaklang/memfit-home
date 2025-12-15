---
sidebar_position: 2
title: Data Flow
---

# Data Flow and Interaction

Memfit AI's data flow is designed to support **recursive execution** and **state continuity**. Unlike stateless chatbots, Memfit AI maintains a continuous "Thread of Execution" (Timeline) that flows across different engines (Plan & ReAct) and recursive levels.

## 1. Unified Event Bus (InputEventManager)

At the heart of the interaction model is the `InputEventManager`. It acts as a **Pub/Sub System** ensuring that user signals (interrupts, messages, reviews) reach the currently active agent, no matter how deep it is in the recursion stack.

### Event Mirroring Mechanism

When a Parent Agent (e.g., The Coordinator) spawns a Child Agent (e.g., A ReAct Loop for a specific task):

1.  The Parent registers a **"Mirror"** on the `InputEventManager`.
2.  Any event sent to the Parent's session is automatically **replicated** to the Child's input channel.
3.  This ensures that if the user clicks "Stop" or types a correction, the active leaf node receives it instantly.

![Event Mirroring Mechanism](/img/data-flow-event-mirroring.jpg)

> **[Diagram Placeholder: Event Mirroring & Dispatch]**
> *   **Layout:** Top-down data flow.
> *   **Nodes:**
>     1.  **User Input Source** (e.g., Web UI / CLI)
>     2.  **InputEventManager** (The Central Dispatcher)
>     3.  **Parent Agent Channel** (Coordinator, SessionID: A)
>     4.  **Mirror Registry** (Logic Component inside Manager)
>     5.  **Child Agent Channel** (ReActLoop, SessionID: B)
> *   **Connections:**
>     *   User Input -> InputEventManager
>     *   InputEventManager -> Parent Agent Channel (Direct Route)
>     *   InputEventManager -> Mirror Registry -> Child Agent Channel (Mirrored Route)
> *   **Annotations:**
>     *   Label the link to Child as "Mirror(Event)"
>     *   Show "Stop Signal" propagating to both instantly.
> *   **Key Takeaway:** Demonstrates that the Child is not isolated; it receives real-time control signals through the Mirror mechanism without parent intervention.

## 2. The Context Stream (Timeline)

Data does not just flow "down" to agents; context flows "along" with them. The **Timeline** is the shared memory structure that preserves the state of the world.

*   **Inheritance:** When a sub-plan is triggered, the new Coordinator inherits the **reference** to the parent's Timeline.
*   **Synchronization:** Actions performed by the child (e.g., "Discovered Port 80") are written to this shared Timeline.
*   **Visibility:** When control returns to the parent, it instantly "sees" the new data added by the child.

## 3. Core Data Flow Loop

Regardless of the entry point (Coordinator or ReAct), the data processing follows a rigorous **OODA (Observe-Orient-Decide-Act)** loop enriched by external memory.

### Step 1: Context Construction (The "Orient" Phase)

Before the LLM makes a decision, the raw input is hydrated with context:

*   **Short-Term Memory:** The current `Timeline` (recent tool outputs, thoughts).
*   **Long-Term Memory:** The `MemoryTriage` component actively retrieves relevant past experiences (e.g., "How we solved a similar error last week") from the Vector Database.
*   **RAG Knowledge:** Relevant documentation or vulnerability data is fetched.

### Step 2: Decision & Execution (The "Decide & Act" Phase)

The LLM generates a structured payload (JSON or Function Call).

*   **Spin Detection:** Before execution, the system checks for "Cognitive Loops" (repeating the same thought) or "Action Loops" (repeating the same failed command).
*   **Tool Dispatch:** Valid actions are routed to:
    *   **Local Tools:** Built-in Go functions (PortScan, etc.).
    *   **MCP Tools:** External agents connected via Model Context Protocol.
    *   **Recursive Calls:** `RequestPlanExecution` to spawn a new engine instance.

### Step 3: Feedback & Persistence (The "Observe" Phase)

Execution results are not just returned; they are **Triaged**.

*   **Immediate Feedback:** Added to the Timeline for the next loop iteration.
*   **Asynchronous Learning:** The `MemoryTriage` system analyzes the execution trace in the background. If a unique solution or a critical failure is detected, it is summarized and persisted to the **Long-Term Vector Memory**.

![OODA Loop Execution](/img/data-flow-ooda-loop.jpg)

## 4. Recursive Data Flow (The "Call Stack")

This section illustrates what happens when the "Dual-Engine" switch activates.

1.  **Trigger:** ReAct Loop encounters high complexity -> Calls `RequestPlanExecution`.
2.  **Context Switch:**
    *   Current ReAct Loop **pauses**.
    *   New Coordinator **initializes** with a child context.
3.  **Execution:** The Child Coordinator builds a sub-task tree and executes it.
4.  **Return:** The Child returns a **Summary Report** to the Parent ReAct Loop.
5.  **Resumption:** The Parent treats the summary as the output of a single "Tool Call" and continues its loop.

![Recursive Stack & Shared State](/img/data-flow-recursive-stack.jpg)

>  **[Diagram Placeholder: Recursive Stack & Shared State]**

> *   **Layout:** Vertical Stack (representing depth) + Side Bar (representing shared state).
>*   **Stack Layers:**
>     *   **Level 0 (Top):** Parent ReAct Loop. State: *[PAUSED / AWAITING]*
>     *   **Level 1 (Middle):** Child Coordinator. State: *[ACTIVE / SCHEDULING]*
>     *   **Level 2 (Bottom):** Leaf ReAct Loops. State: *[RUNNING TOOLS]*
> *   **Side Bar:**
>     *   **Shared Timeline:** A vertical bar spanning all levels.
> *   **Connections:**
>     *   **Down:** Level 0 calls `RequestPlanExecution` -> Spawns Level 1.
>     *   **Sideways:** All levels read/write to Shared Timeline.
>     *   **Up:** Level 1 completes -> Returns `Summary Report` -> Resumes Level 0.
> *   **Key Takeaway:** Visualizes the "Function Call" model: The Parent waits while the Child executes. Crucially, they share the *same* Timeline reference, ensuring data consistency across levels.
