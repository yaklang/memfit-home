---
sidebar_position: 2
title: Tool Reference
---

# Tool Reference

Complete reference for all available tools in Memfit AI.

## File System Tools

### ReadFile

Read contents of a file.

```
Action: ReadFile
Parameters:
  - path: string (required) - File path to read
  - encoding: string (optional) - File encoding, default: utf-8
```

**Example:**
```
[Action] ReadFile
  path: /etc/passwd
```

### WriteFile

Write content to a file.

```
Action: WriteFile
Parameters:
  - path: string (required) - File path to write
  - content: string (required) - Content to write
  - mode: string (optional) - "overwrite" or "append"
```

**Permission:** Requires confirmation

### ListDirectory

List contents of a directory.

```
Action: ListDirectory
Parameters:
  - path: string (required) - Directory path
  - recursive: boolean (optional) - Include subdirectories
  - pattern: string (optional) - Filter pattern
```

### DeleteFile

Remove a file or directory.

```
Action: DeleteFile
Parameters:
  - path: string (required) - Path to delete
  - recursive: boolean (optional) - For directories
```

**Permission:** Requires confirmation

## Execution Tools

### ShellExec

Execute a shell command.

```
Action: ShellExec
Parameters:
  - command: string (required) - Command to execute
  - cwd: string (optional) - Working directory
  - timeout: number (optional) - Timeout in seconds
```

**Permission:** Requires confirmation for destructive commands

### YakScript

Execute Yaklang code.

```
Action: YakScript
Parameters:
  - code: string (required) - Yaklang code to execute
  - args: object (optional) - Script arguments
```

**Example:**
```
[Action] YakScript
  code: |
    result = http.Get("https://example.com")~
    println(result.Response)
```

## Network Tools

### HttpRequest

Make HTTP requests.

```
Action: HttpRequest
Parameters:
  - url: string (required) - Target URL
  - method: string (optional) - GET, POST, PUT, etc.
  - headers: object (optional) - Request headers
  - body: string (optional) - Request body
  - follow_redirects: boolean (optional)
```

### PortScan

Scan network ports.

```
Action: PortScan
Parameters:
  - target: string (required) - Target host or CIDR
  - ports: string (optional) - Port range, e.g., "1-1000"
  - timeout: number (optional) - Per-port timeout
```

### DnsLookup

Perform DNS queries.

```
Action: DnsLookup
Parameters:
  - domain: string (required) - Domain to query
  - type: string (optional) - A, AAAA, MX, TXT, etc.
```

## Security Tools

### WebFuzz

Perform web fuzzing.

```
Action: WebFuzz
Parameters:
  - url: string (required) - Target URL with {{fuzz}} markers
  - wordlist: string (optional) - Wordlist path or name
  - concurrent: number (optional) - Concurrent requests
```

### NucleiScan

Run Nuclei vulnerability scans.

```
Action: NucleiScan
Parameters:
  - target: string (required) - Target URL
  - templates: array (optional) - Template paths or IDs
  - severity: string (optional) - Minimum severity
```

### MITM

Start MITM proxy for traffic interception.

```
Action: MITM
Parameters:
  - port: number (required) - Proxy port
  - host: string (optional) - Bind host
  - certs: string (optional) - Certificate path
```

## Analysis Tools

### CodeSearch

Search code repositories.

```
Action: CodeSearch
Parameters:
  - path: string (required) - Directory to search
  - pattern: string (required) - Search pattern
  - language: string (optional) - Filter by language
```

### SSAAnalyze

Perform SSA-based code analysis.

```
Action: SSAAnalyze
Parameters:
  - path: string (required) - Code path
  - language: string (required) - Programming language
  - rules: array (optional) - Analysis rules
```

### SyntaxFlowQuery

Query code using SyntaxFlow.

```
Action: SyntaxFlowQuery
Parameters:
  - code: string (required) - SyntaxFlow query
  - target: string (required) - Target code path
```

## Communication Tools

### AskUser

Request information from user.

```
Action: AskUser
Parameters:
  - question: string (required) - Question to ask
  - options: array (optional) - Multiple choice options
```

### Notify

Send notification to user.

```
Action: Notify
Parameters:
  - message: string (required) - Notification message
  - level: string (optional) - info, warning, error
```

## Tool Permission Levels

| Level | Description | Confirmation |
|-------|-------------|--------------|
| Read | Information gathering | No |
| Write | File modifications | Yes |
| Execute | Command execution | Yes |
| Network | Network operations | Configurable |
| Sensitive | Destructive operations | Always |

## Creating Custom Tools

You can extend Memfit AI with custom tools using Yaklang:

```yaklang
// Register a custom tool
registerTool("MyCustomTool", {
    description: "My custom security tool",
    parameters: {
        target: {type: "string", required: true},
        options: {type: "object", required: false}
    },
    execute: func(params) {
        // Tool implementation
        return result
    }
})
```

