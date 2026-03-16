---
sidebar_position: 2
title: ReAct Loop
---

# ReAct Loop

The ReAct Loop is the minimal execution unit in Memfit AI, driving the "Reasoning-Acting" cycle within an independent context.

## Core Components

### LoopEngine

The LoopEngine manages the state flow of each ReAct iteration:
- Handles state transitions
- Manages iteration limits
- Tracks execution history
- Coordinates with reliability mechanisms

### Action Registry

The Action Registry maintains available actions:
- Registers custom actions
- Maps action names to implementations
- Validates action parameters
- Handles action lifecycle

### Prompt Manager

The Prompt Manager generates context for LLM:
- Constructs system prompts
- Injects tool descriptions
- Adds memory context
- Formats conversation history

## Execution Cycle

Each ReAct Loop follows this cycle:

```
┌──────────────────────────────────────────┐
│              OBSERVATION                  │
│   Collect environment state & feedback    │
└─────────────────────┬────────────────────┘
                      ↓
┌──────────────────────────────────────────┐
│               THOUGHT                     │
│      LLM reasoning & spin detection       │
└─────────────────────┬────────────────────┘
                      ↓
┌──────────────────────────────────────────┐
│               ACTION                      │
│    Execute tool or request information    │
└─────────────────────┬────────────────────┘
                      ↓
                 (Next Iteration)
```

## Focus Mode

Focus Mode allows defining specialized execution contexts:

### Use Cases

- **Code Audit Mode** - Specialized for code analysis
- **Vulnerability Scan Mode** - Optimized for security scanning
- **Report Generation Mode** - Focused on documentation

### Implementation

A Loop can be encapsulated as an Action, allowing:
- Push current context onto stack
- Start a specialized sub-Loop
- Complete focused task
- Pop and return to parent context

## Dynamic Capabilities

### Suspension & Escalation

The ReAct Loop supports:
- **Dynamic Suspension** - Pause for human input
- **Help Requests** - Ask user for clarification
- **Plan Triggering** - Escalate to Plan Engine for complex subtasks

### Mode Switching

Seamless switching between:
- Instant execution mode
- Plan-execute mode
- Focus mode

## Reliability Features

### Built-in Protection

- **Self-Reflection** - Analyzes failures within the loop
- **Spin Detector** - Prevents infinite loops
- **Step Limits** - Enforces maximum iterations

### Error Recovery

When errors occur:
1. Capture error context
2. Trigger self-reflection
3. Generate correction plan
4. Retry with enhanced awareness

## Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `maxSteps` | Maximum iterations | 20 |
| `spinThreshold` | Steps before spin detection | 3 |
| `reflectionTrigger` | When to trigger reflection | On error |
| `focusMode` | Specialized mode name | None |

