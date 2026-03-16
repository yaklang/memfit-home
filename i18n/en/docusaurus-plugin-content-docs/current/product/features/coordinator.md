---
sidebar_position: 1
title: Coordinator
---

# Coordinator

The Coordinator is the central hub of Memfit AI, acting as the system bus and lifecycle manager.

## Core Responsibilities

### Session Context Management

The Coordinator manages all aspects of the session:
- Maintains conversation history
- Tracks task state and progress
- Manages user preferences and settings
- Coordinates between components

### Configuration Loading

The Coordinator handles system configuration:
- Loads tool configurations
- Initializes Forge modules
- Sets up memory and RAG systems
- Configures reliability mechanisms

### User Intent Bridge

Acts as the bridge between user intent and system execution:
- Interprets user requests
- Routes to appropriate execution mode
- Manages human-in-the-loop interactions
- Handles interrupts and cancellations

## Task State Machine

The Coordinator maintains a global task state machine:

```
┌─────────┐     ┌──────────┐     ┌───────────┐
│ Pending │ ──→ │ Planning │ ──→ │ Reviewing │
└─────────┘     └──────────┘     └─────┬─────┘
                                       ↓
┌──────────┐     ┌───────────┐     ┌───────────┐
│ Completed│ ←── │ Executing │ ←── │ Approved  │
└──────────┘     └───────────┘     └───────────┘
```

### States

| State | Description |
|-------|-------------|
| Pending | Task received, awaiting processing |
| Planning | Plan Engine generating task tree |
| Reviewing | Human-in-the-loop review phase |
| Approved | Plan approved, ready for execution |
| Executing | ReAct loops actively running |
| Completed | All subtasks finished |

## Subtask Monitoring

The Coordinator monitors all subtask execution:
- Tracks individual subtask progress
- Detects failures and triggers recovery
- Manages resource allocation
- Reports status to user interface

## Interaction Patterns

### Plan-Execute Mode

1. Receive complex user intent
2. Initialize Plan Engine
3. Generate task tree
4. Present for user review
5. Upon approval, dispatch to ReAct loops
6. Monitor execution
7. Report results

### Instant Execution Mode

1. Receive atomic instruction
2. Direct dispatch to ReAct loop
3. Monitor execution
4. Return results immediately

## Integration Points

The Coordinator integrates with all major components:
- **Plan Engine** - Task decomposition
- **ReAct Loops** - Task execution
- **Memory Triage** - Context enhancement
- **RAG System** - Knowledge retrieval
- **Tools & Forges** - Capability access

