---
sidebar_position: 1
title: 概览
---

# Memfit AI 概览

Memfit AI 突破了单一范式的局限，创新性地采用了 **ReAct 与 Plan-Execute 递归耦合** 的混合架构。该架构通过 Coordinator（协调器）将宏观的 **战略规划** 与微观的 **战术执行** 有机融合，实现了任务处理中确定性与灵活性的统一。

## 什么是 Memfit AI？

Memfit AI 是一个由 [Yaklang](https://yaklang.com) 驱动的智能代理系统。Yaklang 是专为网络安全领域设计的领域特定语言。Memfit AI 利用 Yaklang 全面的安全能力和基础设施，为安全任务提供 AI 驱动的解决方案。

## 核心架构

Memfit AI 的核心在于两个引擎之间的非线性嵌套关系：

| 引擎 | 层级 | 职责 |
|------|------|------|
| **Plan 引擎** | 战略层 | 将顶层目标拆解为具备时序依赖与逻辑关联的结构化 **任务树** |
| **ReAct 引擎** | 战术层 | 通过 "观察 - 推理 - 行动" 的闭环机制动态执行原子任务 |

**递归耦合机制：** 当 ReAct 引擎遇到复杂子问题时，可动态触发 Plan 引擎进行 **次级规划**。这种递归调用机制支持任务的分形扩展，可适应任意复杂度的业务场景。

## 双模态用户入口

1. **Coordinator 入口 (Plan-Execute 模式)**
   - 适用于模糊或复杂的任务
   - 流程：`用户 → Coordinator → 规划循环 → 审查 → 运行时 → ReAct Loops`

2. **ReAct 入口 (即时执行模式)**
   - 适用于明确的原子化指令
   - 流程：`用户 → ReAct Loop → 思考 → 行动 → 观察`

## 关键组件

- **Coordinator** - 系统总线与生命周期管理器
- **ReActLoop** - 最小执行单元，驱动 "Reasoning-Acting" 循环
- **Tools & Forges** - 标准化原子能力与场景化 AI 蓝图
- **Memory Triage** - 基于 C.O.R.E. P.A.C.T. 框架的智能长期记忆
- **RAG System** - 主动式代理化知识服务，支持混合索引

## 可靠性保障

- **自我反思** - 分析失败原因并生成修正计划
- **自旋检测** - 防止动作或逻辑死循环
- **记忆增强恢复** - 检索历史相似错误案例辅助决策

## 由 Yaklang 驱动

Memfit AI 构建于 [Yaklang](https://yaklang.com) 之上，这是一个全面的网络安全技术栈，包括：

- **CDSL Yaklang** - 网络安全领域特定语言
- **YakVM** - 专为安全 DSL 设计的虚拟机
- **YAK SSA** - 针对静态分析优化的静态单赋值形式
- **SyntaxFlow** - 用于语法模式匹配和漏洞签名建模的 DSL

## 快速链接

- [架构详解](/docs/product/architecture/recursive-dual-engine) - 深入了解架构
- [功能列表](/docs/product/features/coordinator) - 探索所有功能
- [使用场景](/docs/product/use-cases/security-audit) - 实际应用案例

