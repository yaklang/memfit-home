---
sidebar_position: 2
title: Manual Intervention and Context Editing
---

# Manual Intervention and Context Editing

Memfit Agent execution is not a black box. During planning, tool calls, SKILL execution, and final reporting, you can pause, redirect, add constraints, or adjust context for later steps.

【Image: Task execution flow labeling plan, Review, tool call, observation, final response, and intervention points】

## When to Intervene

| Symptom | Recommended action |
| --- | --- |
| The plan includes unrelated steps | Reject it in Review or ask Agent to revise the plan. |
| Tool parameters are too broad | Edit or constrain the target path, range, or count. |
| Agent misunderstood the task | Add a short explicit correction immediately. |
| Output format drifts | Add a fixed template or required fields. |
| Irrelevant material enters context | Remove local context or separate long-term rules from temporary evidence. |

## Intervene in Review

Review is the best point to intervene because the operation has not executed yet.

| Action | Use when |
| --- | --- |
| **Approve** | The plan, tool, and parameters are correct. |
| **Reject** | Direction is wrong, risk is high, or scope is too broad. |
| **Continue with constraints** | The direction is right but boundaries need tightening. |

【Image: Review panel labeling approve, reject, and add-constraint controls】

Example constraints:

```text
Continue, but only read files. Do not modify files.
Limit scanning to src/auth and src/session.
Every finding must include an evidence path.
```

## Edit Global Context

Global context is for stable rules that should affect later tasks and can improve cache stability.

Good global context:

- Team coding standards
- Fixed output format
- Project background and boundaries
- Security and compliance rules
- Operations Agent must not perform

【Image: Global context editor labeling long-term rules, project background, and permission boundaries】

Example:

```text
Global rules:
1. Every code-audit finding must include file path and function name.
2. Do not modify files unless confirmed.
3. Classify security findings as High / Medium / Low.
4. Respond in Chinese and avoid unsupported guesses.
```

Do not put frequently changing logs, temporary errors, or one-off file dumps in global context.

## Edit Local Context

Local context should affect only the current task or current phase.

| Content | Example |
| --- | --- |
| Current goal | "Only investigate login failures this time." |
| Temporary error | "Here is the latest build error." |
| Local file | "Only refer to this config file." |
| Output rule | "Only output remediation steps; do not edit code." |

【Image: Local context editor labeling current task, temporary logs, and local constraints】

Example:

```text
Only handle the login API in this run.
Ignore payment and order modules.
If you need files, read routes/auth.ts and services/session.ts first.
```

## Global vs Local Context

| Question | Choose |
| --- | --- |
| Should this rule apply to future tasks? | Global context. |
| Is this only useful for the current task? | Local context. |
| Is it large, temporary, or frequently changing? | Local context, then remove it. |
| Will it help stable cache hits? | Global context, but keep it concise. |

Long-term rules go global. Temporary evidence stays local.

## Redirect a Running Task

If Agent is already running, send a short, explicit correction.

Good intervention:

```text
Pause the current direction. Do not analyze the whole project.
Switch to authorization-bypass risks in auth middleware only.
First list the files you want to read and wait for my confirmation.
```

Weak intervention:

```text
Do not go off track.
```

## Verify After Intervention

After intervening, check:

1. Whether the next plan adopts the new boundary.
2. Whether tool parameters became smaller and more precise.
3. Whether the final answer follows your requested format.

If the task is still unstable, inspect context pressure in [Usage and Model Performance](/docs/help/tutorials/advanced/usage-and-model-performance). If the same manual corrections repeat, package the workflow as a [custom SKILL](/docs/help/tutorials/advanced/custom-tools-and-skills).
