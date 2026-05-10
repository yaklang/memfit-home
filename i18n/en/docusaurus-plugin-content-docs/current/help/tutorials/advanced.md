---
sidebar_position: 4
title: Advanced Usage
---

# Advanced Usage

This chapter covers model usage inspection, cache and context diagnostics, manual intervention during execution, and custom tools or SKILLs for reusable team workflows.

【Image: Advanced usage overview, labeling the usage panel, context editing entry, tool editor, and SKILL editor】

## What This Chapter Contains

| Page | Use it when you want to |
| --- | --- |
| [Usage and Model Performance](/docs/help/tutorials/advanced/usage-and-model-performance) | Inspect token usage, cache hits, context pressure, speed, and jitter. |
| [Manual Intervention and Context Editing](/docs/help/tutorials/advanced/intervention-and-context) | Pause, redirect, add constraints, or edit global and local context while Agent is working. |
| [Custom Tools and Custom SKILLs](/docs/help/tutorials/advanced/custom-tools-and-skills) | Package team scripts, checks, and repeatable workflows into reusable Agent capabilities. |

## Suggested Troubleshooting Order

When a task behaves poorly, check it in this order:

1. Inspect usage and model performance to see whether the issue is context size, cache misses, model tier selection, or network jitter.
2. Inspect execution behavior to see whether Agent misunderstood the task, picked the wrong tool, or needs sharper constraints.
3. Package the workflow if it repeats often, so you do not have to rewrite the same prompt each time.

【Image: Advanced troubleshooting flow from usage panel to context edits to tool and SKILL packaging】

## Common Scenarios

| Symptom | Read first |
| --- | --- |
| A task suddenly consumes many tokens | [Usage and Model Performance](/docs/help/tutorials/advanced/usage-and-model-performance) |
| Similar prompts have low cache hits | [Usage and Model Performance](/docs/help/tutorials/advanced/usage-and-model-performance) |
| First-token or total latency jitters | [Usage and Model Performance](/docs/help/tutorials/advanced/usage-and-model-performance) |
| Agent is already running in the wrong direction | [Manual Intervention and Context Editing](/docs/help/tutorials/advanced/intervention-and-context) |
| You want to change constraints for this task only | [Manual Intervention and Context Editing](/docs/help/tutorials/advanced/intervention-and-context) |
| You want all future tasks to follow team rules | [Manual Intervention and Context Editing](/docs/help/tutorials/advanced/intervention-and-context) |
| You want Agent to call an internal script | [Custom Tools and Custom SKILLs](/docs/help/tutorials/advanced/custom-tools-and-skills) |
| You want to reuse a repeatable workflow | [Custom Tools and Custom SKILLs](/docs/help/tutorials/advanced/custom-tools-and-skills) |

## Relationship to Basic Configuration

Basic configuration controls Agent defaults. Advanced usage helps you observe and intervene after tasks start.

| Basic setting | How to tune it later |
| --- | --- |
| **Pressure token threshold** | Compare it with Pressure in the usage panel. |
| **Review rule** | Decide which plans, tools, and SKILLs should require confirmation. |
| **Calling mode** | Compare actual high-quality, lightweight, and vision model consumption. |
| **Disable Tools / AI review** | Decide which custom capabilities are safe to expose to Agent. |

## Next Step

Start with [Usage and Model Performance](/docs/help/tutorials/advanced/usage-and-model-performance) to understand task cost and stability.
