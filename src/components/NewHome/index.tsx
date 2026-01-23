import { useState, useCallback, type ReactNode } from "react";
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

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Header locale={locale} onToggleLocale={handleToggleLocale} />
      <div className={`${theme === "light" ? "bg-white theme-light" : "bg-[#0a0a14] theme-dark"}`}>
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
        <Footer locale={locale} />
      </main>
    </div>
    </ThemeContext.Provider>
  );
};

export default NewHome;
