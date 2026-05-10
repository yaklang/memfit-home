---
sidebar_position: 1
title: Agent Tutorial
---

# Agent Tutorial

AI Agent is Memfit's main workspace. It is not just a chat box; it can read context, call tools, enter focus modes, request Review, and execute tasks.

This chapter follows the normal usage order: configure permissions, enter tasks with `@` context, then specify tools, knowledge bases, SKILLs, and focus modes.

【Image: AI Agent workspace labeling input box, @ context entry, Review panel, resource panel, focus mode entry, and model/usage entry】

## Understand Permissions First

What Agent can do depends on the permissions you give it. Before the first real task, complete permission control in [Basic Configuration and Custom AI Configuration](/docs/help/quick-start/tier-ai).

| Setting | Meaning | Recommendation |
| --- | --- | --- |
| **Enable system file permissions** | Allow AI to read, create, or modify files in authorized areas. | Usually needed for real project analysis; disable it for chat-only use. |
| **Disable Tools** | Prevent AI from calling tools. | Keep it off when you want Agent to execute tasks. |
| **Review rule: Manual** | Plans, tool calls, and file operations require user confirmation. | Recommended for beginners and real projects. |
| **Review rule: AI** | AI decides whether an operation can continue. | Good for low-risk repetitive tasks. |
| **Review rule: Yolo** | Prefer automatic execution and fewer confirmations. | Use only in sandboxed, read-only, low-risk tasks. |
| **Disable tool runtime AI review** | Skip AI review while tools are running. | Faster, but removes an extra risk check. |
| **Risk threshold** | Controls which actions pass automatically and which require confirmation. | Looser thresholds mean more automatic execution. |

【Image: Basic settings panel labeling file permission, Review rule, risk threshold, Disable Tools, and Disable tool runtime AI review】

### How to Configure Fully Automatic Execution

If you explicitly want Agent to run a task with minimal interruption:

1. Enable **system file permissions**.
2. Keep **Disable Tools** off.
3. Set **Review rule** to `Yolo`.
4. Raise **risk threshold** according to task risk.
5. If you want fewer mid-run pauses, enable **Disable tool runtime AI review**.

:::warning
Fully automatic execution reduces human confirmation and risk blocking. Agent may read the wrong directory, call an unsuitable tool, create or modify unexpected files, or amplify mistakes during network requests, command execution, and batch file operations. Use it only in sandboxes, read-only tasks, demos, or scopes you fully understand.
:::

### Why Manual Review and AI Review Matter

`Manual` is not just friction. It keeps critical decisions with you. Use it for:

- File modification, deletion, overwrite, and batch generation.
- Network access, scanning, and external requests.
- Command execution, scripts, and toolchains.
- Private files, customer data, credentials, and production environments.

`AI` review is a middle ground between speed and safety. AI evaluates the tool name, parameters, context, and risk hints, but it cannot replace your understanding of real business boundaries.

## Enter a Task

Use natural language in the input box. You do not need a fixed command format. Agent decides whether to answer directly, create a plan, call tools, or ask for Review.

A good task includes goal, scope, output format, and permission boundary:

```text
Read-only analyze the current project. Explain main directories, entry files, configuration, and startup commands.
Output a Markdown guide for new developers. Do not modify files.
```

【Image: Natural-language task in the input box, labeling goal, scope, output format, and permission boundary】

For complex tasks, ask for a plan first:

```text
Do not run tools yet. First describe how you plan to analyze this project.
Wait for my confirmation before continuing.
```

## Use @ to Add Context

When entering a task, use the `@` system to attach files, knowledge bases, tools, SKILLs, or focus modes. `@` explicitly tells Agent what you want it to reference or use.

| @ object | Use when | Example |
| --- | --- | --- |
| **@file / @directory** | Analyze specific files, logs, configs, or project folders. | "Analyze startup based on @README.md and @package.json." |
| **@knowledge base** | Answer according to team rules, product docs, or vulnerability materials. | "Audit this authorization logic based on @TeamSecurityRules." |
| **@tool** | Ask AI to use a specific tool for checking, querying, or conversion. | "Use @TLSCertificateChecker to inspect example.com." |
| **@SKILL** | Apply a repeatable scenario workflow. | "Use @JavaCodeAuditSkill to analyze @src/main/java/auth." |
| **@focus mode** | Enter an execution loop specialized for a task type. | "Use @CodeSecurityAuditFocusMode for this module." |

【Image: @ menu in the input box showing file, knowledge base, tool, SKILL, and focus mode candidates】

You can combine natural language with multiple `@` items:

```text
Based on @TeamSecureCodingRules, use @CodeSearchTool,
read-only analyze @src/auth for authorization-bypass risks.
Output severity, evidence path, trigger condition, and remediation.
```

## AI Can See Your User Space

After system file permissions are enabled, Agent can read task-related files in authorized user space and perform file operations after Review approval. This lets it work on real projects without copying everything into chat.

Common operations:

- Read the current project and summarize structure.
- Inspect a config file for problems.
- Analyze logs and identify likely causes.
- Audit a code directory in read-only mode.
- Generate documents, scripts, or remediation files after confirmation.

【Image: Selecting local files or directories as context, labeling user space, project directory, and read/write Review】

For real files:

1. Give a clear scope, such as "only inspect `src/auth`, skip `node_modules`".
2. Keep `Manual Review` for write operations.
3. Avoid accidentally attaching secrets, customer data, personal data, or production credentials.
4. Ask Agent to include file paths and evidence locations.

## Specify a Tool or Knowledge Base

