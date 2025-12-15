---
sidebar_position: 3
title: Basic Concepts
---

# Basic Concepts

Understand the fundamental concepts behind Memfit AI.

## Execution Modes

### Instant Execution Mode

For clear, atomic tasks:

- **Entry**: Direct to ReAct Loop
- **Best for**: Single-step operations, queries, simple scans
- **Example**: "What is the HTTP response from google.com?"

### Plan-Execute Mode

For complex, multi-step tasks:

- **Entry**: Through Coordinator
- **Best for**: Audits, assessments, multi-phase operations
- **Example**: "Perform a comprehensive penetration test"

## The ReAct Loop

ReAct stands for **Reasoning and Acting**.

### Cycle

```
Observation → Thought → Action → Observation → ...
```

### Components

| Component | Purpose |
|-----------|---------|
| Observation | Gather information from environment |
| Thought | Reason about next steps |
| Action | Execute a tool or operation |

### Example

```
[Observation] User asked about port 443 on target.com

[Thought] I need to check if port 443 is open and identify the service.

[Action] PortScan(target: "target.com", ports: [443])

[Observation] Port 443 is open, running nginx/1.21.0

[Thought] Task complete. I'll report the finding.
```

## Task Trees

For complex tasks, Memfit AI creates **Task Trees**.

### Structure

```
Main Task
├── Subtask 1
│   ├── Sub-subtask 1.1
│   └── Sub-subtask 1.2
├── Subtask 2
└── Subtask 3
```

### Properties

- **Dependencies**: Tasks can depend on others
- **Parallelism**: Independent tasks run in parallel
- **Recursion**: Subtasks can spawn their own task trees

## Human-in-the-Loop

Memfit AI involves you at critical decision points.

### Plan Review

Before executing a plan:
- Review proposed steps
- Modify if needed
- Approve to proceed

### Action Confirmation

For sensitive operations:
- File modifications
- Network attacks
- System changes

### Clarification Requests

When information is missing:
- Ask for target details
- Request credentials
- Confirm scope

## Memory System

Memfit AI remembers and learns.

### Short-term Memory

- Current conversation context
- Execution state
- Recent observations

### Long-term Memory

- Previous interactions
- Learned patterns
- Error recovery strategies

### Benefits

- Improved accuracy over time
- Contextual recommendations
- Pattern recognition

## Tools and Forges

### Tools

Atomic capabilities:
- File operations
- Network requests
- Code execution
- Scanning

### Forges

Scenario-specific packages:
- Specialized prompts
- Curated tool sets
- Domain expertise
- Workflow logic

## Reliability Mechanisms

### Self-Reflection

When things go wrong:
- Analyze failure
- Generate correction plan
- Retry with improved context

### Spin Detection

Prevents infinite loops:
- Action repetition detection
- Logic loop detection
- Automatic intervention

## Summary

| Concept | Description |
|---------|-------------|
| ReAct Loop | Thought-Action-Observation cycle |
| Task Tree | Hierarchical task decomposition |
| Coordinator | Central orchestration component |
| Memory | Short and long-term context |
| Tools | Atomic operations |
| Forges | Scenario packages |

