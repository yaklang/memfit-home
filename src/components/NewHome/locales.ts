export type Locale = "en" | "zh-Hans";

export interface FeatureItem {
  icon: string;
  title: string;
  desc: string;
}

export interface SectionItem {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  features: { title: string; desc: string }[];
}

export interface LocaleContent {
  nav: {
    product: string;
    docs: string;
    download: string;
  };
  buttons: {
    downloadMac: string;
    downloadLinux: string;
    downloadWindows: string;
    moreVersions: string;
    github: string;
    language: string;
    languageAlt: string;
  };
  hero: {
    slogan: string;
  };
  whatIs: {
    title: string;
    description: string;
    features: FeatureItem[];
    [key: string]: any;
  };
  problem: {
    title: string;
    traditional: { title: string; desc: string };
    memfit: { title: string; desc: string };
  };
  architecture: {
    title: string;
    description: string;
    items: { icon: string; label: string; desc: string }[];
  };
  sections: SectionItem[];
}

export const CONTENT: Record<Locale, LocaleContent> = {
  en: {
    nav: { product: "Product", docs: "Docs", download: "Download" },
    buttons: {
      downloadMac: "Download macOS",
      downloadLinux: "Download Linux",
      downloadWindows: "Download Windows",
      moreVersions: "More Versions",
      github: "GitHub",
      language: "English",
      languageAlt: "简体中文",
    },
    hero: {
      slogan: "Persistent Knowledge, Visible Action",
    },
    whatIs: {
      title: "What is Memfit AI?",
      description:
        "Memfit AI is an intelligent agent system designed specifically for the cybersecurity domain, powered by the Yaklang ecosystem.",
        textOne: "It goes beyond simple chatbots by implementing a",
        textTwo: "Recursive Dual-Engine Architecture",
        textThree: "，that combines strategic planning with tactical execution.",
        textFour: "At its core, Memfit AI is a bridge between high-level human intent (“Audit this website”) and low-level security operations (port scanning, vulnerability analysis).   ",
        text5:'It achieves this by organically fusing:',
        text6:'Determinism:',
        text7:'Structured planning for complex workflows.',
        text8:'Flexibility:',
        text9:'Adaptive execution for dynamic environments.',
      features: [
        { icon: "brain", title: "AI Brain", desc: "Autonomous decision-making capabilities" },
        { icon: "plan", title: "Strategic Plan", desc: "Task decomposition and planning" },
        { icon: "reAct", title: "Tactical ReAct", desc: "Execution engine with reasoning" },
        { icon: "tools", title: "Powerful Tools", desc: "Rich tool ecosystem integration" },
      ],
      
    },
    problem: {
      title: "What problems does it solve?",
      traditional: {
        title: "Traditional AI Agent",
        desc: "Standard AI Agent executes a single task at a time, lacking the ability to understand context and make complex decisions.",
      },
      memfit: {
        title: "Memfit AI",
        desc: "Memfit AI has a memory system that can record and recall context, enabling multi-task coordination, continuous learning, and adaptive optimization.",
      },
    },
    architecture: {
      title: "Core Architecture",
      description:
        "Memfit AI is built on a recursive dual-engine architecture that combines strategic planning with tactical execution.",
      items: [
        { icon: "plan", label: "Plan", desc: "strategic planning" },
        { icon: "reAct", label: "React", desc: "tactical execution" },
        { icon: "memory", label: "Memory", desc: "context memory" },
        { icon: "knowledge", label: "Knowledge", desc: "knowledge base" },
        { icon: "tools", label: "Tools", desc: "tool capabilities" },
      ],
    },
    sections: [
      {
        id: "plan",
        tag: "Plan",
        title: "Plan Engine",
        subtitle: "Strategic Level",
        features: [
          { title: "The Problem", desc: "Complex security tasks (e.g., \"Penetration Test\") cannot be solved in a single step. They require a roadmap to ensure coverage and logical progression." },
          { title: "The Solution", desc: "The Plan Engine acts as the strategist. It breaks down vague, top-level user goals into a structured Task Tree. It anticipates dependencies (e.g., \"Scan ports before identifying services\") and sets the execution order." },
          { title: "Technical Architecture", desc: "Task Tree Generation: Deconstructs goals into hierarchical subtasks.\nDependency Management: Enforces temporal and logical execution order. \nRecursive Triggering: Can be invoked by the ReAct engine when a subtask is too complex." },
        ],
      },
      {
        id: "reAct",
        tag: "ReAct",
        title: "ReAct Engine",
        subtitle: "Tactical Level",
        features: [
          { title: "The Problem", desc: "The real world is non-deterministic. A scanner might time out, a port might be closed, or a new vulnerability might be discovered. A static script cannot adapt to these changes." },
          { title: "The Solution", desc: "The ReAct Engine handles the \"Last Mile\" of execution. For each atomic task in the plan, it spins up an independent loop of Observation-Thought-Action. It perceives the environment, reasons about the current state, and chooses the next best action." },
          { title: "Technical Architecture", desc: "LoopEngine: Manages the OODA (Observe-Orient-Decide-Act) cycle. \n Spin Detection: Prevents the agent from getting stuck in infinite loops (e.g., retrying a failed command endlessly).\n Self-Reflection: Analyzes failures to generate correction plans automatically." },
        ],
      },
      {
        id: "tools",
        tag: "Tools",
        title: "Tools & Forges",
        subtitle: "Capability Layer",
        features: [
          { title: "The Problem", desc: "An AI model is a \"Brain in a Vat\"—it cannot touch the network or files system directly. It needs specialized interfaces to interact with the cybersecurity world.  " },
          { title: "The Solution", desc: "Tools: Standardized atomic capabilities (e.g., PortScan, ReadFile, HttpReq). \n Forges: Scenario-based \"Blueprints\" that package specific prompts, tools, and logic for a domain (e.g., \"Java Code Audit Forge\")." },
          { title: "Technical Architecture", desc: "Yaklang Integration: Natively leverages Yaklang's powerful security libraries.\n MCP Support: Compatible with the Model Context Protocol for extensibility. \n Focus Mode: Allows instantiating specialized environments for specific subtasks." },
        ],
      },
      {
        id: "knowledge",
        tag: "Knowledge",
        title: "Knowledge",
        subtitle: "RAG System",
        features: [
          { title: "The Problem", desc: " LLMs have a training cutoff and lack private or highly specific domain knowledge (e.g., the latest CVE details or internal API docs)." },
          { title: "The Solution", desc: "The RAG (Retrieval-Augmented Generation) System serves as an active \"External Brain.\" It retrieves relevant documentation, past reports, and security knowledge to ground the AI's reasoning in fact."   },
          { title: "Technical Architecture", desc: "Hybrid Indexing: Combines vector search (semantic) with keyword search (precision).\n Agentic Retrieval: The system actively decides when and what to search for, rather than just passively retrieving context." },
        ],
      },
      {
        id: "memory",
        tag: "Memory",
        title: "Memory",
        subtitle: "Context System",
        features: [
          { title: "The Problem", desc: "Standard LLM sessions are stateless. The agent forgets what happened in the previous audit or what the user's preferences are, leading to repetitive mistakes." },
          { title: "The Solution", desc: "The Memory System acts as an \"Intelligent Hippocampus.\" It doesn't just store logs; it evaluates, scores, and indexes experiences. Successful strategies are remembered; failures are stored as \"lessons learned.\"" },
          { title: "Technical Architecture", desc: "C.O.R.E. P.A.C.T. Framework: A scoring system to determine which memories are worth keeping (Connectivity, Relevance, Actionability, etc.).\n Vector Database: Persists high-value memories for long-term recall across sessions." },
        ],
      },
    ]
  },
  "zh-Hans": {
    nav: { product: "产品", docs: "文档", download: "下载" },
    buttons: {
      downloadMac: "下载 macOS 版本",
      downloadLinux: "下载 Linux 版本",
      downloadWindows: "下载 Windows 版本",
      moreVersions: "下载更多版本",
      github: "GitHub",
      language: "简体中文",
      languageAlt: "English",
    },
    hero: {
      slogan: "记得住的知识库，看得见的行动力",
    },
    whatIs: {
      title: "什么是 Memfit AI？",
      description: "Memfit AI 是一个专为网络安全领域设计的智能代理系统，\n 由 Yaklang 生态系统驱动。",
      textOne: "它超越了简单的聊天机器人",
      textTwo: "递归式双引擎架构 (Recursive Dual-Engine Architecture)",
      textThree: "，将宏观的战略规划与微观的战术执行完美结合。",
      textFour: "Memfit AI 的核心是作为高层人类意图（如“审计此网站”）与底层安全操作（如端口扫描、漏洞分析）之间的桥梁。",
      text5:'它通过有机融合以下两点来实现这一目标：',
      text6:'确定性 (Determinism)：',
      text7:'针对复杂工作流的结构化规划。',
      text8:'灵活性 (Flexibility):',
      text9:'针对动态环境的自适应执行。',
      features: [
        { icon: "brain", title: "AI Brain", desc: "自主决策能力" },
        { icon: "plan", title: "Strategic Plan", desc: "任务分解与规划" },
        { icon: "reAct", title: "Tactical ReAct", desc: "推理执行引擎" },
        { icon: "tools", title: "Powerful Tools", desc: "丰富的工具生态" },
      ],
      
    },
    problem: {
      title: "解决了什么问题？",
      traditional: {
        title: "传统的 AI Agent",
        desc: "传统 AI Agent 每次只能执行单一任务，缺乏上下文理解和复杂决策能力。",
      },
      memfit: {
        title: "Memfit AI",
        desc: "Memfit AI 拥有记忆系统，能够记录和回忆上下文，实现多任务协调、持续学习和自适应优化。",
      },
    },
    architecture: {
      title: "核心架构",
      description: "Memfit AI 基于递归双引擎架构构建，完美结合战略规划与战术执行。",
      items: [
        { icon: "plan", label: "Plan", desc: "战略规划" },
        { icon: "reAct", label: "React", desc: "战术执行" },
        { icon: "memory", label: "Memory", desc: "上下文记忆" },
        { icon: "knowledge", label: "Knowledge", desc: "知识库" },
        { icon: "tools", label: "Tools", desc: "工具能力" },
      ],
    },
    sections: [
      {
        id: "plan",
        tag: "Plan",
        title: "Plan 引擎",
        subtitle: "战略层",
        features: [
          { title: "要解决的问题", desc: "复杂的安全任务（如“渗透测试”）无法一步完成。它们需要一个路线图来确保覆盖范围和逻辑推进。" },
          { title: "解决方案", desc: "Plan 引擎充当战略家。它将模糊的顶层用户目标拆解为结构化的 任务树 (Task Tree)。它预测依赖关系（例如，“在识别服务之前先扫描端口”）并设定执行顺序。" },
          { title: "技术架构", desc: "任务树生成： 将目标解构为分层子任务。/n依赖管理： 强制执行时序和逻辑顺序。/n递归触发： 当子任务过于复杂时，可由 ReAct 引擎反向调用。" },
        ],
      },
      {
        id: "reAct",
        tag: "ReAct",
        title: "ReAct 引擎",
        subtitle: "战术层",
        features: [
          { title: "要解决的问题", desc: "现实世界是非确定性的。扫描器可能会超时，端口可能会关闭，或者可能会发现新的漏洞。静态脚本无法适应这些变化。" },
          { title: "解决方案", desc: "ReAct 引擎处理执行的“最后一公里”。对于计划中的每个原子任务，它启动一个独立的 **观察-思考-行动 (Observation-Thought-Action)** 循环。它感知环境，推理当前状态，并选择最佳的下一步行动。" },
          { title: "技术架构", desc: "LoopEngine： 管理 OODA (观察-调整-决策-行动) 循环。/n 自旋检测 (Spin Detection)： 防止 Agent 陷入死循环（例如，无休止地重试失败的命令）。/n自我反思 (Self-Reflection)： 分析失败原因并自动生成修正计划。" },
        ],
      },
      {
        id: "tools",
        tag: "Tools",
        title: "工具与 Forges",
        subtitle: "能力层",
        features: [
          { title: "要解决的问题", desc: "AI 模型是“缸中之脑”——它无法直接接触网络或文件系统。它需要专门的接口来与网络安全世界交互。" },
          { title: "解决方案", desc: "工具 (Tools)： 标准化的原子能力（例如 PortScan、ReadFile、HttpReq）。/nForges： 场景化的“蓝图”，打包了特定领域的提示词、工具和逻辑（例如“Java 代码审计 Forge”）。" },
          { title: "技术架构", desc: "Yaklang 集成： 原生利用 Yaklang 强大的安全库。/nMCP 支持： 兼容 Model Context Protocol 以实现扩展性。/n专注模式 (Focus Mode)： 允许为特定子任务实例化专门的环境。" },
        ],
      },
      {
        id: "knowledge",
        tag: "Knowledge",
        title: "知识",
        subtitle: "RAG 系统",
        features: [
          { title: "要解决的问题", desc: "LLM 有训练截止日期，且缺乏私有或高度特定的领域知识（例如，最新的 CVE 详情或内部 API 文档）。" },
          { title: "解决方案", desc: "RAG（检索增强生成）系统充当主动的“外脑”。它检索相关的文档、过往报告和安全知识，使 AI 的推理基于事实。" },
          { title: "技术架构", desc: "混合索引： 结合向量搜索（语义）和关键词搜索（精确）。/n 代理化检索： 系统主动决定 何时 以及 搜索什么，而不仅仅是被动地检索上下文。" },
        ],
      },
      {
        id: "memory",
        tag: "Memory",
        title: "记忆",
        subtitle: "上下文层",
        features: [
          { title: "要解决的问题", desc: "标准的 LLM 会话是无状态的。Agent 会忘记之前的审计中发生了什么，或者用户的偏好是什么，导致重复性错误。" },
          { title: "解决方案", desc: "记忆系统充当“智能海马体”。它不仅存储日志；它还评估、评分和索引经历。成功的策略被记住；失败被存储为“吸取的教训”。" },
          { title: "技术架构", desc: "C.O.R.E. P.A.C.T. 框架： 一个评分系统，用于确定哪些记忆值得保留（关联度、相关性、可操作性等）。/n向量数据库： 持久化高价值记忆，以便跨会话长期调用。" },
        ],
      },
    ],
  },
};
  