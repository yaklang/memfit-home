---
sidebar_position: 5
title: Knowledge Base Tutorial
---

# Knowledge Base Tutorial

The knowledge base is one of Memfit's core systems. It enables AI to work not only with the model's built-in training knowledge but also with your professional domain materials, significantly improving AI accuracy and expertise in specific domains.

## What is a Knowledge Base

### Knowledge Base vs AI Model Built-in Knowledge

AI models (such as GPT-4, Claude) possess broad general knowledge but have the following limitations:

- **Timeliness Gap**: Model training data has a cutoff date and cannot cover the latest information
- **Limited Domain Depth**: For specific industry or organizational expertise, models may lack sufficient depth
- **Missing Private Data**: Models cannot access your internal documents, private vulnerability databases, etc.

Knowledge bases are designed to bridge these gaps. By importing professional materials into a knowledge base and mounting it to the AI Agent, you enable AI to reference these domain-specific professional materials when answering questions and executing tasks.

### Typical Use Cases

- **Vulnerability Database**: Import the latest CVE data and exploit information
- **Coding Standards**: Import team coding standards and secure development guidelines
- **Technical Documentation**: Import product docs, API docs, architecture design documents
- **Industry Knowledge**: Import industry standards, compliance requirements, best practices

## Knowledge Base Building Technologies

Memfit's knowledge base system supports multiple building technologies to ensure knowledge can be efficiently retrieved and utilized.

### Document Chunking and Index Building

When you import documents into a knowledge base, the system automatically performs the following:

1. **Document Chunking**: Splits long documents into appropriately sized segments (chunks), each maintaining semantic completeness
2. **Vector Encoding**: Uses embedding models to convert each segment into vector representations
3. **Index Building**: Builds efficient vector indexes supporting semantic similarity retrieval

When AI needs to find relevant knowledge, the system quickly locates the most relevant knowledge segments through vector similarity search.

【配图：知识库索引构建流程的截图】

### Knowledge Graph Construction

Beyond basic vector indexing, Memfit also supports knowledge graph construction:

- **Entity Extraction**: Automatically identifies key entities from documents (e.g., technical terms, tool names, vulnerability IDs)
- **Relationship Building**: Identifies associations between entities
- **Structured Storage**: Stores knowledge in graph form, supporting relational reasoning

Knowledge graphs enable AI to understand connections between pieces of knowledge, rather than just simple text matching.

【配图：知识图谱可视化展示的截图】

## How to Create a Knowledge Base

### Creating in Memfit

1. Navigate to the knowledge base management page
2. Click to create a new knowledge base
3. Set the knowledge base name and description
4. Select the building method

【配图：创建知识库操作界面的截图】

### Adding Knowledge Content

Knowledge bases support multiple content addition methods:

#### Manual Addition

Create knowledge entries directly in the knowledge base, suitable for adding structured knowledge points and experience summaries.

#### External Import

Supports importing external documents in various formats:

- Text files (`.txt`, `.md`)
- Code files (various programming languages)
- Structured data (`.json`, `.csv`)

【配图：知识库导入操作界面的截图】

### Managing Knowledge Bases

In the knowledge base management interface, you can:

- View all entries in the knowledge base
- Edit and update existing knowledge
- Delete outdated knowledge entries
- View index status and statistics

【配图：知识库管理界面的截图】

## How to Use Knowledge Bases

### Mounting in AI Agent

During AI Agent conversations, you can mount one or more knowledge bases:

1. Find the knowledge base list in the resource panel of the chat interface
2. Select the knowledge base to mount
3. AI will automatically reference the mounted knowledge base content in subsequent answers and task execution

【配图：知识库挂载操作的截图】

### Knowledge Retrieval Process

When you ask AI a question or assign a task, the knowledge retrieval process is as follows:

1. **Query Analysis**: AI understands your question or task requirements
2. **Knowledge Retrieval**: The system searches for the most relevant knowledge segments from mounted knowledge bases
3. **Context Enhancement**: Retrieved knowledge is provided to AI as context
4. **Answer Generation**: AI generates answers combining model knowledge and retrieved professional materials

This process is transparent to you -- just have a normal conversation, and AI will automatically leverage information from the knowledge base.

## Building Knowledge Bases Through AI Agent

You can also help build knowledge base content through conversations with the AI Agent:

1. Have AI analyze and summarize documents in the conversation
2. Let AI distill key knowledge points
3. Save AI's analysis results to the knowledge base

This approach is particularly suitable for quickly extracting and organizing knowledge from large amounts of unstructured documents.

## Best Practices

1. **Topic Focus**: Each knowledge base should center around a specific topic, avoiding mixing unrelated content
2. **Continuous Updates**: Regularly update knowledge base content to ensure timeliness
3. **Mount on Demand**: Mount corresponding knowledge bases when executing different tasks to avoid irrelevant knowledge interference
4. **Quality First**: Import high-quality, accurate knowledge content -- garbage in, garbage out

## Next Steps

- [Memory Tutorial](/docs/help/tutorials/memory) - Understand AI's long-term memory mechanism
- [Scene Optimization](/docs/help/tutorials/scene-optimization) - Strengthen your Agent for specific scenarios
