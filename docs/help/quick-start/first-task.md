---
sidebar_position: 2
title: Your First Task
---

# Your First Task

Learn how to run your first AI-assisted security task with Memfit AI.

## Starting Memfit AI

### Via Yakit

1. Launch Yakit
2. Navigate to the AI Agent panel
3. Ensure the Yaklang engine is connected

### Via Command Line

```bash
yak ai
```

## Simple Task: Port Scanning

Let's start with a simple task to understand how Memfit AI works.

### Enter Your Request

In the chat interface, type:

```
Scan the ports of localhost and tell me what services are running
```

### Observe the ReAct Loop

Memfit AI will enter **Instant Execution Mode** because this is a clear, atomic task:

```
[Thought] User wants to scan localhost ports. I'll use a port scanner.

[Action] PortScan
  target: localhost
  ports: 1-1000

[Observation] 
  Port 22: SSH
  Port 80: HTTP
  Port 443: HTTPS

[Thought] Scan complete. I'll summarize the findings.

[Response] Found 3 open ports on localhost:
- Port 22: SSH service
- Port 80: HTTP web server
- Port 443: HTTPS secure web server
```

## Complex Task: Security Audit

Now let's try a more complex task that triggers **Plan-Execute Mode**.

### Enter Your Request

```
Perform a security assessment of the web application at http://localhost:8080
```

### Observe Plan Generation

Memfit AI generates a structured plan:

```
Security Assessment Plan:

1. Reconnaissance
   ├── Technology fingerprinting
   └── Directory enumeration

2. Vulnerability Scanning
   ├── Common vulnerability checks
   └── Configuration analysis

3. Analysis & Reporting
   ├── Finding prioritization
   └── Report generation

Would you like to proceed with this plan?
```

### Review and Approve

You can:
- **Approve** - Proceed with the plan as-is
- **Modify** - Adjust the plan before execution
- **Cancel** - Stop the operation

### Watch Execution

After approval, multiple ReAct loops execute the plan:

```
[Executing: Reconnaissance]
  → Technology fingerprinting... Done
  → Found: nginx, PHP, MySQL
  
[Executing: Vulnerability Scanning]
  → Common vulnerability checks... Done
  → Found: 2 potential issues

[Generating Report...]
```

## Understanding the Output

### Execution Trace

Each step shows:
- **Thought** - AI reasoning
- **Action** - Tool being used
- **Observation** - Results received

### Final Report

Comprehensive findings with:
- Severity levels
- Detailed descriptions
- Remediation recommendations

## Key Concepts Demonstrated

| Concept | Example |
|---------|---------|
| ReAct Loop | Port scanning thought-action-observation cycle |
| Plan-Execute | Security assessment task decomposition |
| Human-in-the-Loop | Plan review before execution |
| Tool Usage | PortScan, WebScan tools |

## Next Steps

- [Basic Concepts](/docs/help/quick-start/basic-concepts) - Deeper understanding
- [Configuration](/docs/help/tutorials/configuration) - Customize behavior
- [Tool Reference](/docs/help/tutorials/tools) - Available tools

