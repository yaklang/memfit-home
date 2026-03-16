---
sidebar_position: 4
title: AI Agent Tutorial
---

# AI Agent Tutorial

This tutorial provides a detailed guide on using Memfit's AI Agent features, including chat interaction, file management, skills usage, and terminal operations.

## Entering the AI Agent Interface

After launching Memfit, click to enter the AI Agent page. AI Agent is Memfit's core interaction interface where all tasks begin.

【配图：AI Agent 完整界面布局的截图】

Main interface areas:

| Area | Location | Function |
|------|----------|----------|
| Chat Area | Center | Input commands, view AI responses and execution process |
| Homepage Recommendations | Right | Display recommended tools, skills, and knowledge bases |
| Resource Panel | Lower-left | Manage knowledge bases, skills, and tools |
| Model Selection | Bottom | Select the current AI model |

## Chat Interaction

### Sending Messages

Type your task description or question in the dialog box and press `Enter` to send. Use `Shift + Enter` for multi-line input.

You can describe any task in natural language, for example:

```
Analyze the security configuration of target.com and check for common vulnerabilities
```

### Multi-turn Conversations

Memfit supports multi-turn conversations where AI remembers the current session context. You can follow up or adjust based on previous tasks:

```
User: Scan the open ports on 192.168.1.1
AI: [Executes scan and returns results...]

User: For the discovered port 80, further check the web service security
AI: [Based on the scan results above, continues deeper inspection...]
```

### Understanding the Execution Process

When AI Agent executes tasks, you can see the complete execution trace in the interface:

- **Thinking**: AI analyzes the task and decides the next action
- **Action**: AI invokes specific tools to perform operations
- **Observation**: AI reviews the results returned by tools
- **Response**: AI organizes findings and replies to you

【配图：AI Agent 执行过程中思考-行动-观察循环的截图】

## Adding Files

You can provide files to the AI as context, allowing AI to reference these file contents when executing tasks.

### How to Add Files

1. Find the file addition entry in the chat interface
2. Select files to add (supports code files, configuration files, text files, etc.)
3. File contents will be loaded into the current session context

【配图：添加文件操作界面的截图】

### Use Cases

- **Code Auditing**: Upload code files for AI to analyze security vulnerabilities
- **Configuration Review**: Upload configuration files for AI to check security settings
- **Log Analysis**: Upload log files for AI to identify anomalous behavior
- **Document Understanding**: Upload technical documents for AI to answer questions based on them

## Using Skills

Skills are Memfit's scenario-based capability enhancement mechanism. Each skill targets a specific scenario, integrating specialized prompts, tool combinations, and domain knowledge.

### Selecting and Activating Skills

In the AI Agent interface, you can use skills in the following ways:

1. **Homepage Recommendations**: Click on skills of interest directly in the right recommendation area
2. **Resource Panel**: Browse and select skills in the lower-left skills library
3. **Natural Description**: Describe your task in conversation, and Memfit will automatically match appropriate skills

【配图：技能选择和激活界面的截图】

### How Skills Affect Agent Behavior

After activating a skill, the AI Agent's behavior changes:

- **Expert Knowledge Injection**: AI receives specialized prompts and best practices for the domain
- **Tool Combination Optimization**: Automatically loads the most relevant tool set for the scenario
- **Execution Strategy Adjustment**: Executes tasks following the optimal workflow for the scenario

### Skills Auto-Loading Mechanism

Memfit has intelligent skill recommendation capabilities:

- **Task Analysis**: When you input a task description, Memfit analyzes the task characteristics
- **Auto Matching**: Automatically recommends the most suitable skills based on task type
- **Dynamic Loading**: During execution, if additional skills are needed, Memfit will dynamically recommend them
- **Homepage Recommendations**: Based on your usage history and common scenarios, the homepage recommends skills you're most likely to need

【配图：技能自动推荐机制展示的截图】

## Using the Terminal

Memfit's AI Agent has terminal operation capabilities, allowing command execution during task performance.

### Terminal Features

- AI can automatically invoke terminal commands during task execution
- Supports common system commands and tool invocations
- Terminal operation input/output is fully visible in the interface

【配图：AI Agent 中终端使用界面的截图】

### Security Mechanisms

Terminal operations are subject to security controls:

- Sensitive commands require your confirmation before execution
- Operation scope is limited by permission configurations
- All command execution records are traceable

## Best Practices

1. **Be Clear**: Describe your task goals and constraints as clearly as possible
2. **Leverage Skills**: For professional scenario tasks, activate relevant skills for better results
3. **Provide Context**: Supply sufficient background information through file additions or knowledge base mounting
4. **Iterate**: Complex tasks can be approached step by step, gradually refining requirements

## Next Steps

- [Knowledge Base Tutorial](/docs/help/tutorials/knowledge-base) - Learn how to build and use knowledge bases
- [Memory Tutorial](/docs/help/tutorials/memory) - Understand AI's long-term memory mechanism
- [Scene Optimization](/docs/help/tutorials/scene-optimization) - Strengthen your Agent for specific scenarios
