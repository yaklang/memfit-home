---
sidebar_position: 1
title: 认识与安装 Memfit AI
description: Memfit AI 快速开始：环境准备、macOS/Linux/Windows 安装步骤与首次运行，几分钟上手 Yaklang 官方 AI Agent 框架。
keywords: [安装 Memfit AI, 快速开始, macOS, Linux, Windows, Yaklang]
---

import Head from '@docusaurus/Head';

# 认识与安装 Memfit AI

## 什么是 Memfit AI

Memfit AI 是 Yaklang 生态的开源网络安全 AI Agent 编排框架，采用递归式双引擎（ReAct+Plan）架构，让 AI 拥有看得见的行动力。它不只是对话，而是能够理解任务、制定计划、调用工具并交付结果的智能体系统。

Memfit AI 针对网络安全、代码审计等专业工业场景进行了深度优化，同时保持了通用 Agent 的灵活性，能够适应各类复杂任务。

### 三大核心系统

| 系统 | 说明 |
|------|------|
| **AI Agent 执行引擎** | Memfit AI 的核心驱动力。通过 ReAct 循环和任务规划，让 AI 能够自主思考、调用工具、执行多步骤任务 |
| **知识库系统** | 为 AI 提供领域专业知识。支持导入自定义知识数据，让 AI 在特定领域中具备专家级理解 |
| **记忆库系统** | AI 的长期记忆能力。记录交互历史和学习成果，让 AI 越用越聪明，越来越理解你的需求 |

### 适用场景

Memfit AI 在以下场景中表现出色：

- **网络安全**: 漏洞扫描、渗透测试、安全审计
- **代码审计**: 代码质量分析、安全缺陷检测
- **数据分析**: 结构化数据处理、报告生成
- **自动化运维**: 系统巡检、配置管理
- **通用任务**: 任何需要 AI 理解、规划和执行的复杂工作

## 开源与产品更新

Memfit AI 基于 [Yaklang](https://github.com/yaklang/yaklang) 开源引擎构建。Yaklang 是一个活跃维护的开源项目，提供了强大的安全工具链和 DSL 能力。

- **引擎开源**: Yaklang 引擎完全开源，社区驱动
- **持续更新**: Memfit AI 客户端和 Yaklang 引擎均保持活跃更新，不断引入新功能和优化
- **生态丰富**: 内置大量安全工具、协议支持和分析能力

## 下载与安装 Memfit AI

### 获取 Memfit AI

前往官方[下载页面](https://memfit.ai/downloads/)，下载适合您操作系统与 CPU 架构的安装包。下载页会展示当前最新版本号，全部安装包免费。

![image-20260316123157042](/img/help/image-20260316123157042.png)

### 平台支持

| 平台 | 架构 | 安装包格式 |
|------|------|-----------|
| macOS (Apple Silicon) | `arm64` | `.dmg` |
| macOS (Intel) | `x64` | `.dmg` |
| Windows | `amd64` | `.exe` |
| Linux | `amd64` / `arm64` | `.AppImage` |

旧版本操作系统（Legacy）用户可在[下载页面](https://memfit.ai/downloads/)获取对应的 Legacy 构建安装包。

### 安装步骤

1. 从[下载页面](https://memfit.ai/downloads/)获取对应平台的安装包
2. 运行安装程序，按照提示完成安装
3. 启动 Memfit AI

### 各平台注意事项

- **macOS**：若提示"无法验证开发者"，在"系统设置 → 隐私与安全性"中点击"仍要打开"即可；或右键安装包选择"打开"。
- **Windows**：双击 `.exe` 安装；若 SmartScreen 拦截，点击"更多信息 → 仍要运行"。
- **Linux**：`.AppImage` 无需安装，添加可执行权限后直接运行：`chmod +x Memfit-*.AppImage && ./Memfit-*.AppImage`。

### 安装常见问题

**安装 Memfit AI 需要付费吗？**

不需要。Memfit AI 客户端免费使用，底层 Yaklang 引擎以 Apache-2.0 协议开源。

**支持哪些操作系统？**

支持 macOS（Apple Silicon / Intel）、Windows 与 Linux（AMD64 / ARM64），均可在[下载页面](https://memfit.ai/downloads/)获取对应安装包。

**旧系统能安装吗？**

可以。下载页提供 macOS / Windows / Linux 的 Legacy 构建，覆盖较旧版本的操作系统。

<Head>
  <script type="application/ld+json">{`
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "安装 Memfit AI 需要付费吗？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "不需要。Memfit AI 客户端免费使用，底层 Yaklang 引擎以 Apache-2.0 协议开源。"
      }
    },
    {
      "@type": "Question",
      "name": "Memfit AI 支持哪些操作系统？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "支持 macOS（Apple Silicon / Intel）、Windows 与 Linux（AMD64 / ARM64），均可在官网下载页获取对应安装包。"
      }
    },
    {
      "@type": "Question",
      "name": "旧系统能安装 Memfit AI 吗？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "可以。官网下载页提供 macOS / Windows / Linux 的 Legacy 构建，覆盖较旧版本的操作系统。"
      }
    }
  ]
}
  `}</script>
</Head>

### 首次启动

首次启动 Memfit AI 时，系统会自动进行初始化，包括检查运行环境和配置基础设置。

![image-20260316123236292](/img/help/image-20260316123236292.png)

## Yaklang 引擎

Memfit AI 使用 Yaklang 引擎作为底层运行时，负责执行工具调用、安全扫描、协议交互等核心操作。

### 引擎管理

在 Memfit AI 中，您可以方便地管理 Yaklang 引擎：

- **自动安装**: 首次启动时，Memfit AI 会引导您安装 Yaklang 引擎
- **版本更新**: 当有新版本可用时，Memfit AI 会提示您更新引擎
- **状态检查**: 在 Memfit AI 界面中可以查看引擎的连接状态和版本信息

![image-20260316123300909](/img/help/image-20260316123300909.png)

## 下一步

安装完成后，继续以下步骤：

1. [基础配置与自定义 AI 配置](/docs/help/quick-start/tier-ai) - 配置权限控制、任务执行参数与 AI 模型
2. [你好，Memfit！](/docs/help/quick-start/hello-memfit) - 开始你的第一次 AI Agent 体验
