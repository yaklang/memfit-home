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
  const [theme, setTheme] = useState<Theme>(() => {
    // 从 sessionStorage 读取主题，默认为 light
    if (typeof window !== 'undefined') {
      const savedTheme = sessionStorage.getItem('theme');
      return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
    }
    return 'light';
  });
  const [isNavSticky, setIsNavSticky] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        const headerHeight = window.innerWidth >= 1440 ? 56 : 72;
        
        setIsNavSticky(rect.top <= headerHeight - 20);
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
      <div className={`${theme === "light" ? "bg-white theme-light" : "bg-[#0a0a14] theme-dark"}`}>
        <main className="pt-[72px] desktop:pt-[56px] overflow-x-hidden">
          <HeroSection locale={locale} />
          <WhatIsSection locale={locale} />
          <ProblemSection locale={locale} />
          <ArchitectureSection locale={locale} />
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
        <div className="relative">
          {content.sections.map((section, idx) => {
            const isLast = idx === content.sections.length - 1;
            return (
              <div
                key={section.id}
                className={`sticky-container ${isLast ? 'h-auto' : 'h-auto desktop:h-[100vh]'}`}
                style={{
                  position: 'relative',
                  marginBottom: 0
                }}
              >
                <FeatureSection section={section} index={idx} totalSections={content.sections.length} />
              </div>
            );
          })}
        </div>

        <Footer locale={locale} />
      </main>
    </div>
    </ThemeContext.Provider>
  );
};

export default NewHome;
