---
sidebar_position: 3
title: Custom Tools and Custom SKILLs
---

# Custom Tools and Custom SKILLs

When an operation repeats, turn it from "write the prompt again" into a reusable capability. In Memfit, tools are atomic actions, while SKILLs are scenario workflows.

【Image: Resource area overview labeling tool list, tool editor, SKILL list, and SKILL editor】

## Tool or SKILL?

| What you want to package | Choose |
| --- | --- |
| One action with clear input and output | Custom tool |
| A script, query, or checker | Custom tool |
| A multi-step workflow | Custom SKILL |
| A fixed role, constraints, and output format | Custom SKILL |
| A combination of tools and knowledge bases | Custom SKILL |

Tools are the atomic pieces. SKILLs define how to use them.

## Custom Tools

Custom tools are atomic capabilities Agent can call. Use them to wrap internal scripts, checks, converters, queries, or team operations.

| Config | Recommendation |
| --- | --- |
| **Tool name** | Short, stable, and easy for Agent to identify. |
| **Description** | Explain purpose, when to use it, and when not to use it. |
| **Tags / keywords** | Include words Agent may search for. |
| **Parameter Schema** | Define types, required fields, and valid ranges. |
| **Source / logic** | Do exactly what the tool promises and avoid hidden side effects. |
| **Execution result** | Return structured output Agent can reason over. |

【Image: AI tool editor labeling basic info, description, parameter Schema, source, and test result】

### Tool Description Template

```text
Purpose: Check TLS certificate validity and certificate chain for a domain.
Use when: The user asks to inspect HTTPS certificate expiration or chain risk.
Input: domain, a domain name without http:// or https://.
Output: subject, issuer, expiration time, days remaining, chain status, and risk notes.
Limits: Only inspect certificate metadata. Do not exploit or send high-frequency requests.
```

### Parameter Schema Tips

| Parameter type | Recommendation |
| --- | --- |
| String | State whether URL, path, spaces, or special characters are allowed. |
| Number | Define min, max, and default. |
| Boolean | Explain what `true` and `false` mean. |
| Enum | Prefer modes such as `fast`, `safe`, and `deep`. |
| Path | State whether relative paths are allowed and whether they may leave the project directory. |

### Test the Tool

Before sharing a tool, test minimal input and boundary input.

Checklist:

- Empty parameters return clear errors.
- Invalid input is rejected.
- Results are understandable by Agent.
- Side effects such as file writes or network access are intentional.
- Failures return reasons rather than empty output.

## Custom SKILLs

SKILLs package reusable task strategy. They usually include role, workflow, tool selection, knowledge requirements, parameter UI, and output format.

Good SKILL candidates:

- Java code audit
- Web security baseline check
- Project handover document generation
- Log root-cause analysis
- Release readiness check
- Team convention review

【Image: SKILL editor labeling name, description, tool selection, prompts, parameter UI, and output template】

## Key SKILL Settings

| Config | Purpose |
| --- | --- |
| **Name and description** | Tell users and Agent what the SKILL is for. |
| **Tags** | Search and categorization. |
| **Tool list** | Limit which tools the SKILL can use. |
| **Knowledge requirements** | Specify required standards, docs, or historical materials. |
| **Initial prompt** | Define role, goal, and steps. |
| **Persistent prompt** | Define constraints that always apply. |
| **Parameter UI** | Collect target, path, language, output format, and other inputs. |
| **Review strategy** | Decide which steps require user confirmation. |

## Write SKILL Prompts as Workflows

Example:

```text
You are a Java code-audit assistant.
Workflow:
1. Confirm the audit scope from user input.
2. Only read the specified directory. Do not modify files.
3. Prioritize authorization, deserialization, SQL injection, and path traversal.
4. Every finding must include file path, function name, trigger condition, and remediation.
5. Do not report risks without evidence.

Output:
- Severity
- Evidence location
- Reason
- Reproduction idea
- Remediation
```

## Combine Tools and SKILLs

A stable SKILL usually has three parts:

| Part | Example |
| --- | --- |
| Task strategy | "Confirm scope, analyze entry points, then output a risk table." |
| Available tools | File reading, code search, dependency check, custom scanner. |
| Knowledge context | Team security rules, historical issues, project architecture. |

Example:

```text
Use the "Java authorization audit" SKILL.
Mount the "Team secure coding rules" knowledge base.
Read-only analyze src/main/java/auth.
Output a High / Medium / Low risk table with evidence paths.
```

## Pre-Share Checklist

1. Name and description are clear to normal users.
2. High-risk operations are limited.
3. Parameters are explicit.
4. Failure output is diagnosable.
5. Output format is stable.
6. Required knowledge bases or example tasks are documented.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Agent does not select the tool | Improve description and keywords. |
| Agent fills wrong parameters | Tighten the Schema with enums and ranges. |
| Tool output cannot be analyzed | Return structured fields instead of only prose. |
| SKILL output is unstable | Fix workflow and output template. |
| SKILL calls unrelated tools | Narrow the tool list or add persistent constraints. |

## Next Step

After creating a custom capability, validate it with a real task in [Agent Tutorial](/docs/help/tutorials/ai-agent). If you still need repeated corrections, refine global and local context from [Manual Intervention and Context Editing](/docs/help/tutorials/advanced/intervention-and-context).
