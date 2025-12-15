---
sidebar_position: 1
title: Overview
---

# Memfit AI Overview

## What is Memfit AI?

Memfit AI is an intelligent agent system designed for the cybersecurity domain, powered by the **Yaklang** ecosystem. It goes beyond simple chatbots by implementing a **Recursive Dual-Engine Architecture** that combines strategic planning with tactical execution.

At its core, Memfit AI is a bridge between high-level human intent ("Audit this website") and low-level security operations (port scanning, vulnerability analysis). It achieves this by organically fusing:
*   **Determinism:** Structured planning for complex workflows.
*   **Flexibility:** Adaptive execution for dynamic environments.

![Memfit AI Concept](/img/memfit-ai-concept.jpg)

## What Problems Does It Solve?

Traditional AI agents often face the "Single Paradigm Dilemma":
*   **Pure ReAct Agents** easily get lost in long-horizon tasks, losing track of the original goal after many steps.
*   **Pure Plan-Execute Agents** are too rigid, failing when the initial plan encounters unexpected obstacles or new information.

Memfit AI solves this by **recursively coupling** these two paradigms. It creates a plan, executes it, and if a sub-task becomes too complex, it recursively triggers a new planning phase. This allows it to handle tasks of arbitrary complexity while adapting to real-time feedback.

---

## Core Architecture: The 5 Pillars

Memfit AI is built around five key components that work in concert to deliver intelligent security capabilities.

![Memfit AI Architecture Pillars](/img/memfit-5-pillars.jpg)

### 1. Plan Engine (Strategic Layer)

**The Problem:**
Complex security tasks (e.g., "Penetration Test") cannot be solved in a single step. They require a roadmap to ensure coverage and logical progression.

**The Solution:**
The Plan Engine acts as the strategist. It breaks down vague, top-level user goals into a structured **Task Tree**. It anticipates dependencies (e.g., "Scan ports before identifying services") and sets the execution order.

**Technical Architecture:**
*   **Task Tree Generation:** Deconstructs goals into hierarchical subtasks.
*   **Dependency Management:** Enforces temporal and logical execution order.
*   **Recursive Triggering:** Can be invoked by the ReAct engine when a subtask is too complex.

### 2. ReAct Engine (Tactical Layer)

**The Problem:**
The real world is non-deterministic. A scanner might time out, a port might be closed, or a new vulnerability might be discovered. A static script cannot adapt to these changes.

**The Solution:**
The ReAct Engine handles the "Last Mile" of execution. For each atomic task in the plan, it spins up an independent loop of **Observation-Thought-Action**. It perceives the environment, reasons about the current state, and chooses the next best action.

**Technical Architecture:**
*   **LoopEngine:** Manages the OODA (Observe-Orient-Decide-Act) cycle.
*   **Spin Detection:** Prevents the agent from getting stuck in infinite loops (e.g., retrying a failed command endlessly).
*   **Self-Reflection:** Analyzes failures to generate correction plans automatically.

### 3. Tools & Forges (Capability Layer)

**The Problem:**
An AI model is a "Brain in a Vat"—it cannot touch the network or files system directly. It needs specialized interfaces to interact with the cybersecurity world.

**The Solution:**
*   **Tools:** Standardized atomic capabilities (e.g., `PortScan`, `ReadFile`, `HttpReq`).
*   **Forges:** Scenario-based "Blueprints" that package specific prompts, tools, and logic for a domain (e.g., "Java Code Audit Forge").

**Technical Architecture:**
*   **Yaklang Integration:** Natively leverages Yaklang's powerful security libraries.
*   **MCP Support:** Compatible with the Model Context Protocol for extensibility.
*   **Focus Mode:** Allows instantiating specialized environments for specific subtasks.

### 4. Knowledge (RAG System)

**The Problem:**
LLMs have a training cutoff and lack private or highly specific domain knowledge (e.g., the latest CVE details or internal API docs).

**The Solution:**
The RAG (Retrieval-Augmented Generation) System serves as an active "External Brain." It retrieves relevant documentation, past reports, and security knowledge to ground the AI's reasoning in fact.

**Technical Architecture:**
*   **Hybrid Indexing:** Combines vector search (semantic) with keyword search (precision).
*   **Agentic Retrieval:** The system actively decides *when* and *what* to search for, rather than just passively retrieving context.

### 5. Memory (Context Layer)

**The Problem:**
Standard LLM sessions are stateless. The agent forgets what happened in the previous audit or what the user's preferences are, leading to repetitive mistakes.

**The Solution:**
The Memory System acts as an "Intelligent Hippocampus." It doesn't just store logs; it evaluates, scores, and indexes experiences. Successful strategies are remembered; failures are stored as "lessons learned."

**Technical Architecture:**
*   **C.O.R.E. P.A.C.T. Framework:** A scoring system to determine which memories are worth keeping (Connectivity, Relevance, Actionability, etc.).
*   **Vector Database:** Persists high-value memories for long-term recall across sessions.
