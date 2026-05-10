---
sidebar_position: 4
title: 高级使用
---

# 高级使用

本章面向已经能完成基础任务的用户，介绍如何观察模型表现、排查缓存和上下文问题、主动干预执行过程，以及把团队能力沉淀为自定义工具和 SKILL。

【配图：高级使用总览，标注用量面板、上下文编辑入口、工具编辑入口、Skill 编辑入口】

## 本章包含什么

| 页面 | 适合解决什么问题 |
| --- | --- |
| [用量与模型表现](/docs/help/tutorials/advanced/usage-and-model-performance) | 查看 token 消耗、缓存命中、上下文压力、速度和抖动，判断一次任务为什么贵、慢或不稳定。 |
| [人工干预与上下文修改](/docs/help/tutorials/advanced/intervention-and-context) | 在任务执行中暂停、补充要求、修改全局上下文或局部上下文，让 Agent 回到正确方向。 |
| [自定义工具与自定义 SKILL](/docs/help/tutorials/advanced/custom-tools-and-skills) | 把团队脚本、检查规则、固定流程封装成工具或 SKILL，交给 Agent 稳定复用。 |

## 高级使用的判断顺序

当任务结果不理想时，建议按这个顺序排查：

1. 先看用量和模型表现：确认是否是上下文过大、缓存未命中、模型层级选择不合理或网络抖动。
2. 再看执行过程：确认 Agent 是否误解任务、是否选错工具、是否需要你补充约束。
3. 最后沉淀能力：如果同一类任务反复出现，就把它整理成工具或 SKILL，而不是每次都重新写提示词。

【配图：高级问题排查流程，从用量面板到上下文修改，再到工具与 SKILL 沉淀】

## 常见场景速查

| 现象 | 优先阅读 |
| --- | --- |
| 一次任务突然消耗很多 token | [用量与模型表现](/docs/help/tutorials/advanced/usage-and-model-performance) |
| 输入内容差不多，但缓存命中很低 | [用量与模型表现](/docs/help/tutorials/advanced/usage-and-model-performance) |
| 速度忽快忽慢，首 token 或总耗时抖动明显 | [用量与模型表现](/docs/help/tutorials/advanced/usage-and-model-performance) |
| Agent 已经开始跑，但方向不对 | [人工干预与上下文修改](/docs/help/tutorials/advanced/intervention-and-context) |
| 想临时修改本轮任务的约束 | [人工干预与上下文修改](/docs/help/tutorials/advanced/intervention-and-context) |
| 想让所有后续任务都遵守团队规范 | [人工干预与上下文修改](/docs/help/tutorials/advanced/intervention-and-context) |
| 想把内部脚本交给 Agent 调用 | [自定义工具与自定义 SKILL](/docs/help/tutorials/advanced/custom-tools-and-skills) |
| 想把一套固定流程变成可复用能力 | [自定义工具与自定义 SKILL](/docs/help/tutorials/advanced/custom-tools-and-skills) |

## 与基础配置的关系

基础配置决定 Agent 的默认工作方式，高级使用则用于运行后的观察和干预。

| 基础配置 | 高级使用里如何继续优化 |
| --- | --- |
| **压力 token 阈值** | 配合用量面板观察 Pressure，判断是否要缩小上下文或提高阈值。 |
| **Review 规则** | 配合人工干预决定哪些工具、计划、SKILL 需要手动确认。 |
| **调用模式** | 配合模型表现观察高质、轻量、视觉模型的实际消耗。 |
| **禁用 Tools / AI 审查** | 配合自定义工具和 SKILL 决定哪些能力可以开放给 Agent。 |

## 下一步

从 [用量与模型表现](/docs/help/tutorials/advanced/usage-and-model-performance) 开始，先学会判断一次任务的消耗和稳定性。
