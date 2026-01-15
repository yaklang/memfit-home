import { useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { CONTENT, type Locale } from "./locales";
import { ThemeContext, type Theme } from "./context/ThemeContext";
import {
  Header,
  HeroSection,
  WhatIsSection,
  ProblemSection,
  ArchitectureSection,
  FeatureSection,
  NavigationBar,
  Footer,
} from "./components";

export const NewHome = (): ReactNode => {
  const { i18n } = useDocusaurusContext();
  const [locale, setLocale] = useState<Locale>("zh-Hans");
  const [theme, setTheme] = useState<Theme>("light");
  const [isNavSticky, setIsNavSticky] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const handleToggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "en" ? "zh-Hans" : "en"));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        const headerHeight = window.innerWidth >= 1440 ? 56 : 72;
        
        // 提前触发：当导航栏距离目标位置还有一定距离时就开始固定
        // rect.top 是导航栏当前距离视口顶部的距离
        const triggerOffset = 100; // 提前100px触发，让过渡更自然
        setIsNavSticky(rect.top <= headerHeight + triggerOffset);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // 立即执行一次
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const content = CONTENT[locale];

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Header locale={locale} onToggleLocale={handleToggleLocale} />
      <main className={`overflow-x-hidden pt-[72px] desktop:pt-[56px] ${theme === "light" ? "bg-white" : "bg-[#0a0a14]"}`}>
       <HeroSection locale={locale} />
        <WhatIsSection locale={locale} />
        <ArchitectureSection locale={locale} />
        <ProblemSection locale={locale} />
        <div ref={navRef}>
          <div style={{ visibility: isNavSticky ? 'hidden' : 'visible' }}>
            <NavigationBar locale={locale} isSticky={false} />
          </div>
        </div>
        {isNavSticky && (
          <div 
            className={`fixed left-0 right-0 z-50 top-[72px] desktop:top-[56px]  ${theme === "light" ? "bg-white" : "bg-[#0f0f1a]/95"}  `}
            style={{
              animation: 'fadeIn 0.2s ease-in',
            }}
          >
            <NavigationBar locale={locale} isSticky={true} />
          </div>
        )}
        <div>
          {content.sections.map((section, idx) => (
            <FeatureSection key={section.id} section={section} index={idx} />
          ))}
        </div>

        <Footer locale={locale} />
      </main>
    </ThemeContext.Provider>
  );
};

export default NewHome;
