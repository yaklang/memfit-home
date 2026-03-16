---
sidebar_position: 2
title: 工具参考
---

# 工具参考

Memfit AI 中所有可用工具的完整参考。

## 文件系统工具

### ReadFile

读取文件内容。

```
Action: ReadFile
参数:
  - path: string (必需) - 要读取的文件路径
  - encoding: string (可选) - 文件编码，默认: utf-8
```

**示例:**
```
[行动] ReadFile
  path: /etc/passwd
```

### WriteFile

将内容写入文件。

```
Action: WriteFile
参数:
  - path: string (必需) - 要写入的文件路径
  - content: string (必需) - 要写入的内容
  - mode: string (可选) - "overwrite" 或 "append"
```

**权限:** 需要确认

### ListDirectory

列出目录内容。

```
Action: ListDirectory
参数:
  - path: string (必需) - 目录路径
  - recursive: boolean (可选) - 包含子目录
  - pattern: string (可选) - 过滤模式
```

### DeleteFile

删除文件或目录。

```
Action: DeleteFile
参数:
  - path: string (必需) - 要删除的路径
  - recursive: boolean (可选) - 用于目录
```

**权限:** 需要确认

## 执行工具

### ShellExec

执行 Shell 命令。

```
Action: ShellExec
参数:
  - command: string (必需) - 要执行的命令
  - cwd: string (可选) - 工作目录
  - timeout: number (可选) - 超时（秒）
```

**权限:** 破坏性命令需要确认

### YakScript

执行 Yaklang 代码。

```
Action: YakScript
参数:
  - code: string (必需) - 要执行的 Yaklang 代码
  - args: object (可选) - 脚本参数
```

**示例:**
```
[行动] YakScript
  code: |
    result = http.Get("https://example.com")~
    println(result.Response)
```

## 网络工具

### HttpRequest

发起 HTTP 请求。

```
Action: HttpRequest
参数:
  - url: string (必需) - 目标 URL
  - method: string (可选) - GET, POST, PUT 等
  - headers: object (可选) - 请求头
  - body: string (可选) - 请求体
  - follow_redirects: boolean (可选)
```

### PortScan

扫描网络端口。

```
Action: PortScan
参数:
  - target: string (必需) - 目标主机或 CIDR
  - ports: string (可选) - 端口范围，如 "1-1000"
  - timeout: number (可选) - 每端口超时
```

### DnsLookup

执行 DNS 查询。

```
Action: DnsLookup
参数:
  - domain: string (必需) - 要查询的域名
  - type: string (可选) - A, AAAA, MX, TXT 等
```

## 安全工具

### WebFuzz

执行 Web 模糊测试。

```
Action: WebFuzz
参数:
  - url: string (必需) - 带 {{fuzz}} 标记的目标 URL
  - wordlist: string (可选) - 字典路径或名称
  - concurrent: number (可选) - 并发请求数
```

### NucleiScan

运行 Nuclei 漏洞扫描。

```
Action: NucleiScan
参数:
  - target: string (必需) - 目标 URL
  - templates: array (可选) - 模板路径或 ID
  - severity: string (可选) - 最低严重性
```

### MITM

启动 MITM 代理进行流量拦截。

```
Action: MITM
参数:
  - port: number (必需) - 代理端口
  - host: string (可选) - 绑定主机
  - certs: string (可选) - 证书路径
```

## 分析工具

### CodeSearch

搜索代码仓库。

```
Action: CodeSearch
参数:
  - path: string (必需) - 要搜索的目录
  - pattern: string (必需) - 搜索模式
  - language: string (可选) - 按语言过滤
```

### SSAAnalyze

执行基于 SSA 的代码分析。

```
Action: SSAAnalyze
参数:
  - path: string (必需) - 代码路径
  - language: string (必需) - 编程语言
  - rules: array (可选) - 分析规则
```

### SyntaxFlowQuery

使用 SyntaxFlow 查询代码。

```
Action: SyntaxFlowQuery
参数:
  - code: string (必需) - SyntaxFlow 查询
  - target: string (必需) - 目标代码路径
```

## 通信工具

### AskUser

向用户请求信息。

```
Action: AskUser
参数:
  - question: string (必需) - 要问的问题
  - options: array (可选) - 多选选项
```

### Notify

向用户发送通知。

```
Action: Notify
参数:
  - message: string (必需) - 通知消息
  - level: string (可选) - info, warning, error
```

## 工具权限级别

| 级别 | 描述 | 确认 |
|------|------|------|
| Read | 信息收集 | 否 |
| Write | 文件修改 | 是 |
| Execute | 命令执行 | 是 |
| Network | 网络操作 | 可配置 |
| Sensitive | 破坏性操作 | 始终 |

## 创建自定义工具

您可以使用 Yaklang 扩展 Memfit AI 的自定义工具：

```yaklang
// 注册自定义工具
registerTool("MyCustomTool", {
    description: "我的自定义安全工具",
    parameters: {
        target: {type: "string", required: true},
        options: {type: "object", required: false}
    },
    execute: func(params) {
        // 工具实现
        return result
    }
})
```

