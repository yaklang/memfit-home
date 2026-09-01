/*
 * @Author: HJH 75428400+hjhke@users.noreply.github.com
 * @Date: 2026-01-15 14:24:48
 * @LastEditors: HJH 75428400+hjhke@users.noreply.github.com
 * @LastEditTime: 2026-01-23 16:19:19
 * @FilePath: \memfit-home\src\components\NewHome\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useState, useCallback, type ReactNode } from "react";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { PageMetadata } from "@docusaurus/theme-common";
import Head from "@docusaurus/Head";
import { CONTENT, type Locale } from "./locales";
import { ThemeContext, type Theme } from "./context/ThemeContext";
import {
  Header,
  HeroSection,
  WhatIsSection,
  ProblemSection,
  FaqSection,
  ArchitectureSection,
  FeatureSection,
  NavigationBar,
  Footer,
} from "./components";

const resolveLocaleFromPathname = (pathname?: string, currentLocale?: string): Locale => {
  if (pathname === "/en" || pathname?.startsWith("/en/")) {
    return "en";
  }

  return currentLocale === "en" ? "en" : "zh-Hans";
};

export const NewHome = (): ReactNode => {
  const { i18n } = useDocusaurusContext();
  const location = useLocation();
  const [locale, setLocale] = useState<Locale>(() =>
    resolveLocaleFromPathname(location.pathname, i18n.currentLocale)
  );
  const [theme, setTheme] = useState<Theme>(() => {
    // 从 sessionStorage 读取主题，默认为 light
    if (typeof window !== 'undefined') {
      const savedTheme = sessionStorage.getItem('theme');
      return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    setLocale(resolveLocaleFromPathname(location.pathname, i18n.currentLocale));
  }, [location.pathname, i18n.currentLocale]);

  const handleToggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "en" ? "zh-Hans" : "en"));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      // 保存到 sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('theme', newTheme);
      }
      return newTheme;
    });
  }, []);

  const content = CONTENT[locale];

  // 按语言输出首页 meta（此前 /en/ 首页 title/description 为中文，en-US hreflang 形同虚设）
  // GEO：en title 压缩——Docusaurus 会追加 "| Memfit AI" 模板，控制在 SERP 60 字符建议内
  const isEn = locale === "en";
  const metaTitle = isEn
    ? "Cybersecurity AI Agent Orchestration Framework"
    : "Yaklang 生态开源网络安全 AI Agent 编排框架";
  const metaDescription = isEn
    ? "The open-source cybersecurity AI Agent orchestration framework of the Yaklang ecosystem, built on a recursive dual-engine (ReAct + Plan) architecture."
    : "Memfit AI 是 Yaklang 生态的开源网络安全 AI Agent 编排框架，采用递归式双引擎（ReAct+Plan）架构，让 AI 拥有看得见的行动力。提供记忆/RAG、工具/Forges、自旋检测等能力，面向安全自动化与代码审计场景。";
  const twitterTitle = `${metaTitle} | Memfit AI`;

  // 首页结构化数据：Organization + SoftwareApplication，提升 AI 实体识别与可发现性
  // GEO：schema 描述随页面语言本地化（此前 /en/ 首页 schema 为中文，与 lang="en-US" 冲突）
  const schemaDescription = isEn
    ? "Memfit AI is the open-source cybersecurity AI Agent orchestration framework of the Yaklang ecosystem, built on a recursive dual-engine (ReAct + Plan) architecture for security automation and code auditing."
    : "Yaklang 生态的开源网络安全 AI Agent 编排框架，递归式双引擎（ReAct+Plan）让 AI 拥有看得见的行动力。";
  // GEO：@id 实体图——首页/about/文档页引用同一 @id，AI 才会将各页 Organization 视为同一实体
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://memfit.ai/#organization",
    name: "Memfit AI",
    url: "https://memfit.ai/",
    logo: "https://memfit.ai/img/logo.png",
    description: schemaDescription,
    parentOrganization: {
      "@type": "Organization",
      "@id": "https://yaklang.com/#organization",
      name: "Yaklang",
      url: "https://yaklang.com",
    },
    sameAs: [
      // 实体身份信号；父子组织关系已由 parentOrganization 表达，
      // 父组织账号（github.com/yaklang）不混入 Memfit 自身 sameAs，避免实体边界混淆
      "https://github.com/yaklang/memfit-home",
    ],
  };
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://memfit.ai/#software",
    name: "Memfit AI",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Windows, Linux",
    image: "https://memfit.ai/img/memfit-ai-concept.jpg",
    url: "https://memfit.ai/",
    downloadUrl: "https://memfit.ai/downloads/",
    description: schemaDescription,
    featureList: isEn
      ? [
          "Recursive dual-engine (ReAct real-time reasoning + Plan task planning)",
          "Memory and RAG knowledge augmentation",
          "Tools and Forges security capability system",
          "Knowledge base system",
          "Spin detection and agentic reliability guarantees",
          "Multiple focus modes (deep research / fast execution, etc.)",
        ]
      : [
          "递归式双引擎（ReAct 实时推理 + Plan 任务规划）",
          "记忆与 RAG 知识增强",
          "工具与 Forges 安全能力体系",
          "知识库系统",
          "自旋检测与 Agentic 可靠性保障",
          "多专注模式（深度研究 / 快速执行等）",
        ],
    license: "https://www.apache.org/licenses/LICENSE-2.0",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };
  // WebSite 实体（GEO：publisher 用 @id 关联 Organization 实体）
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://memfit.ai/#website",
    name: "Memfit AI",
    url: "https://memfit.ai/",
    inLanguage: ["zh-CN", "en-US"],
    publisher: { "@id": "https://memfit.ai/#organization" },
    // GEO：SearchAction（CLAUDE.md 待办 D）。站内无后端搜索端点，
    // 指向 Google 站搜模板是合规的 sitelinks search box 声明；
    // Google 2024-11 起不再展示该富结果，但 schema 本身仍有效，
    // 为 AI 平台提供"如何检索本站"的机器可读入口
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.google.com/search?q=site:memfit.ai+{search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
  // GEO：首页 FAQPage schema（与 FaqSection 可见问答一一对应，
  // 答案与 /docs/product/overview/ FAQ 口径一致）
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://memfit.ai/${isEn ? "en/" : ""}#faq`,
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
    // GEO：声明 AI 助手可朗读的 FAQ 问句与直答段
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#faq h2", "#faq h3", "#faq h3 + p"],
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <PageMetadata title={metaTitle} description={metaDescription} />
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(softwareSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
        {/* 补齐 og:type 与 twitter 卡片元数据（GEO：AI 平台对 OG/Twitter 完整性的解析信号） */}
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={twitterTitle} />
        <meta name="twitter:description" content={metaDescription} />
      </Head>
      <Header locale={locale} onToggleLocale={handleToggleLocale} />
      <div className={`${theme === "light" ? "bg-white theme-light" : "bg-[#171717] theme-dark"}`}>
        <main className="pt-[72px] desktop:pt-[56px] overflow-x-hidden">
          <HeroSection locale={locale} />
          <WhatIsSection locale={locale} />
          <ProblemSection locale={locale} />
          <ArchitectureSection locale={locale} />
          <NavigationBar locale={locale} allSections={content.sections}/>
            {content.sections.map((section, idx) => {
              const isLast = idx === content.sections.length - 1;
              return (
                <div
                  key={section.id}
                  /* GEO：移动端粘性滚动副本，桌面版（NavigationBar）为规范副本；
                     aria-hidden 避免五大支柱文案被 AI 爬虫重复提取 */
                  aria-hidden="true"
                  className={`sticky-container desktop:hidden ${isLast ? 'h-auto' : 'h-auto desktop:h-[100vh]'}`}
                  style={{
                    position: 'relative',
                    marginBottom: 0
                  }}
                >
                  <FeatureSection 
                    section={section} 
                    index={idx} 
                    totalSections={content.sections.length}
                    allSections={content.sections}
                  />
                </div>
              );
            })}
        {/* GEO：首页问答区（问句 H2/H3 + 直答段），置于五大支柱与 Footer 之间 */}
        <FaqSection locale={locale} />
        <Footer locale={locale} />
      </main>
    </div>
    </ThemeContext.Provider>
  );
};

export default NewHome;
