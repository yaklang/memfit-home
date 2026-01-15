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

// 内联 Sun 图标组件
const SunIconInline: React.FC<{ fill: string; className?: string }> = ({ fill, className }) => (
  <svg className={className} viewBox="0 0 24 24" fill={fill}>
    <path d="M11.9996 5.6C12.4414 5.6 12.7996 5.95817 12.7996 6.4V7.2C12.7996 7.64183 12.4414 8 11.9996 8C11.5578 8 11.1996 7.64183 11.1996 7.2V6.4C11.1996 5.95817 11.5578 5.6 11.9996 5.6Z" />
    <path d="M15.1996 12C15.1996 13.7673 13.7669 15.2 11.9996 15.2C10.2323 15.2 8.79961 13.7673 8.79961 12C8.79961 10.2327 10.2323 8.8 11.9996 8.8C13.7669 8.8 15.1996 10.2327 15.1996 12Z" />
    <path d="M14.8281 15.9598L15.3938 16.5255C15.7062 16.8379 16.2127 16.8379 16.5251 16.5255C16.8376 16.213 16.8376 15.7065 16.5251 15.3941L15.9594 14.8284C15.647 14.516 15.1405 14.516 14.8281 14.8284C14.5157 15.1408 14.5157 15.6473 14.8281 15.9598Z" />
    <path d="M16.5251 7.47447C16.8375 7.78689 16.8375 8.29343 16.5251 8.60585L15.9594 9.17153C15.647 9.48395 15.1404 9.48395 14.828 9.17153C14.5156 8.85911 14.5156 8.35258 14.828 8.04016L15.3937 7.47447C15.7061 7.16206 16.2126 7.16206 16.5251 7.47447Z" />
    <path d="M17.5996 12.8C18.0414 12.8 18.3996 12.4418 18.3996 12C18.3996 11.5582 18.0414 11.2 17.5996 11.2H16.7996C16.3578 11.2 15.9996 11.5582 15.9996 12C15.9996 12.4418 16.3578 12.8 16.7996 12.8H17.5996Z" />
    <path d="M11.9996 16C12.4414 16 12.7996 16.3582 12.7996 16.8V17.6C12.7996 18.0418 12.4414 18.4 11.9996 18.4C11.5578 18.4 11.1996 18.0418 11.1996 17.6V16.8C11.1996 16.3582 11.5578 16 11.9996 16Z" />
    <path d="M8.03986 9.17155C8.35228 9.48396 8.85881 9.48396 9.17123 9.17155C9.48365 8.85913 9.48365 8.35259 9.17123 8.04017L8.60554 7.47449C8.29312 7.16207 7.78659 7.16207 7.47417 7.47449C7.16175 7.78691 7.16175 8.29344 7.47417 8.60586L8.03986 9.17155Z" />
    <path d="M9.17115 15.9598L8.60547 16.5254C8.29305 16.8379 7.78652 16.8379 7.4741 16.5254C7.16168 16.213 7.16168 15.7065 7.4741 15.3941L8.03978 14.8284C8.3522 14.516 8.85873 14.516 9.17115 14.8284C9.48357 15.1408 9.48357 15.6473 9.17115 15.9598Z" />
    <path d="M7.19961 12.8C7.64144 12.8 7.99961 12.4418 7.99961 12C7.99961 11.5582 7.64144 11.2 7.19961 11.2H6.39961C5.95778 11.2 5.59961 11.5582 5.59961 12C5.59961 12.4418 5.95778 12.8 6.39961 12.8H7.19961Z" />
  </svg>
);

// 内联 Moon 图标组件
const MoonIconInline: React.FC<{ fill: string; className?: string }> = ({ fill, className }) => (
  <svg className={className} viewBox="0 0 24 24" fill={fill}>
    <path d="M17.5695 14.2362C16.8784 14.5139 16.1237 14.6667 15.3333 14.6667C12.0196 14.6667 9.33333 11.9804 9.33333 8.66671C9.33333 7.87632 9.48616 7.12164 9.76388 6.43058C7.55766 7.3172 6 9.47671 6 12C6 15.3137 8.68629 18 12 18C14.5233 18 16.6828 16.4424 17.5695 14.2362Z" />
  </svg>
);

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
              className={`text-[14px] font-medium transition-colors hover:no-underline whitespace-nowrap ${
                theme === "light"
                  ? "text-[#353639] hover:text-[#353639]"
                  : "text-[#C8D0DD] hover:text-[#C8D0DD]"
              }`}
            >
              {content.nav.product}
            </Link>
            <Link
              to="/docs/help/quick-start/installation"
              className={`text-[14px] font-medium transition-colors hover:no-underline whitespace-nowrap ${
                theme === "light"
                  ? "text-[#353639] hover:text-[#353639]"
                  : "text-[#C8D0DD] hover:text-[#C8D0DD]"
              }`}
            >
              {content.nav.docs}
            </Link>
            <Link
              to="/downloads"
              className={`text-[14px] font-medium transition-colors hover:no-underline whitespace-nowrap ${
                theme === "light"
                  ? "text-[#353639] hover:text-[#353639]"
                  : "text-[#C8D0DD] hover:text-[#C8D0DD]"
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
            className={`text-[14px] font-medium transition-colors no-underline hover:no-underline whitespace-nowrap flex items-center gap-1 ${
              theme === "light"
                ? "text-[#353639] hover:text-[#353639]"
                : "text-[#C8D0DD] hover:text-[#C8D0DD]"
            }`}
          >
            {content.buttons.github}
            <ExternalLinkIcon className="w-3 h-3 text-[#868C97]" />
          </a>

          {/* 语言切换 */}
          <div className="relative">
            <button
              className={`flex items-center gap-1 text-[14px] border-none font-medium bg-transparent transition-colors cursor-pointer whitespace-nowrap ${
                theme === "light"
                  ? "text-[#353639] hover:text-[#353639]"
                  : "text-[#C8D0DD] hover:text-[#C8D0DD]"
              }`}
              onClick={() => setShowLangMenu(!showLangMenu)}
              onBlur={() => setTimeout(() => setShowLangMenu(false), 150)}
            >
              {content.buttons.language}
              <ChevronDownIcon className="w-4 h-4 text-[#868C97]" />
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
              <SunIconInline 
                className="w-[18px] h-[18px]" 
                fill={theme === "light" ? "#4373BB" : "#868C97"} 
              />
            </button>
            <button
              onClick={() => theme === "light" && toggleTheme()}
              className={`flex items-center justify-center w-[24px] h-[24px] border-none rounded-full transition-all cursor-pointer p-0 ${
                theme === "dark" 
                  ? "bg-white/20 shadow-sm" 
                  : "bg-transparent"
              }`}
            >
              <MoonIconInline 
                className="w-[18px] h-[18px]" 
                fill={theme === "dark" ? "#C8D0DD" : "#868C97"} 
              />
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
