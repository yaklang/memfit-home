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
  description: string
  features: string[];
}

export interface ComparisonItem {
  dimension: string;
  memfit: string;
  traditional: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface LocaleContent {
  nav: {
    product: string;
    docs: string;
    developer: string;
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
    // GEO：sr-only H1 完整文案（含实体定位词，供 HeroSection 语义 H1 使用）
    h1Text: string;
  };
  whatIs: {
    title: string;
    description: string;
    [key: string]: any;
  };
  problem: {
    title: string;
    description: string;
    memfitLabel: string;
    memfitSubtitle: string;
    memfitTag: string;
    traditionalLabel: string;
    traditionalSubtitle: string;
    traditionalTag: string;
    dimensionLabel: string;
  };
  faq: {
    title: string;
    items: FaqItem[];
  };
  navigation: {
    title: string;
    description: string;
  };
  architecture: {
    title: string;
    description: string;
  };
  comparisonData: ComparisonItem[];
  sections: SectionItem[];
}

export const CONTENT: Record<Locale, LocaleContent> = {
  en: {
    nav: { product: "Architecture", docs: "User Manual", developer: "Developer Guide", download: "Download" },
    buttons: {
      downloadMac: "macOS version",
      downloadLinux: "Linux version",
      downloadWindows: "Windows version",
      moreVersions: "More Versions",
      github: "GitHub",
      language: "English",
      languageAlt: "简体中文",
    },
    hero: {
      slogan: "Persistent Knowledge, Visible Action",
      h1Text:
        "Memfit AI - Open-Source Cybersecurity AI Agent Orchestration Framework: Persistent Knowledge, Visible Action",
    },
    whatIs: {
      title: "What is Memfit AI?",
      description:
        // GEO: aligned with the official positioning statement used in schema/meta description
        "Memfit AI is the open-source cybersecurity AI Agent orchestration framework of the Yaklang ecosystem, built on a recursive dual-engine (ReAct + Plan) architecture for security automation and code auditing.",
      textOne: "Recursive Dual-Engine Architecture",
      // GEO: factual phrasing instead of "unprecedented" marketing claim
      textTwo: "Memfit AI utilizes a professional recursive dual-engine architecture that deeply integrates ReAct dynamic reasoning with Plan-Execute strategic planning, enabling deterministic execution of complex tasks through recursive nesting.",
      textThree: "ReAct Real-Time Reasoning Engine: Think, act, and adjust simultaneously, dynamically responding to task changes.",
      textFour: "Plan-Execute Strategic Planning Engine: Global perspective, precise breakdown, systematic execution.",
      text5: 'Recursive Nesting Architecture: Intelligent decomposition of large tasks, precise execution of small tasks, progressively advancing towards the goal.',
      text6: 'Goals and Outcomes',
      text7: 'High Interaction Alignment with User Need',
      text8: 'High Certainty and Structured Task Execution Process',
      text9: 'Adaptive Based on Task Goals and Environment',
    },
    problem: {
      title: "Memfit AI VS Traditional AI Agent",
      // GEO: factual phrasing instead of marketing superlatives
      description: "How the recursive dual-engine compares to single-engine agent architectures",
      memfitLabel: "Memfit AI",
      memfitSubtitle: "Omni-functional intelligent agent enterprise-level solutions",
      memfitTag: "Next-Gen",
      traditionalLabel: "Traditional AI Agent",
      traditionalSubtitle: "Basic tool-type limited scenario applications",
      traditionalTag: "Traditional Solutions",
      dimensionLabel: "Dimension",
    },
    faq: {
      title: "Frequently Asked Questions",
      // GEO: homepage Q&A structure + FAQPage schema; answers mirror the
      // /docs/product/overview/ FAQ and installation docs (verified facts only)
      items: [
        {
          question: "What is Memfit AI?",
          answer:
            "Memfit AI is the open-source cybersecurity AI Agent orchestration framework of the Yaklang ecosystem. Built on a recursive dual-engine (ReAct + Plan) architecture, it provides memory/RAG, tools/Forges and spin-detection capabilities for security automation and code auditing, with 30+ pages of bilingual documentation.",
        },
        {
          question: "Which operating systems does Memfit AI support?",
          answer:
            "Memfit AI supports macOS (Intel and Apple Silicon), Windows and Linux, with installers in .dmg, .exe and .AppImage formats available from the official downloads page.",
        },
        {
          question: "Is Memfit AI free and open source?",
          answer:
            "Yes. The Memfit AI client is free, and the engine is open source under the Apache-2.0 license, designed and maintained by the Yaklang team.",
        },
        {
          question: "How does the recursive dual-engine work?",
          answer:
            "The Plan engine decomposes and schedules tasks while the ReAct engine reasons and acts in real time; the two recurse into each other — large tasks are decomposed intelligently, small tasks are executed precisely — with 17 built-in focus modes (deep research, fast execution, and more).",
        },
      ],
    },
    navigation: {
      title: "Five Pillars",
      description: "Memfit AI is built around five key components that work together to provide intelligent security capabilities.",
    },
    architecture: {
      title: "Core Architecture",
      description:
        "Memfit AI is built around five key components that work in concert to deliver intelligent security capabilities.",
    },
    sections: [
      {
        id: "plan",
        tag: "Plan",
        title: "Plan Engine",
        subtitle: "Strategic Level",
        description:'Strategic Commander, breaking down complex objectives into task trees.',
        features: [
          "Task Tree Deconstruction: Recursively breaking down top-level goals into hierarchical sub-tasks.",
          "Dependency Management: Automatically predicting and enforcing the logical order and timing of tasks."
        ],
      },
      {
        id: "reAct",
        tag: "ReAct",
        title: "ReAct Engine",
        subtitle: "Tactical Level",
        description:'Tactical Executor, responding to real-time changes in combat through dynamic feedback.',
        features: [
          "Closed-loop reasoning: dynamic perception and decision adjustment based on real-time environmental feedback.",
          "Self-correction: equipped with self-spin detection and reflection mechanisms, capable of automatically analyzing failure causes and correcting paths."
        ],
      },
      {
        id: "tools",
        tag: "Tools",
        title: "Tools & Forges",
        subtitle: "Capability Layer",
        description:'Capability Carrier, calling secure tools through standardized interfaces.',
        features: [
          "Capability Standardization: encapsulating atomic security tools (such as scanning, requests) and scenario-based Forge templates.",
          "Ecosystem Integration: natively supporting Yaklang security libraries and MCP protocols for seamless capability expansion."
        ],
      },
      {
        id: "knowledge",
        tag: "Knowledge",
        title: "Knowledge",
        subtitle: "RAG System",
        description:'Expert Brain, providing real-time factual support for AI.',
        features: [
          "Hybrid Retrieval: Combining vector semantics with precise keyword matching to enhance the accuracy of knowledge acquisition.",
          "Proactive Search: The system actively determines the timing and content of retrieval, rather than passively receiving context."
        ],
      },
      {
        id: "memory",
        tag: "Memory",
        title: "Memory",
        subtitle: "Context System",
        description:'Experience Center, storing and evaluating historical experiences for evolution.',
        features: [
          "Value Assessment: Using the C.O.R.E. P.A.C.T. framework to score and filter the importance of memories.",
          "Long-term Persistence: Utilizing vector databases to store successful strategies and lessons learned from failures, avoiding repetitive mistakes."
        ],
      },
    ],
    comparisonData: [
      {
        dimension: "Core Architecture",
        memfit: "Recursive dual-engine: ReAct + Plan-Execute deep integration, recursive nested execution",
        traditional: "Single reasoning engine, linear execution",
      },
      {
        dimension: "Task Planning",
        memfit: "AI-generated strategic planning → User review → Task tree decomposition → Parallel/serial execution",
        traditional: "No planning or simple planning, direct execution",
      },
      {
        dimension: "Task Decomposition",
        memfit: "Intelligent recursive decomposition, step-by-step progression, independent and controllable sub-tasks",
        traditional: "Linear task chain, no nesting capability",
      },
      {
        dimension: "Skill System",
        memfit: "Rich preset skill library + Custom skill extensions",
        traditional: "Basic tool invocation, limited expansion",
      },
      {
        dimension: "Memory Mechanism",
        memfit: "Intelligent memory system + RAG knowledge enhancement + Long-term memory",
        traditional: "Simple contextual memory, no persistence",
      },
      {
        dimension: "Execution Mode",
        memfit: "Multiple focus modes (in-depth research, rapid execution, creative exploration, etc.)",
        traditional: "Single execution mode",
      },
      {
        dimension: "Controllability",
        memfit: "User review mechanism, manual intervention at key nodes",
        traditional: "Automatic execution, lack of control points",
      },
      {
        dimension: "Transparency",
        memfit: "Complete execution chain traceability, deterministic logs",
        traditional: "Basic execution logs",
      },
    ],
  },
  "zh-Hans": {
    nav: { product: "技术架构", docs: "使用手册", developer: "开发者指南", download: "下载" },
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
      h1Text: "Memfit AI — 开源网络安全 AI Agent 编排框架，记得住的知识库，看得见的行动力",
    },
    whatIs: {
      title: "什么是 Memfit AI？",
      // GEO：与官方定位语（schema/meta description）保持一致，避免首页出现第三套定位口径
      description: "Memfit AI 是 Yaklang 生态的开源网络安全 AI Agent 编排框架，采用递归式双引擎（ReAct+Plan）架构，让 AI 拥有看得见的行动力。",
      textOne: "递归式双引擎架构",
      // GEO：去掉「前所未有」类营销断言，改为事实性表述
      textTwo: "Memfit AI 使用专业的递归式双引擎架构，将 ReAct 动态推理与 Plan-Execute 战略规划深度融合，通过递归嵌套技术实现高确定性的复杂任务执行。",
      textThree: "ReAct 实时推理引擎：边思考、边行动、边调整，动态响应任务变化。",
      textFour: "Plan-Execute 战略规划引擎：全局视野，精准拆解，系统化执行。",
      text5: '递归嵌套架构：大任务智能分解，小任务精准执行，层层递进直达目标。',
      text6: '目标与效果',
      text7: '高交互对齐用户需求',
      text8: '任务执行过程高度确定性与结构化',
      text9: '根据任务目标与环境自适应',
    },
    problem: {
      title: "Memfit AI VS 传统 AI Agent",
      // GEO：营销断言降调为事实性描述，与文档页克制文风一致
      description: "递归式双引擎与单一推理引擎在架构能力上的对比",
      memfitLabel: "Memfit AI",
      memfitSubtitle: "全能型智能体企业级解决方案",
      memfitTag: "第一代",
      traditionalLabel: "传统 AI Agent",
      traditionalSubtitle: "基础工具型有限场景应用",
      traditionalTag: "传统方案",
      dimensionLabel: "维度",
    },
    faq: {
      title: "常见问题",
      // GEO：首页问答结构 + FAQPage schema；答案与 /docs/product/overview/ FAQ、
      // 安装文档口径一致，仅使用站内已核实的真实事实（不编造指标）
      items: [
        {
          question: "Memfit AI 是什么？",
          answer:
            "Memfit AI 是 Yaklang 生态的开源网络安全 AI Agent 编排框架，采用递归式双引擎（ReAct+Plan）架构，提供记忆/RAG、工具/Forges、自旋检测等能力，面向安全自动化与代码审计场景，配有 30+ 篇中英双语文档。",
        },
        {
          question: "Memfit AI 支持哪些操作系统？",
          answer:
            "Memfit AI 支持 macOS（Intel 与 Apple Silicon）、Windows 和 Linux，安装包格式包括 .dmg、.exe 和 .AppImage，可从官方网站下载页获取。",
        },
        {
          question: "Memfit AI 是免费开源的吗？",
          answer:
            "是。Memfit AI 客户端免费，引擎基于 Apache-2.0 协议开源，由 Yaklang 团队设计与维护。",
        },
        {
          question: "递归式双引擎是如何工作的？",
          answer:
            "Plan 引擎负责任务分解与规划，ReAct 引擎负责实时推理与行动，二者递归嵌套协作：大任务智能分解、小任务精准执行，并内置 17 个专注模式（深度研究、快速执行等）适配不同任务类型。",
        },
      ],
    },
    navigation: {
      title: "五大支柱",
      description: "Memfit AI 围绕五个关键组件构建，它们协同工作以提供智能安全能力。",
    },
    architecture: {
      title: "核心架构",
      description: "Memfit AI 围绕五个关键组件构建，它们协同工作以提供智能安全能力。",
    },
    sections: [
      {
        id: "plan",
        tag: "Plan",
        title: "Plan 引擎",
        subtitle: "战略层",
        description:'战略指挥官，将复杂目标拆解为任务树。',
        features: [
          "任务树解构： 将顶层目标递归拆解为分层级的子任务。",
          "依赖管理： 自动预测并强制执行任务间的逻辑顺序与时序。"
        ],
      },
      {
        id: "reAct",
        tag: "ReAct",
        title: "ReAct 引擎",
        subtitle: "战术层",
        description:'战术执行官，通过动态反馈应对实战变化。',
        features: [
          "闭环推理： 基于实时环境反馈进行动态感知与决策调整。",
          "自我修正： 具备自旋检测与反思机制，能够自动分析失败原因并修正路径。"
        ],
      },
      {
        id: "tools",
        tag: "Tools",
        title: "工具与 Forges",
        subtitle: "能力层",
        description:'能力载体，通过标准化接口调用安全工具。',
        features: [
          "能力标准化： 封装原子化安全工具（如扫描、请求）与场景化 Forge 模板。",
          "生态集成： 原生支持 Yaklang 安全库及 MCP 协议，实现能力的无缝扩展。"
        ],
      },
      {
        id: "knowledge",
        tag: "Knowledge",
        title: "知识",
        subtitle: "RAG 系统",
        description:'专业外脑，为 AI 提供实时事实支撑。',
        features: [
          "混合检索： 结合向量语义与关键词精确匹配，提升知识获取的准确度。",
          "代理化主动搜索： 由系统主动决定检索时机与内容，而非被动接收上下文。"
        ],
      },
      {
        id: "memory",
        tag: "Memory",
        title: "记忆",
        subtitle: "上下文层",
        description:'经验中心，存储并评估历史经历以实现进化。',
        features: [
          "价值评估： 采用 C.O.R.E. P.A.C.T. 框架对记忆进行重要性评分与筛选。", 
          "长效持久化： 利用向量数据库存储成功策略与失败教训，避免重复性错误。"
        ],
      },
    ],
    comparisonData: [
      {
        dimension: "核心架构",
        memfit: "递归式双引擎：ReAct+Plan-Execute 深度融合，递归耦合执行",
        traditional: "单一推理引擎，线性执行",
      },
      {
        dimension: "任务规划",
        memfit: "AI生成战略规则 → 用户审核 → 任务树分解 → 并行/串行执行",
        traditional: "无规划或简单规划，直接执行",
      },
      {
        dimension: "任务分解",
        memfit: "智能递归分解，层层递进，子任务独立可控",
        traditional: "线性任务链，无拆解能力",
      },
      {
        dimension: "技能系统",
        memfit: "丰富的预置技能库 + 自定义技能扩展",
        traditional: "基础工具调用，扩展受限",
      },
      {
        dimension: "记忆机制",
        memfit: "智能记忆系统 + RAG知识增强 + 长期记忆",
        traditional: "简单上下文记忆，无持久化",
      },
      {
        dimension: "执行模式",
        memfit: "多种专注模式(深度研究、快速执行、创意探索等)",
        traditional: "单一执行模式",
      },
      {
        dimension: "可控性",
        memfit: "用户审核机制，关键节点人工介入",
        traditional: "自动执行，缺乏控制点",
      },
      {
        dimension: "透明性",
        memfit: "完整的执行链路追溯，确定性日志",
        traditional: "基础执行日志",
      },
    ],
  },
};
