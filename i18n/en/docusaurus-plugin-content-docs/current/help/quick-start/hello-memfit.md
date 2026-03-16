---
sidebar_position: 3
title: Hello, Memfit!
---

# Hello, World, Hello Memfit!

After completing installation and AI configuration, let's officially start using Memfit. This section will guide you through your first interaction with the Memfit AI Agent and introduce its core interface and three major systems.

## Enter AI Agent

After launching Memfit, navigate to the AI Agent page. This is the main interface for interacting with Memfit.

![image-20260316121517301](/img/help/image-20260316121517301.png)

The interface consists of the following areas:

- **Chat Area**: The central dialog box where you can input task descriptions or questions
- **Homepage Recommendations**: The right side displays system-recommended tools, skills, and knowledge bases to help you get started quickly
- **Knowledge Base / Skills / Tools Panel**: The lower-left management panel for viewing and managing loaded resources

## Send Your First Message

Type your first message in the dialog box and say hello to Memfit:

```
Hello, please introduce yourself. What can you do?
```

Memfit will respond by introducing its capabilities and available tools. You can see the AI's thinking process and final answer.

![image-20260316121603838](/img/help/image-20260316121603838.png)

:::tip
Memfit's chat input supports `Shift + Enter` for line breaks. Press `Enter` or click the send button to send a message.
:::

## Explore Homepage Recommendations

On the right side of the AI Agent main interface, you'll see the **Homepage Recommendations** area, which displays three types of available resources:

### Tools

Tools are atomic operational capabilities that Memfit can invoke. Each tool performs a specific function, for example:

- **SYN+TCP Fingerprint Scan**: Port scanning and service identification for targets
- **TLS Certificate Check**: Inspect TLS/SSL certificate information of targets
- **Cybersecurity Risk Output Tool**: Generate structured security risk reports

You can click on recommended tools to trigger related tasks directly, or describe your needs naturally in the conversation, and Memfit will automatically select the appropriate tool.

![image-20260316121732130](/img/help/image-20260316121732130.png)

### Skills

Skills are scenario-specific capability packages that integrate specialized prompts, tool combinations, and domain knowledge. For example:

- **SyntaxFlow Rule Completion**: Assists in writing SyntaxFlow code audit rules
- **XSS Vulnerability Detection**: Specialized XSS vulnerability detection capability

Skills make Memfit perform like a domain expert in specific scenarios.

![image-20260316121744542](/img/help/image-20260316121744542.png)

### Knowledge Base

Knowledge bases provide domain expertise support for the AI. You can mount different knowledge bases to let Memfit reference professional materials when answering questions and executing tasks.

![image-20260316121810590](/img/help/image-20260316121810590.png)

## Try a Real Task

Now let's give Memfit a real task. You can describe it directly in the dialog box:

```
Check the TLS certificate information for example.com
```

Observe Memfit's execution process -- it goes through a **Think, Act, Observe** loop:

1. **Think**: AI analyzes your request and determines which tool to use
2. **Act**: Invokes the TLS certificate check tool to make the actual request
3. **Observe**: Retrieves and analyzes the results
4. **Respond**: Organizes findings into a clear report for you

The entire process is visible in the interface -- this is Memfit's philosophy: **visible execution power**.

![image-20260316122018721](/img/help/image-20260316122018721.png)

## Understanding the Three Core Systems

In daily use, you'll frequently interact with Memfit's three core systems. Let's get to know each of them.

### AI Agent Execution Engine

This is the core of Memfit, driving AI to complete everything from simple queries to complex multi-step tasks.

The execution engine supports two modes:
- **Instant Execution**: For clear single-step tasks, AI directly enters the think-act-observe loop to complete them
- **Plan Execution**: For complex tasks, AI first creates a plan, decomposes subtasks, and executes them step by step after your confirmation

You don't need to manually select a mode -- Memfit automatically determines the appropriate one based on task complexity.

![image-20260316122228340](/img/help/image-20260316122228340.png)

### Knowledge Base System

The knowledge base system allows you to provide professional domain reference materials to the AI.

![image-20260316122249104](/img/help/image-20260316122249104.png)

You can:
- **Manually add** knowledge entries
- **Import** existing documents and data externally
- **Manage and organize** knowledge bases by different topics
- **Mount** specific knowledge bases during AI conversations to let AI reference these materials

The knowledge base lets Memfit work with your professional materials rather than relying solely on the AI model's built-in knowledge.

### Memory System

The memory system is one of the key features that distinguishes Memfit from ordinary AI chat tools.

![image-20260316122316802](/img/help/image-20260316122316802.png)

Memory system features:
- **Automatic Memory**: Memfit automatically distills and memorizes important information during interactions
- **Long-term Retention**: Memories persist across sessions and won't be lost when conversations are closed
- **Intelligent Recall**: In subsequent tasks, Memfit automatically associates relevant memories for more precise service
- **Quality Assessment**: Each memory has a quality score, and the system automatically manages memory priorities

Simply put, Memfit gets smarter the more you use it -- it remembers your preferences, operation history, and domain context, making each interaction more efficient.

## Next Steps

Congratulations on completing the Memfit quick start! Next you can:

1. [Configuration Guide](/docs/help/tutorials/configuration) - Explore more advanced configuration options
2. [Tool Reference](/docs/help/tutorials/tools) - Learn about all available tools
3. [Skills Reference](/docs/help/tutorials/forges) - Learn about scenario-specific skill packages
