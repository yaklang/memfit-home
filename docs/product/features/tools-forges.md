---
sidebar_position: 3
title: Tools & Forges
---

# Tools & Forges

Tools and Forges form the capability layer of Memfit AI, providing standardized atomic capabilities and scenario-based AI Blueprints.

## Tools

Tools are standardized atomic capabilities that the agent can invoke.

### Tool Categories

#### File System Tools
- `ReadFile` - Read file contents
- `WriteFile` - Write to files
- `ListDirectory` - List directory contents
- `DeleteFile` - Remove files

#### Execution Tools
- `ShellExec` - Execute shell commands
- `CodeExec` - Run code snippets
- `ScriptRun` - Execute Yaklang scripts

#### Network Tools
- `HttpRequest` - Make HTTP requests
- `PortScan` - Scan network ports
- `DnsLookup` - DNS resolution

#### Analysis Tools
- `CodeSearch` - Search code repositories
- `VulnCheck` - Check for vulnerabilities
- `FingerPrint` - Service fingerprinting

### Tool Protocols

Memfit AI supports multiple tool protocols:

#### MCP (Model Context Protocol)
- Standard protocol for AI tool integration
- Cross-platform compatibility
- Structured input/output

#### Yaklang Native Tools
- Built-in Yaklang capabilities
- High-performance execution
- Deep security integration

#### Agentic Search
- Runtime dynamic tool discovery
- Automatic capability matching
- On-demand tool loading

## Forges

Forges are scenario-based capability modules (AI Blueprints) that combine prompts, tools, and logic for specific domains.

### What is a Forge?

A Forge encapsulates:
- **Domain-specific prompts** - Tailored instructions
- **Curated tool sets** - Relevant capabilities
- **Execution logic** - Workflow definitions
- **Best practices** - Accumulated expertise

### Example Forges

#### Java Code Audit Forge
- Specialized prompts for Java analysis
- SAST tool integration
- Common vulnerability patterns
- Remediation suggestions

#### Web Security Forge
- Web application testing tools
- OWASP methodology integration
- Automated scanner orchestration
- Report generation

#### Infrastructure Audit Forge
- Configuration analysis tools
- Compliance checking
- Hardening recommendations
- Inventory management

### Using Forges

The Coordinator can instantiate a Forge as a subtask:

```
User Request: "Audit the Java application"
    ↓
Coordinator detects domain: Java Code Audit
    ↓
Instantiate: Java Code Audit Forge
    ↓
Execute with specialized context
    ↓
Return domain-specific results
```

### Creating Custom Forges

Forges are extensible - you can create custom Forges for:
- Organization-specific workflows
- Specialized security domains
- Compliance frameworks
- Internal tool integration

## Tool Security

### Permission Model

Tools operate under a permission model:
- **Read-only** - No system modification
- **Write** - Can modify files
- **Execute** - Can run commands
- **Network** - Can access network
- **Sensitive** - Requires confirmation

### Confirmation Flow

Sensitive operations trigger user confirmation:
1. Tool detects sensitive operation
2. Request presented to user
3. User approves or rejects
4. Execution proceeds or aborts

