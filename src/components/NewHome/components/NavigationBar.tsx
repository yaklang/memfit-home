import { useState, useEffect } from "react";
import { CONTENT, type Locale } from "../locales";
import { useTheme } from "../context/ThemeContext";

interface NavigationBarProps {
  locale: Locale;
  isSticky: boolean;
}

export const NavigationBar = ({ locale, isSticky }: NavigationBarProps) => {
  const { sections } = CONTENT[locale];
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(s => document.getElementById(s.id));
      const scrollPosition = window.scrollY + 150;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = isSticky ? 120 : 72;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // 断点: 默认(393) / tablet(744) / desktop(1440) / 2xl(1920)

  return (
    <nav
      className={`transition-all duration-200   max-w-[1400px] 2xl:max-w-[1600px] mx-auto  ${
        theme === "light"
          ? "bg-white/95 border-black/5"
          : ""
      } border-b backdrop-blur-md`}
    >
      <div className="flex justify-start px-4 tablet:px-6 desktop:px-12 2xl:px-12 py-2 tablet:py-4 overflow-x-auto scrollbar-hide">
        {sections.map((tab, idx) => {
          const isActive = activeSection === tab.id;
          const tabNumber = String(idx + 1).padStart(2, '0');
          return (
            <div key={idx} className="flex-shrink-0 relative">
            <a
              href={`#${tab.id}`}
              onClick={(e) => handleNavClick(e, tab.id)}
                className={`relative flex items-center gap-2 px-3 tablet:px-4 py-2 tablet:py-2.5 no-underline transition-all hover:no-underline whitespace-nowrap ${
                  isActive
                    ? theme === "light"
                      ? "bg-[#E8F2FF] text-[#4373bb]"
                      : "bg-[#1a2844] text-[#6fa8dc]"
                    : theme === "light"
                      ? "bg-transparent hover:bg-slate-50 text-[#5A5D64]"
                      : "bg-transparent hover:bg-white/5 text-white/70"
                }`}
              >
                {/* 四个角的装饰 */}
                <div className="absolute -left-[2px] -top-[2px] w-3 h-3" style={{ borderLeft: `2px solid ${isActive ? '#4373bb' : theme === 'light' ? '#E6E8ED' : 'rgba(255,255,255,0.2)'}`, borderTop: `2px solid ${isActive ? '#4373bb' : theme === 'light' ? '#E6E8ED' : 'rgba(255,255,255,0.2)'}` }} />
                <div className="absolute -right-[2px] -top-[2px] w-3 h-3" style={{ borderRight: `2px solid ${isActive ? '#4373bb' : theme === 'light' ? '#E6E8ED' : 'rgba(255,255,255,0.2)'}`, borderTop: `2px solid ${isActive ? '#4373bb' : theme === 'light' ? '#E6E8ED' : 'rgba(255,255,255,0.2)'}` }} />
                <div className="absolute -left-[2px] -bottom-[2px] w-3 h-3" style={{ borderLeft: `2px solid ${isActive ? '#4373bb' : theme === 'light' ? '#E6E8ED' : 'rgba(255,255,255,0.2)'}`, borderBottom: `2px solid ${isActive ? '#4373bb' : theme === 'light' ? '#E6E8ED' : 'rgba(255,255,255,0.2)'}` }} />
                <div className="absolute -right-[2px] -bottom-[2px] w-3 h-3" style={{ borderRight: `2px solid ${isActive ? '#4373bb' : theme === 'light' ? '#E6E8ED' : 'rgba(255,255,255,0.2)'}`, borderBottom: `2px solid ${isActive ? '#4373bb' : theme === 'light' ? '#E6E8ED' : 'rgba(255,255,255,0.2)'}` }} />
                
                <span
                  className={`w-6 h-6 tablet:w-7 tablet:h-7 flex items-center justify-center text-[11px] tablet:text-xs font-mono ${
                    isActive
                      ? theme === "light"
                        ? "bg-[#4373bb]/10 text-[#4373bb]"
                        : "bg-[#6fa8dc]/10 text-[#6fa8dc]"
                      : theme === "light"
                        ? "bg-[#F2F3F5] text-[#5A5D64]"
                        : "bg-white/10 text-white/70"
                }`}
                  style={{
                    borderRadius: '4px',
                  }}
              >
                {tabNumber}
              </span>
                <span className="text-[13px] tablet:text-[14px] font-medium">
                {tab.title}
              </span>
            </a>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
