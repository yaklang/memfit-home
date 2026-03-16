---
sidebar_position: 3
title: 使用 Forges
---

# 使用 Forges

学习如何使用和创建 Forges - 场景化 AI 蓝图。

## 什么是 Forges？

Forges 是打包的能力模组，组合了：
- **专门提示词** - 领域特定指令
- **精选工具** - 相关能力
- **工作流逻辑** - 执行模式
- **最佳实践** - 积累的专业知识

## 内置 Forges

### Web 安全 Forge

专注于 Web 应用安全测试。

**能力:**
- OWASP Top 10 检测
- XSS/SQLi 测试
- 认证分析
- 会话管理审查

**使用:**
```
使用 web security forge 分析 https://example.com 的 Web 安全
```

### Java 代码审计 Forge

专门用于 Java 应用安全审查。

**能力:**
- Spring Security 分析
- 反序列化检测
- SQL 注入模式
- 硬编码密钥扫描

**使用:**
```
审计 /project/src 中的 Java 代码的安全漏洞
```

### 基础设施审计 Forge

用于基础设施和配置审查。

**能力:**
- 云配置分析
- 合规性检查
- 加固建议
- 资产管理

**使用:**
```
检查我们的 AWS 基础设施安全配置
```

## 使用 Forges

### 自动选择

Memfit AI 根据您的请求自动选择合适的 Forges：

```
用户: 审查 PHP 代码的漏洞

Memfit AI: [选择 PHP 审计 Forge]
我将使用 PHP 代码审计 Forge 进行此分析...
```

### 显式选择

您可以明确请求一个 Forge：

```
用户: 使用 web security forge 测试 https://example.com
```

### Forge 堆叠

多个 Forges 可以协同工作：

```
用户: 对 Java Web 应用进行全面安全评估

Memfit AI: 我将同时使用 Web 安全 Forge 和 Java 代码审计 Forge
以实现全面覆盖...
```

## 创建自定义 Forges

### Forge 结构

```
my-forge/
├── forge.yaml          # 配置
├── prompts/
│   ├── system.md       # 系统提示词
│   └── templates/      # 提示词模板
├── tools/
│   └── custom_tool.yak # 自定义工具
└── rules/
    └── patterns.sf     # SyntaxFlow 模式
```

### forge.yaml 示例

```yaml
name: my-custom-forge
version: 1.0.0
description: 自定义安全评估 forge

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
  - web-security-forge  # 可以扩展其他 forges
```

### 系统提示词模板

```markdown
# 我的自定义安全 Forge

您是专门从事 [领域] 的安全分析师。

## 专业知识
- [特定知识领域 1]
- [特定知识领域 2]

## 方法论
1. [步骤 1]
2. [步骤 2]
3. [步骤 3]

## 规则
- 始终检查 [模式]
- 永不忽略 [条件]
- 优先考虑 [标准]
```

### 自定义工具定义

```yaklang
// tools/custom_tool.yak

registerTool("CustomScanner", {
    description: "针对特定模式的自定义安全扫描器",
    
    parameters: {
        target: {
            type: "string",
            description: "要扫描的目标",
            required: true
        },
        depth: {
            type: "number",
            description: "扫描深度",
            required: false,
            default: 3
        }
    },
    
    execute: func(params) {
        target = params.target
        depth = params.depth
        
        // 实现
        results = []
        
        // ... 扫描逻辑 ...
        
        return {
            findings: results,
            scanned_at: now()
        }
    }
})
```

### SyntaxFlow 规则

```syntaxflow
// rules/patterns.sf

// 检测硬编码密码
desc: "检测到硬编码密码"
severity: HIGH
*?{opcode: const && <typeName>?{have: string}}?{<name>?{have: password}} as $sink

// 检测 SQL 注入
desc: "潜在的 SQL 注入"
severity: CRITICAL
db.query($param) && $param?{<dataflow(*)>?{have: request}}
```

## 安装 Forges

### 从仓库安装

```bash
yak forge install https://github.com/org/my-forge
```

### 从本地路径安装

```bash
yak forge install /path/to/my-forge
```

### 列出已安装的 Forges

```bash
yak forge list
```

## Forge 最佳实践

| 实践 | 描述 |
|------|------|
| 单一职责 | 每个 Forge 应专注于一个领域 |
| 可复用组件 | 跨 Forges 共享通用模式 |
| 版本控制 | 用版本号跟踪 Forge 变更 |
| 文档 | 包含使用示例和限制 |
| 测试 | 根据已知场景验证 Forge |

