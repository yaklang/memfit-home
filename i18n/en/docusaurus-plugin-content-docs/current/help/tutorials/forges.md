---
sidebar_position: 3
title: Working with Forges
---

# Working with Forges

Learn how to use and create Forges - scenario-based AI blueprints.

## What are Forges?

Forges are packaged capability modules that combine:
- **Specialized prompts** - Domain-specific instructions
- **Curated tools** - Relevant capabilities
- **Workflow logic** - Execution patterns
- **Best practices** - Accumulated expertise

## Built-in Forges

### Web Security Forge

Focused on web application security testing.

**Capabilities:**
- OWASP Top 10 detection
- XSS/SQLi testing
- Authentication analysis
- Session management review

**Usage:**
```
Analyze the web security of https://example.com using the web security forge
```

### Java Code Audit Forge

Specialized for Java application security review.

**Capabilities:**
- Spring Security analysis
- Deserialization detection
- SQL injection patterns
- Hardcoded secrets scan

**Usage:**
```
Audit the Java code in /project/src for security vulnerabilities
```

### Infrastructure Audit Forge

For infrastructure and configuration review.

**Capabilities:**
- Cloud configuration analysis
- Compliance checking
- Hardening recommendations
- Inventory management

**Usage:**
```
Check our AWS infrastructure security configuration
```

## Using Forges

### Automatic Selection

Memfit AI automatically selects appropriate Forges based on your request:

```
User: Review the PHP code for vulnerabilities

Memfit AI: [Selecting PHP Audit Forge]
I'll use the PHP Code Audit Forge for this analysis...
```

### Explicit Selection

You can explicitly request a Forge:

```
User: Use the web security forge to test https://example.com
```

### Forge Stacking

Multiple Forges can work together:

```
User: Perform a full security assessment of the Java web application

Memfit AI: I'll use both the Web Security Forge and Java Code Audit Forge
for comprehensive coverage...
```

## Creating Custom Forges

### Forge Structure

```
my-forge/
├── forge.yaml          # Configuration
├── prompts/
│   ├── system.md       # System prompt
│   └── templates/      # Prompt templates
├── tools/
│   └── custom_tool.yak # Custom tools
└── rules/
    └── patterns.sf     # SyntaxFlow patterns
```

### forge.yaml Example

```yaml
name: my-custom-forge
version: 1.0.0
description: Custom security assessment forge

domain: security
languages:
  - python
  - javascript

prompts:
  system: prompts/system.md
  
tools:
  - CustomScanner
  - PatternMatcher
  
rules:
  - rules/patterns.sf

dependencies:
  - web-security-forge  # Can extend other forges
```

### System Prompt Template

```markdown
# My Custom Security Forge

You are a security analyst specialized in [domain].

## Expertise
- [Specific knowledge area 1]
- [Specific knowledge area 2]

## Methodology
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Rules
- Always check for [pattern]
- Never ignore [condition]
- Prioritize [criteria]
```

### Custom Tool Definition

```yaklang
// tools/custom_tool.yak

registerTool("CustomScanner", {
    description: "Custom security scanner for specific patterns",
    
    parameters: {
        target: {
            type: "string",
            description: "Target to scan",
            required: true
        },
        depth: {
            type: "number",
            description: "Scan depth",
            required: false,
            default: 3
        }
    },
    
    execute: func(params) {
        target = params.target
        depth = params.depth
        
        // Implementation
        results = []
        
        // ... scanning logic ...
        
        return {
            findings: results,
            scanned_at: now()
        }
    }
})
```

### SyntaxFlow Rules

```syntaxflow
// rules/patterns.sf

// Detect hardcoded passwords
desc: "Hardcoded password detected"
severity: HIGH
*?{opcode: const && <typeName>?{have: string}}?{<name>?{have: password}} as $sink

// Detect SQL injection
desc: "Potential SQL injection"
severity: CRITICAL
db.query($param) && $param?{<dataflow(*)>?{have: request}}
```

## Installing Forges

### From Repository

```bash
yak forge install https://github.com/org/my-forge
```

### From Local Path

```bash
yak forge install /path/to/my-forge
```

### List Installed Forges

```bash
yak forge list
```

## Forge Best Practices

| Practice | Description |
|----------|-------------|
| Single Responsibility | Each Forge should focus on one domain |
| Reusable Components | Share common patterns across Forges |
| Version Control | Track Forge changes with version numbers |
| Documentation | Include usage examples and limitations |
| Testing | Validate Forge against known scenarios |

