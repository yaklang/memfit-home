---
sidebar_position: 3
title: 工具与 Forges
---

# 工具与 Forges

工具和 Forges 构成了 Memfit AI 的能力层，提供标准化的原子能力和场景化的 AI 蓝图。

## 工具 (Tools)

工具是代理可以调用的标准化原子能力。

### 工具分类

#### 文件系统工具
- `ReadFile` - 读取文件内容
- `WriteFile` - 写入文件
- `ListDirectory` - 列出目录内容
- `DeleteFile` - 删除文件

#### 执行工具
- `ShellExec` - 执行 Shell 命令
- `CodeExec` - 运行代码片段
- `ScriptRun` - 执行 Yaklang 脚本

#### 网络工具
- `HttpRequest` - 发起 HTTP 请求
- `PortScan` - 扫描网络端口
- `DnsLookup` - DNS 解析

#### 分析工具
- `CodeSearch` - 搜索代码仓库
- `VulnCheck` - 检查漏洞
- `FingerPrint` - 服务指纹识别

### 工具协议

Memfit AI 支持多种工具协议：

#### MCP (Model Context Protocol)
- AI 工具集成的标准协议
- 跨平台兼容性
- 结构化输入/输出

#### Yaklang 原生工具
- 内置 Yaklang 能力
- 高性能执行
- 深度安全集成

#### Agentic Search
- 运行时动态工具发现
- 自动能力匹配
- 按需工具加载

## Forges

Forges 是场景化能力模组（AI 蓝图），将提示词、工具和逻辑组合用于特定领域。

### 什么是 Forge？

Forge 封装了：
- **领域特定提示词** - 定制的指令
- **精选工具集** - 相关能力
- **执行逻辑** - 工作流定义
- **最佳实践** - 积累的专业知识

### Forge 示例

#### Java 代码审计 Forge
- 针对 Java 分析的专门提示词
- SAST 工具集成
- 常见漏洞模式
- 修复建议

#### Web 安全 Forge
- Web 应用测试工具
- OWASP 方法论集成
- 自动扫描器编排
- 报告生成

#### 基础设施审计 Forge
- 配置分析工具
- 合规性检查
- 加固建议
- 资产管理

### 使用 Forges

Coordinator 可以将 Forge 实例化为子任务：

```
用户请求: "审计 Java 应用"
    ↓
Coordinator 检测领域: Java 代码审计
    ↓
实例化: Java 代码审计 Forge
    ↓
以专门上下文执行
    ↓
返回领域特定结果
```

### 创建自定义 Forges

Forges 是可扩展的 - 您可以为以下场景创建自定义 Forges：
- 组织特定的工作流
- 专业安全领域
- 合规性框架
- 内部工具集成

## 工具安全

### 权限模型

工具在权限模型下运行：
- **只读** - 不修改系统
- **写入** - 可修改文件
- **执行** - 可运行命令
- **网络** - 可访问网络
- **敏感** - 需要确认

### 确认流程

敏感操作触发用户确认：
1. 工具检测到敏感操作
2. 向用户呈现请求
3. 用户批准或拒绝
4. 执行继续或中止

