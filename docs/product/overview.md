---
sidebar_position: 1
title: Overview
---

# Memfit AI Overview

Memfit AI breaks through the limitations of single paradigms by innovatively adopting a **Recursive Coupling of ReAct and Plan-Execute** hybrid architecture. This architecture organically fuses macroscopic **Strategic Planning** with microscopic **Tactical Execution** through a Coordinator, achieving a unity of determinism and flexibility in task processing.

## What is Memfit AI?

Memfit AI is an intelligent agent system powered by [Yaklang](https://yaklang.com), a domain-specific language designed for cybersecurity. It leverages Yaklang's comprehensive security capabilities and infrastructure to provide an AI-driven approach to security tasks.

## Core Architecture

The core of Memfit AI lies in the non-linear nesting relationship between two engines:

| Engine | Layer | Responsibility |
|--------|-------|----------------|
| **Plan Engine** | Strategic | Macroscopic deconstruction of tasks into structured **Task Trees** with temporal dependencies and logical associations |
| **ReAct Engine** | Tactical | Dynamic execution of atomic tasks through "Observation - Thought - Action" closed loops |

**Recursive Coupling Mechanism:** When the ReAct engine encounters complex sub-problems, it dynamically triggers the Plan engine for **Sub-planning**. This recursive mechanism supports fractal expansion of tasks, adapting to business scenarios of arbitrary complexity.

## Dual-Mode User Entry

1. **Coordinator Entry (Plan-Execute Mode)**
   - For vague or complex tasks
   - Flow: `User → Coordinator → Planning Loop → Review → Runtime → ReAct Loops`

2. **ReAct Entry (Instant Execution Mode)**
   - For clear, atomic instructions
   - Flow: `User → ReAct Loop → Thought → Action → Observation`

## Key Components

- **Coordinator** - System bus and lifecycle manager
- **ReActLoop** - Minimal execution unit with "Reasoning-Acting" cycle
- **Tools & Forges** - Standardized atomic capabilities and scenario-based AI Blueprints
- **Memory Triage** - Intelligent long-term memory using C.O.R.E. P.A.C.T. Framework
- **RAG System** - Active, agentic knowledge service with hybrid indexing

## Reliability Assurance

- **Self-Reflection** - Analyzes failures and generates correction plans
- **Spin Detection** - Prevents infinite loops in actions or logic
- **Memory-Augmented Recovery** - Retrieves historical error cases for decision support

## Powered by Yaklang

Memfit AI is built on top of [Yaklang](https://yaklang.com), a comprehensive cybersecurity technology stack that includes:

- **CDSL Yaklang** - A domain-specific language for cybersecurity
- **YakVM** - A dedicated virtual machine for the cybersecurity DSL
- **YAK SSA** - Static single assignment form optimized for static analysis
- **SyntaxFlow** - A DSL for syntax pattern matching and vulnerability signature modeling

## Quick Links

- [Architecture Details](/docs/product/architecture/recursive-dual-engine) - Deep dive into the architecture
- [Feature List](/docs/product/features/coordinator) - Explore all features
- [Use Cases](/docs/product/use-cases/security-audit) - Real-world applications

