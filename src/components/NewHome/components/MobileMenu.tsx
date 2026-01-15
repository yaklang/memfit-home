import Link from "@docusaurus/Link";
import { CONTENT, type Locale } from "../locales";
import { useTheme } from "../context/ThemeContext";
import {
  ExternalLinkIcon,
  SunIcon,
  MoonIcon,
  MemfitLogo,
  MemfitLogoDark,
} from "../icons";

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const MemfitLogoSwitch: React.FC<{ className?: string }> = ({ className }) => {
  const { theme } = useTheme();
  return theme === "dark" ? (
    <MemfitLogoDark className={className} />
  ) : (
    <MemfitLogo className={className} />
  );
};

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  onToggleLocale: () => void;
}

export const MobileMenu = ({
  isOpen,
  onClose,
  locale,
  onToggleLocale,
}: MobileMenuProps) => {
  const content = CONTENT[locale];
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] desktop:hidden">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`absolute top-0 right-0 w-[280px] tablet:w-[320px] h-full shadow-2xl ${
        theme === "light" ? "bg-white" : "bg-[#1a1a2e]"
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-black/5">
          <MemfitLogoSwitch className="h-8" />
          <button 
            onClick={onClose}
            className="p-2 bg-transparent border-none cursor-pointer"
          >
            <CloseIcon className={`w-6 h-6 ${theme === "light" ? "text-[#1a1a2e]" : "text-white"}`} />
          </button>
        </div>
        
        <nav className="flex flex-col p-4 gap-2">
          <Link
            to="/docs/product/overview"
            onClick={onClose}
            className={`px-4 py-3 rounded-lg text-base font-medium no-underline transition-colors ${
              theme === "light"
                ? "text-[#4a4a6a] hover:bg-slate-100"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            {content.nav.product}
          </Link>
          <Link
            to="/docs/help/quick-start/installation"
            onClick={onClose}
            className={`px-4 py-3 rounded-lg text-base font-medium no-underline transition-colors ${
              theme === "light"
                ? "text-[#4a4a6a] hover:bg-slate-100"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            {content.nav.docs}
          </Link>
          <Link
            to="/downloads"
            onClick={onClose}
            className={`px-4 py-3 rounded-lg text-base font-medium no-underline transition-colors ${
              theme === "light"
                ? "text-[#4a4a6a] hover:bg-slate-100"
                : "text-white/80 hover:bg-white/10"
            }`}
          >
            {content.nav.download}
          </Link>
        </nav>

        <div className="p-4 border-t border-black/5">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm ${theme === "light" ? "text-slate-500" : "text-white/60"}`}>
              {content.buttons.language}
            </span>
            <button
              onClick={onToggleLocale}
              className={`px-3 py-1.5 text-sm rounded-lg border-none cursor-pointer ${
                theme === "light"
                  ? "bg-slate-100 text-[#4a4a6a]"
                  : "bg-white/10 text-white/80"
              }`}
            >
              {content.buttons.languageAlt}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`text-sm ${theme === "light" ? "text-slate-500" : "text-white/60"}`}>
              主题
            </span>
            <div className={`flex items-center rounded-full w-14 h-8 ${
              theme === "light" ? "bg-black/5" : "bg-white/10"
            }`}>
              <button
                onClick={() => theme === "dark" && toggleTheme()}
                className={`flex items-center justify-center w-8 h-8 border-none rounded-full transition-colors cursor-pointer ${
                  theme === "light" ? "bg-white shadow-sm" : "bg-transparent"
                }`}
              >
                <SunIcon className={`w-4 h-4 ${theme === "light" ? "text-[#4373bb]" : "text-white/60"}`} />
              </button>
              <button
                onClick={() => theme === "light" && toggleTheme()}
                className={`flex items-center justify-center w-8 h-8 border-none rounded-full transition-colors cursor-pointer -ml-2 ${
                  theme === "dark" ? "bg-white/20 shadow-sm" : "bg-transparent"
                }`}
              >
                <MoonIcon className={`w-4 h-4 ${theme === "dark" ? "text-[#6fa8dc]" : "text-[#4a4a6a]"}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <a
            href="https://github.com/yaklang/memfit-home"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg no-underline transition-colors ${
              theme === "light"
                ? "bg-slate-100 text-[#4a4a6a]"
                : "bg-white/10 text-white/80"
            }`}
          >
            {content.buttons.github}
            <ExternalLinkIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
