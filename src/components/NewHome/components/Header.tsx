import { useState } from "react";
import Link from "@docusaurus/Link";
import { CONTENT, type Locale } from "../locales";
import { useTheme } from "../context/ThemeContext";
import {
  ExternalLinkIcon,
  ChevronDownIcon,
  MenuIcon,
  MemfitLogo,
  MemfitLogoDark,
  MoonIcon,
  SunIcon,
  SunIconActive,
  MoonIconActive,
} from "../icons";
import { MobileMenu } from "./MobileMenu";

const MemfitLogoSwitch: React.FC<{ className?: string }> = ({ className }) => {
  const { theme } = useTheme();
  return theme === "dark" ? (
    <MemfitLogoDark className={className} />
  ) : (
    <MemfitLogo className={className} />
  );
};


interface HeaderProps {
  locale: Locale;
  onToggleLocale: () => void;
}

export const Header = ({ locale, onToggleLocale }: HeaderProps) => {
  const content = CONTENT[locale];
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 tablet:px-6 desktop:px-12 2xl:px-16 h-[72px] desktop:h-[56px] backdrop-blur-md border-b transition-all ${
          theme === "light"
            ? "bg-white/90 border-black/5"
            : "bg-[#0a0a14]/90 border-white/10"
        }`}
      >
        <div className="flex items-center gap-4 tablet:gap-6 desktop:gap-12">
          <Link to="/" className="flex items-center gap-2">
            <MemfitLogoSwitch className="h-8 desktop:h-7" />
          </Link>
          <nav className="hidden desktop:flex items-center gap-8 2xl:gap-12">
            <Link
              to="/docs/product/overview"
              className={`text-[14px] font-medium transition-colors hover:text-[#4373BB] whitespace-nowrap ${
                theme === "light"
                  ? "text-[#353639]"
                  : "text-[#C8D0DD]"
              }`}
            >
              {content.nav.product}
            </Link>
            <Link
              to="/docs/help/quick-start/installation"
              className={`text-[14px] font-medium transition-colors hover:text-[#4373BB] whitespace-nowrap ${
                theme === "light"
                  ? "text-[#353639]"
                  : "text-[#C8D0DD]"
              }`}
            >
              {content.nav.docs}
            </Link>
            <Link
              to="/downloads"
              className={`text-[14px] font-medium transition-colors hover:text-[#4373BB] whitespace-nowrap ${
                theme === "light"
                  ? "text-[#353639]"
                  : "text-[#C8D0DD]"
              }`}
            >
              {content.nav.download}
            </Link>
          </nav>
        </div>

        <div className="hidden desktop:flex items-center gap-6">
          {/* GitHub */}
          <a
            href="https://github.com/yaklang/memfit-home"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[14px] font-medium transition-colors no-underline hover:text-[#4373BB] whitespace-nowrap flex items-center gap-1 ${
              theme === "light"
                ? "text-[#353639]"
                : "text-[#C8D0DD]"
            }`}
          >
            {content.buttons.github}
            <ExternalLinkIcon className="w-3 h-3" />
          </a>

          {/* 语言切换 */}
          <div className="relative">
            <button
              className={`flex items-center gap-1 text-[14px] hover:text-[#4373BB] border-none font-medium bg-transparent transition-colors cursor-pointer whitespace-nowrap ${
                theme === "light"
                  ? "text-[#353639]"
                  : "text-[#C8D0DD]"
              }`}
              onClick={() => setShowLangMenu(!showLangMenu)}
              onBlur={() => setTimeout(() => setShowLangMenu(false), 150)}
            >
              {content.buttons.language}
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            {showLangMenu && (
              <div
                className={`absolute top-[calc(100%+8px)] right-0 min-w-[120px] rounded-lg shadow-xl overflow-hidden z-[1000] ${
                  theme === "light" ? "bg-white" : "bg-[#1a1a2e]"
                }`}
              >
                <button
                  className={`block w-full px-4 py-3 text-sm bg-transparent border-none text-left transition-colors cursor-pointer whitespace-nowrap ${
                    theme === "light"
                      ? "text-[#4a4a6a] hover:bg-[#4373bb]/8 hover:text-[#4373bb]"
                      : "text-[#C8D0DD] hover:bg-white/10 hover:text-[#C8D0DD]"
                  }`}
                  onClick={() => {
                    onToggleLocale();
                    setShowLangMenu(false);
                  }}
                >
                  {content.buttons.languageAlt}
                </button>
              </div>
            )}
          </div>

          {/* 主题切换 - 胶囊容器 56x32, 按钮24x24, 图标18x18 */}
          <div className={`flex items-center w-[56px] h-[32px] p-[4px] rounded-full ${
            theme === "light" ? "bg-[#E8EDF2]" : "bg-white/10"
          }`}>
            <button
              onClick={() => theme === "dark" && toggleTheme()}
              className={`flex items-center justify-center w-[24px] h-[24px] border-none rounded-full transition-all cursor-pointer p-0 ${
                theme === "light" 
                  ? "bg-white shadow-sm" 
                  : "bg-transparent"
              }`}
            >
              {theme === "light" ? (
                <SunIconActive className="w-[24px] h-[24px]" />
              ) : (
                <SunIcon className="w-[24px] h-[24px]" />
              )}
            </button>
            <button
              onClick={() => theme === "light" && toggleTheme()}
              className={`flex items-center justify-center w-[24px] h-[24px] border-none rounded-full transition-all cursor-pointer p-0 ${
                theme === "dark" 
                  ? "bg-white/20 shadow-sm" 
                  : "bg-transparent"
              }`}
            >
              {theme === "dark" ? (
                <MoonIconActive className="w-[24px] h-[24px]" />
              ) : (
                <MoonIcon className="w-[24px] h-[24px]" />
              )}
            </button>
          </div>
        </div>

        <button 
          className="flex desktop:hidden p-2 bg-transparent border-none cursor-pointer"
          onClick={() => setMobileMenuOpen(true)}
        >
          <MenuIcon className={`w-6 h-6 ${theme === "light" ? "text-[#1a1a2e]" : "text-white"}`} />
        </button>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        locale={locale}
        onToggleLocale={onToggleLocale}
      />
    </>
  );
};
