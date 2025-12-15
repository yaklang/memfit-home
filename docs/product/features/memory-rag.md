---
sidebar_position: 4
title: Memory & RAG
---

# Memory Triage & RAG System

Memfit AI's intelligence is enhanced by sophisticated memory management and knowledge retrieval systems.

## Memory Triage (Intelligent Hippocampus)

Memory Triage acts as the system's intelligent hippocampus, managing long-term memory persistence and retrieval.

### C.O.R.E. P.A.C.T. Framework

Memory fragments are assessed and scored across multiple dimensions:

| Dimension | Description | Weight |
|-----------|-------------|--------|
| **C**onnectivity | Links to other memories | High |
| **O**rigin | Source reliability | Medium |
| **R**elevance | Task applicability | High |
| **E**motion | User sentiment signals | Low |
| **P**reference | User preferences | Medium |
| **A**ctionability | Practical utility | High |
| **C**ompleteness | Information wholeness | Medium |
| **T**emporality | Time relevance | Medium |

### Memory Lifecycle

```
Input → Scoring → Threshold Check → Persistence
                       ↓
              Below Threshold → Discard
                       ↓
              Above Threshold → Index → Vector DB
```

### Potential Questions Index

High-score memories are indexed with:
- Predicted future queries
- Semantic associations
- Contextual tags
- Usage patterns

## RAG System (External Brain)

The RAG (Retrieval-Augmented Generation) system serves as an active, agentic knowledge service.

### Hybrid Indexing

The RAG system uses multiple indexing strategies:

#### Vector Indexing
- Semantic similarity search
- Embedding-based retrieval
- Fuzzy matching

#### Keyword Indexing
- Exact term matching
- Technical terminology
- Identifier search

### Retrieval Capabilities

#### Scalar Filtering
- Filter by metadata
- Time-based filtering
- Source filtering
- Type filtering

#### Multi-hop Retrieval
- Follow knowledge chains
- Aggregate related information
- Build comprehensive context

### Knowledge Sources

The RAG system fuses multiple knowledge sources:

```
┌─────────────────────────────────────────────┐
│              RAG Knowledge Base              │
├─────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────────┐   │
│  │   Domain    │  │    Tools & Forges   │   │
│  │  Knowledge  │  │    Documentation    │   │
│  └─────────────┘  └─────────────────────┘   │
│  ┌─────────────┐  ┌─────────────────────┐   │
│  │  Historical │  │     External        │   │
│  │   Memories  │  │    Knowledge        │   │
│  └─────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Integration with Execution

#### Context Enhancement

Before each decision:
1. Query formulation based on current state
2. Memory retrieval for relevant history
3. Knowledge retrieval for domain expertise
4. Context assembly for LLM

#### Active Knowledge Service

The RAG system is not passive:
- Proactively suggests relevant information
- Updates knowledge during execution
- Learns from successful interactions

## Configuration

### Memory Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `scoreThreshold` | Minimum score for persistence | 0.6 |
| `maxMemories` | Maximum stored memories | 10000 |
| `decayRate` | Time-based relevance decay | 0.1 |

### RAG Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `topK` | Number of results to retrieve | 5 |
| `minSimilarity` | Minimum similarity threshold | 0.7 |
| `multiHopDepth` | Maximum retrieval depth | 2 |