If you do not want Agent to choose freely, specify the tool or knowledge base with `@` and state the boundary in the task.

Specify a knowledge base:

```text
Answer only based on @MemfitUserManual:
How do I configure basic AI models and permission control?
If the knowledge base does not contain the answer, say "not covered in the materials".
```

Specify a tool:

```text
Use @TLSCertificateChecker to inspect the certificate expiration for example.com.
Do not use other network scanning tools.
```

Combine knowledge base and tool:

```text
Based on @TeamSecurityRules, use @CodeSearchTool,
check whether @src/auth contains unauthenticated access.
Read-only analysis. Do not modify files.
```

【Image: @ knowledge base and @ tool in the input box, labeling specified use and limiting other tools】

If Agent still chooses an unsuitable tool, reject it in Review and add:

```text
Reject this tool call. Use only the tool I @mentioned. Do not call other tools.
```

## Handle Plans and Review

For complex tasks, Memfit may create a plan or task tree. Check:

1. Whether the goal is understood correctly.
2. Whether the scope is too broad.
3. Whether sensitive paths may be accessed.
4. Whether files may be modified or high-risk tools may run.
5. Whether it uses the knowledge base, tool, SKILL, or focus mode you specified.

When Agent is about to run tools, operate on files, or execute a SKILL, Memfit triggers Review according to your settings.

| Review type | What you see | Recommendation |
| --- | --- | --- |
| **Plan Review** | Steps, goal, execution approach | Confirm direction before continuing. |
| **Tool Review** | Tool name, parameters, possible impact | Check target, path, parameters, and risk. |
| **File Review** | File read, write, modification, or generation | Manually confirm write operations. |
| **SKILL Review** | SKILL name, description, parameters | Confirm scenario and inputs. |
| **Focus mode Review** | Focus mode and target | Confirm the mode fits the task. |

【Image: Review panel labeling tool name, parameters, risk note, approve/reject/add-constraint controls】

## What Is Focus Mode?

A focus mode is an Agent execution loop specialized for a task type. A normal Agent can plan freely; a focus mode preconfigures prompts, tools, actions, steps, and finalization for a specific scenario.

Think of it as Agent with a professional workflow.

Why focus modes matter:

- Constrain Agent's action space and reduce drift.
- Provide stable steps for complex tasks.
- Auto-load suitable tools and output format.
- Avoid rewriting long prompts every time.
- Improve consistency for security audits, traffic analysis, report generation, and similar scenarios.

【Image: Focus mode selector labeling default, code security audit, knowledge-enhanced Q&A, report generation, and other modes】

## Useful Focus Modes

Actual names may vary by version, but these types are common:

| Focus mode | Good for | Use when |
| --- | --- | --- |
| **General ReAct / default** | General Q&A, light analysis, open exploration. | The task has no clear specialized domain. |
| **Smart Q&A / knowledge-enhanced Q&A** | Answering from a knowledge base. | You need strict reference to docs, rules, or manuals. |
| **Directory exploration** | Project structure, entry points, module relationships. | You are seeing a project for the first time. |
| **Report generation** | Turning materials into structured reports. | You already have materials and need polished output. |
| **Code security audit** | Authorization, injection, path traversal, secret exposure. | You want to inspect a code directory for security risks. |
| **HTTP traffic analysis** | Requests, responses, API behavior, abnormal traffic. | You have HTTP flows or API records. |
| **Infosec reconnaissance** | Multi-tool information collection. | You are doing authorized security testing or asset analysis. |
| **SyntaxFlow rule writing** | Generate or debug SyntaxFlow rules. | You want to turn audit ideas into rules. |
| **Yaklang / Python script generation** | Generate helper scripts. | You need automation scripts drafted by Agent. |

Example:

```text
Enter @CodeSecurityAuditFocusMode.
Read-only analyze @src/auth for authorization-bypass risks.
First produce a plan and wait for my confirmation.
```

For focus mode development and extension, read the top-level **Developer Guide**.

## Observe Execution and Validate Results

During execution, the conversation shows plan, action, observation, interim summary, and final response.

Validate:

1. Whether it followed your scope and permission boundary.
2. Whether it used the files, knowledge bases, tools, or focus modes you `@mentioned`.
3. Whether it included evidence paths, tool results, or knowledge-base sources.
4. Whether the conclusions are actionable rather than generic.

Follow-up:

```text
Turn the findings into a remediation checklist for the development team.
Keep evidence path and priority for each item.
```

## Common Task Templates

### Project Understanding

```text
Use @DirectoryExplorationFocusMode to read-only analyze @currentProject.
Explain directory structure, entry points, configuration, and startup commands.
Do not modify files.
```

### Code Audit

```text
Use @CodeSecurityAuditFocusMode, based on @TeamSecurityRules,
read-only audit @src/auth.
Focus on authentication, authorization, and sensitive data exposure.
Output severity, evidence location, and remediation.
```

### Knowledge Base Q&A

```text
Answer only based on @MemfitUserManual:
How do I configure permission control and custom AI models?
Do not use information outside the knowledge base.
```

### Specific Tool Execution

```text
Use @TLSCertificateChecker to inspect example.com.
Only output subject, issuer, expiration, days remaining, and risk notes.
```

## Next Steps

- [Knowledge Base Tutorial](/docs/help/tutorials/knowledge-base)
- [Loading and Using SKILLS](/docs/help/tutorials/skills)
- [Manual Intervention and Context Editing](/docs/help/tutorials/advanced/intervention-and-context)
- [Advanced Usage](/docs/help/tutorials/advanced)
