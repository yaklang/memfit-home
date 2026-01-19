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
      const headerHeight = window.innerWidth >= 1440 ? 56 : 72;
      const scrollY = window.scrollY;

      // 获取所有section容器
      const containers = document.querySelectorAll('.sticky-container') || document.querySelectorAll('[style*="height: 100vh"]');
      if (containers.length === 0) return;

      // 找到当前在视口范围内的section容器
      let activeId = sections[0]?.id || '';
      let maxVisibleArea = 0;

      for (let i = 0; i < containers.length; i++) {
        const container = containers[i];
        const rect = container.getBoundingClientRect();

        // 计算section在视口中的可见区域
        const visibleTop = Math.max(0, rect.top - headerHeight);
        const visibleBottom = Math.min(window.innerHeight - headerHeight, rect.bottom - headerHeight);
        const visibleArea = Math.max(0, visibleBottom - visibleTop);

        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea;
          activeId = sections[i].id;
        }
      }

      setActiveSection(activeId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
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
      className={`hidden desktop:block transition-all duration-200 ${
        theme === "light"
          ? "bg-[#F8F9FA] border-[#E6E8ED]"
          : "border-[#474A4F]"
      } border-b border-t backdrop-blur-md border-l-0 border-r-0 border-solid`}
    >
      <div className="flex justify-start px-4 tablet:px-6 desktop:px-12 overflow-x-auto scrollbar-hide">
        {sections.map((tab, idx) => {
          const isActive = activeSection === tab.id;
          const highlightColor = theme === "light" ? "#4373BB" : "#66A2EB";
          return (
            <div key={idx} className="flex-shrink-0 relative">
            <a
              href={`#${tab.id}`}
              onClick={(e) => handleNavClick(e, tab.id)}
                className={`relative border-0 ${idx === 0 ? 'border-l border-r' : 'border-r'}  border-solid flex items-center gap-2 px-3 tablet:px-4 py-2 tablet:py-2.5 no-underline transition-all hover:no-underline whitespace-nowrap ${
                  isActive
                    ? theme === "light"
                      ? "bg-[#E8F2FF] border-[#E6E8ED]"
                      : "bg-[#1a2844] text-[#6fa8dc] hover:text-white border-[#474A4F]"
                    : theme === "light"
                      ? "bg-transparent hover:bg-slate-50 text-[#5A5D64] border-[#E6E8ED]"
                      : "bg-transparent hover:bg-white/5 hover:text-white text-white/70 border-[#474A4F]"
                }`}
                style={{ fontFamily: 'DotGothic16, sans-serif', color: isActive && theme === "light" ? highlightColor : undefined }}
              >
                {/* 四个角的装饰 */}
                <div className="absolute left-0 top-0 w-[6px] h-[6px]" style={{ borderLeft: `1px solid ${isActive ? highlightColor : theme === 'light' ? '#E6E8ED' : '#474A4F'}`, borderTop: `1px solid ${isActive ? highlightColor : theme === 'light' ? '#E6E8ED' : '#474A4F'}` }} />
                <div className="absolute right-0 top-0 w-[6px] h-[6px]" style={{ borderRight: `1px solid ${isActive ? highlightColor : theme === 'light' ? '#E6E8ED' : '#474A4F'}`, borderTop: `1px solid ${isActive ? highlightColor : theme === 'light' ? '#E6E8ED' : '#474A4F'}` }} />
                <div className="absolute left-0 bottom-0 w-[6px] h-[6px]" style={{ borderLeft: `1px solid ${isActive ? highlightColor : theme === 'light' ? '#E6E8ED' : '#474A4F'}`, borderBottom: `1px solid ${isActive ? highlightColor : theme === 'light' ? '#E6E8ED' : '#474A4F'}` }} />
                <div className="absolute right-0 bottom-0 w-[6px] h-[6px]" style={{ borderRight: `1px solid ${isActive ? highlightColor : theme === 'light' ? '#E6E8ED' : '#474A4F'}`, borderBottom: `1px solid ${isActive ? highlightColor : theme === 'light' ? '#E6E8ED' : '#474A4F'}` }} />
                
                <span className="text-[13px] tablet:text-[14px] font-medium">
                  {tab.title}({tab.subtitle})
                </span>
            </a>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
