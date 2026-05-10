---
sidebar_position: 2
title: Basic Settings and Custom AI Configuration
---

# Basic Settings and Custom AI Configuration

After installing and launching Memfit, configure two areas first:

1. **Basic settings**: control tool permissions, manual review, local file access, retries, and task limits.
2. **Custom AI configuration**: add your own AI provider, model, API Key, BaseURL / Endpoint, and routing policy.

These settings determine whether Memfit can complete tasks safely and reliably. For first-time use, follow the recommended setup below, then adjust the details for your workflow.

【Image: Memfit settings entry, showing the configuration panel and AI model configuration entry】

## Open Settings

In the Memfit main interface:

1. Click **Settings** or the configuration button in the upper-right corner.
2. Adjust basic settings in the chat configuration panel.
3. Open **AI Model Configuration** to add or select models.

If you want to start quickly, keep **Use default system AI configuration** enabled and review the permission controls. If you need to use your own API Key or private model service, continue with custom AI configuration.

## Basic Settings

Basic settings control what the AI Agent can do, when it needs user approval, and how it retries failed tasks.

### Permission Controls

| Setting | Recommendation | Purpose |
| --- | --- | --- |
| **Enable system file operation permission** | Enable as needed | Allows AI to read task files and generate or modify files. Enable it for real project work; disable it for chat-only demos. |
| **Disable Tools** | Keep disabled | When enabled, AI cannot call external tools and Memfit behaves like a pure chat assistant. |
| **Disable tool runtime AI review** | Keep disabled | Skips AI review during tool execution. This can improve speed but reduces automatic risk checks. |
| **Review rule** | Choose Manual first | Controls high-risk action review: `Manual` asks the user, `AI` lets AI decide, and `Yolo` favors automatic execution. |
| **Risk threshold** | Default `0.5` | Actions below the threshold can be approved automatically; higher-risk actions are escalated to manual review. |

【Image: Basic settings panel, highlighting file permission, Review rule, risk threshold, and Disable Tools】

### Human Interaction Controls

| Setting | Recommendation | Purpose |
| --- | --- | --- |
| **Disable human interaction** | Enabled by default | Prevents AI from repeatedly asking questions during execution. |
| **Allow human interaction during planning** | Enabled by default | Allows AI to ask clarifying questions while preparing a task plan. |
| **Planning interaction count** | Default `3` | Limits how many questions AI can ask during planning. |
| **User interaction limit** | Configure as needed | Limits total user prompts during a task. |

### Task and Context Limits

| Setting | Default | Purpose |
| --- | --- | --- |
| **AI call retry count** | `3` | Retries unstable remote AI calls. |
| **AI transaction retry count** | `5` | Retries poor-quality or failed task transactions. |
| **ReAct iteration limit** | `100` | Prevents tasks from running indefinitely. |
| **Timeline item limit** | `100` | Limits retained timeline entries. |
| **Timeline content size** | `60 KB` | Limits timeline context size. |
| **Token pressure threshold** | `40 K` | Warns or compresses context when token pressure is high. |

Keep defaults for everyday use. Increase the ReAct iteration limit only when complex tasks stop too early.

## Custom AI Configuration

Memfit organizes AI models by role:

| Model Type | Purpose | Suitable Models |
| --- | --- | --- |
| **High-quality model** | Planning, reasoning, code analysis, security analysis | Stronger reasoning models |
| **Lightweight model** | Frequent low-cost classification, summarization, routing | Fast, low-cost models |
| **Vision model** | Screenshots, UI, charts, images | Models with image input support |

### Add an AI Model

In **AI Model Configuration**, click **Add** and fill in:

| Field | How to Fill |
| --- | --- |
| **Provider** | Select a built-in provider or enter a custom OpenAI-compatible provider name. |
| **Model type** | Choose **High-quality model**, **Lightweight model**, or **Vision model**. |
| **APItype** | Select `chat_completions` or `responses`. |
| **Model name** | Choose or enter a model name, such as `gpt-4o`, `gpt-4o-mini`, or `deepseek-chat`. |
| **ApiKey** | Enter the provider API Key / Token. Some built-in free services may not require a real key. |

【Image: Add AI model modal, highlighting Provider, Model type, APItype, Model name, and ApiKey】

### Configure BaseURL or Endpoint

For private deployments, proxy services, or OpenAI-compatible gateways, expand **Advanced Configuration**:

| Advanced Setting | Use Case |
| --- | --- |
| **BaseURL** | Use for standard OpenAI-style paths, such as `https://api.openai.com/` or `https://api.example.com/v1`. |
| **Enable Endpoint** | Enable when the service does not use standard OpenAI paths. |
| **Endpoint** | Enter the full request URL, such as `https://api.example.com/v1/chat/completions`. |
| **Proxy address** | Enter a proxy such as `http://127.0.0.1:7890` when required. |
| **Header** | Add extra request headers required by an enterprise gateway. |

【Image: Advanced AI model settings, highlighting BaseURL, Endpoint, proxy, and Header】

### Select Active Models

After adding models:

1. Expand **High-quality model**, **Lightweight model**, or **Vision model**.
2. Find the model you added.
3. Select it as the active model.
4. Configure at least one **High-quality model**. Add a **Lightweight model** to reduce high-frequency task cost.

### Choose Calling Mode

| Mode | Description | Best For |
| --- | --- | --- |
| **Auto** | Automatically selects a model by task content | Recommended default |
| **Performance** | Prioritizes high-quality models | Quality-first reasoning |
| **Cost** | Prioritizes lightweight models | High-frequency, budget-sensitive tasks |
| **Balance** | Balances quality, speed, and cost | Everyday use |

### Fallback Strategy

**Disable fallback** controls whether Memfit can switch models when the current model is unavailable:

- Keep disabled: Memfit can try another tier, such as a lightweight model, when the high-quality model fails.
- Enable it: model failure stops the task, suitable for strict audit or fixed-model workflows.

## Recommended First Setup

1. Enable **system file operation permission**.
2. Set **Review rule** to `Manual`.
3. Keep **Disable Tools** off.
4. Keep **Use default system AI configuration** on, or add your own high-quality model.
5. Set calling mode to **Auto**.
6. Keep **Disable fallback** off.

Then return to the main interface and try:

```text
Summarize the current project structure and identify the main entry files.
```

If Memfit can create a plan, request permissions when needed, and produce a result, the basic settings and AI configuration are ready.

## Next Steps

1. [Hello, Memfit!](/docs/help/quick-start/hello-memfit) - Start your first AI Agent experience
2. [Advanced Usage](/docs/help/tutorials/advanced) - Inspect usage, control cost, and customize capabilities
