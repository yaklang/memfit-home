---
sidebar_position: 2
title: Data Flow
---

# Data Flow and Interaction

Memfit AI's data flow is a complex network supporting bidirectional interaction and dynamic branching, intelligently adapting control flows based on user entry points.

## Dual-Mode User Entry

### Coordinator Entry (Plan-Execute Mode)

- **Scenario:** Vague or complex tasks (e.g., "Comprehensive security audit")
- **Flow:** User → Coordinator → Planning Loop (Task Tree) → Review → Runtime → ReAct Loops
- **Interaction Points:**
  - **Planning Review** - User approves or modifies the plan
  - **Global Interrupt** - User can pause or cancel execution

### ReAct Entry (Instant Execution Mode)

- **Scenario:** Clear, atomic instructions (e.g., "Scan specific IP")
- **Flow:** User → ReAct Loop → Thought → Action → Observation
- **Interaction Points:**
  - **Ask for Clarification** - When information is missing
  - **Action Confirmation** - For sensitive operations

## Core Data Flow Loop

Regardless of the entry point, data flows through a closed loop:

### 1. Context Construction

Input (Query + History) is augmented by:
- **Memory Triage** - Long-term memory retrieval
- **RAG System** - Domain knowledge enhancement

### 2. Decision Making

LLM outputs structured instructions based on the enriched context:
- Plan JSON for complex tasks
- ReAct Thought/Action for atomic operations

### 3. Execution & Interaction

The system either:
- Invokes tools (local or MCP)
- Triggers human-machine collaboration

### 4. Feedback & Learning

- Tool outputs provide short-term feedback
- Memory Triage asynchronously analyzes execution traces
- Key information is persisted to the vector database

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      User Input                              │
└─────────────────────────────┬───────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              Context Construction                            │
│  ┌───────────────┐         ┌───────────────┐                │
│  │ Memory Triage │         │  RAG System   │                │
│  └───────┬───────┘         └───────┬───────┘                │
│          └─────────────┬───────────┘                        │
└────────────────────────┼────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   Decision Making (LLM)                      │
│         Plan Generation / ReAct Reasoning                    │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                 Execution & Interaction                      │
│  ┌───────────────┐    ┌───────────────┐    ┌─────────────┐  │
│  │  Local Tools  │    │  MCP Tools    │    │   Human     │  │
│  └───────────────┘    └───────────────┘    └─────────────┘  │
└─────────────────────────┬───────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                  Feedback & Learning                         │
│    Results → Memory Update → Vector DB Persistence           │
└─────────────────────────────────────────────────────────────┘
```

