---
sidebar_position: 2
title: Configure Tiered AI
---

# Configure Tiered AI

Memfit uses a tiered AI architecture that allows you to configure different levels of AI models for different types of tasks, achieving the optimal balance between performance and cost.

## Why Tiered AI

In practice, not all tasks require the most powerful AI model:

- Simple information classification and routing decisions can be completed quickly with lightweight models
- Complex task planning and deep analysis need advanced reasoning models to ensure quality
- Understanding image content requires models with vision capabilities

Tiered AI enables Memfit to intelligently select the right model for each task, avoiding overkill for simple tasks and underpowering for complex ones.

## Three Model Tiers

Memfit divides AI models into three tiers, each handling different responsibilities:

### Intelligent Model

Advanced reasoning model for handling complex tasks that require deep thinking.

- **Typical Uses**: Task planning, security audit analysis, code auditing, complex problem reasoning
- **Recommended Models**: GPT-4, Claude 3.5 Sonnet, DeepSeek R1, etc.
- **Characteristics**: Strong reasoning ability, but higher invocation cost and slower response

### Lightweight Model

Fast-response model for handling simple and straightforward tasks.

- **Typical Uses**: Intent classification, information extraction, simple Q&A, task routing
- **Recommended Models**: GPT-4o-mini, Claude 3.5 Haiku, DeepSeek V3, etc.
- **Characteristics**: Fast response, low cost, suitable for high-frequency calls

### Vision Model

Model with image understanding capabilities for handling tasks involving visual information.

- **Typical Uses**: Screenshot analysis, CAPTCHA recognition, UI element understanding, chart interpretation
- **Recommended Models**: GPT-4o, Claude 3.5 Sonnet, and other vision-capable models
- **Characteristics**: Able to understand and analyze image content

## Configuration Steps

### Access AI Configuration

In Memfit, navigate to **Settings -> AI Configuration** to find the tiered AI configuration section.

![image-20260316122415332](/img/help/image-20260316122415332.png)

### Configure Intelligent Model

In the intelligent model configuration section, add your advanced AI model:

1. Select an AI provider (e.g., OpenAI, Anthropic, or custom compatible endpoint)
2. Enter the API Key
3. Select a model (e.g., `gpt-4`, `claude-3-5-sonnet`)
4. If needed, configure a custom API address (Base URL)

![image-20260316122504453](/img/help/image-20260316122504453.png)

### Configure Lightweight Model

Similar to the intelligent model configuration, you can select "Model Type" in the configuration panel to configure the lightweight model:

1. Select an AI provider
2. Enter the API Key (can share the same provider as the intelligent model)
3. Select a lightweight model (e.g., `gpt-4o-mini`, `claude-3-5-haiku`)

![image-20260316122538263](/img/help/image-20260316122538263.png)

### Configure Vision Model (Optional)

If you need AI to handle image-related tasks, you can configure a vision model:

1. Select an AI provider that supports vision capabilities
2. Select a model that supports image input (e.g., `gpt-4o`)

### Select Routing Policy

Memfit provides four model routing policies that determine how models are selected during task execution:

| Policy | Description | Use Case |
|--------|-------------|----------|
| **Auto** | Automatically selects the appropriate model tier based on task characteristics | Recommended for most users |
| **Performance** | Prioritizes intelligent models for best reasoning quality | High quality requirements, cost-insensitive |
| **Cost** | Prioritizes lightweight models to reduce invocation costs | High-frequency use, limited budget |
| **Balance** | Strikes a balance between performance and cost | General daily use |

![image-20260316122704407](/img/help/image-20260316122704407.png)

### Test Configuration

After configuration, it's recommended to test AI model connectivity to confirm the setup is correct:

1. Use the test function on the configuration page to verify the connection
2. Confirm that each configured model tier responds normally

## Fallback Mechanism

Memfit has a built-in intelligent fallback mechanism to ensure service continuity:

- When the intelligent model is unavailable (e.g., API timeout, quota exhausted), the system will automatically fall back to the lightweight model to continue executing tasks
- If you don't want automatic fallback, you can disable this behavior in the configuration

This means that even if a model is temporarily unavailable, Memfit can maintain uninterrupted operation as much as possible.

## Configuration Recommendations

### Getting Started

If you're just getting started, we recommend configuring one AI provider for both intelligent and lightweight models, and selecting the **Auto** routing policy:

- Intelligent Model: `gpt-4` or `claude-3-5-sonnet`
- Lightweight Model: `gpt-4o-mini` or `claude-3-5-haiku`
- Routing Policy: Auto

### Advanced Configuration

As you use Memfit more, you can:

- Configure different providers for different tiers for multi-source redundancy
- Adjust routing policies based on actual usage patterns
- Configure vision models to support image-related tasks

## Next Steps

With AI configuration complete, you're ready to start using Memfit:

1. [Hello, Memfit!](/docs/help/quick-start/hello-memfit) - Start your first AI Agent experience
2. [Configuration Guide](/docs/help/tutorials/configuration) - More advanced configuration options
