import Link from "@docusaurus/Link";
import { CONTENT, type Locale } from "../locales";
import { useTheme } from "../context/ThemeContext";
import { MemfitLogo, MemfitLogoDark } from "../icons";
import { useDownload } from "../hooks/useDownload";

const MemfitLogoSwitch: React.FC<{ className?: string }> = ({ className }) => {
  const { theme } = useTheme();
  return theme === "dark" ? (
    <MemfitLogoDark className={className} />
  ) : (
    <MemfitLogo className={className} />
  );
};

interface FooterProps {
  locale: Locale;
}

export const Footer = ({ locale }: FooterProps) => {
  const { theme } = useTheme();
  const content = CONTENT[locale];
  const { downloadUrl, buttonText } = useDownload(locale);

  // 断点: 默认(393) / tablet(744) / desktop(1440) / 2xl(1920)

  return (
    <footer
      className="relative overflow-hidden min-h-[400px] tablet:min-h-[450px] desktop:min-h-[488px]"
      style={{
        background: theme === "light"
          ? 'linear-gradient(180deg, #F8F9FA 0%, #E3EBF5 50%, #D5E3F2 100%)'
          : 'linear-gradient(180deg, #171717 0%, #1a2332 50%, #4373BB 100%)',
      }}
    >
      <div className="grid grid-cols-1 desktop:grid-cols-[1fr_2fr] gap-8 desktop:gap-16 px-4 tablet:px-6 desktop:px-12 2xl:px-16 py-10 tablet:py-12 desktop:py-16 max-w-[1400px] 2xl:max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-4 tablet:gap-6">
          <MemfitLogoSwitch className="h-10 tablet:h-12 desktop:h-14 w-fit" />
          <a
            href={downloadUrl}
            download
            className={`inline-flex items-center justify-center px-5 tablet:px-7 py-2 tablet:py-3.5 text-sm tablet:text-[15px] font-semibold rounded-4 no-underline transition-all max-w-fit hover:-translate-y-0.5 hover:no-underline ${
              theme === "light"
                ? "bg-[#4373bb] text-white hover:bg-[#5a8fd0] hover:text-white"
                : "bg-[#4373bb] text-white hover:bg-[#5a8fd0] hover:text-white"
            }`}
          >
            {buttonText}
          </a>
          <p
            className={`text-xs tablet:text-sm m-0 ${
              theme === "light" ? "text-[#4a4a6a]" : "text-white/50"
            }`}
          >
            Copyright ©  {new Date().getFullYear()} Memfit AI. Built with Docusaurus.
          </p>
        </div>
        <div className="grid grid-cols-2 tablet:grid-cols-4 gap-6 tablet:gap-8">
          <div className="flex flex-col gap-2 tablet:gap-3">
            <h4
              className={`text-xs tablet:text-sm font-semibold uppercase tracking-wider mb-1 tablet:mb-2 ${
                theme === "light" ? "text-[#868C97]" : "text-white/50"
              }`}
            >
              Products
            </h4>
            <Link
              to="/docs/product/overview"
              className={`text-sm tablet:text-[15px] no-underline transition-colors hover:no-underline ${
                theme === "light"
                  ? "text-[#4a4a6a] hover:text-[#4373bb]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Overview
            </Link>
            <Link
              to="/docs/product/architecture/recursive-dual-engine"
              className={`text-sm tablet:text-[15px] no-underline transition-colors hover:no-underline ${
                theme === "light"
                  ? "text-[#4a4a6a] hover:text-[#4373bb]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Architecture
            </Link>
            <Link
              to="/docs/product/features/react-loop"
              className={`text-sm tablet:text-[15px] no-underline transition-colors hover:no-underline ${
                theme === "light"
                  ? "text-[#4a4a6a] hover:text-[#4373bb]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Features
            </Link>
          </div>
          <div className="flex flex-col gap-2 tablet:gap-3">
            <h4
              className={`text-xs tablet:text-sm font-semibold uppercase tracking-wider mb-1 tablet:mb-2 ${
                theme === "light" ? "text-[#868C97]" : "text-white/50"
              }`}
            >
              Help
            </h4>
            <Link
              to="/docs/help/quick-start/installation"
              className={`text-sm tablet:text-[15px] no-underline transition-colors hover:no-underline ${
                theme === "light"
                  ? "text-[#4a4a6a] hover:text-[#4373bb]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Quick Start
            </Link>
            <Link
              to="/docs/help/tutorials/configuration"
              className={`text-sm tablet:text-[15px] no-underline transition-colors hover:no-underline ${
                theme === "light"
                  ? "text-[#4a4a6a] hover:text-[#4373bb]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Tutorials
            </Link>
          </div>
          <div className="flex flex-col gap-2 tablet:gap-3">
            <h4
              className={`text-xs tablet:text-sm font-semibold uppercase tracking-wider mb-1 tablet:mb-2 ${
                theme === "light" ? "text-[#868C97]" : "text-white/50"
              }`}
            >
              Community
            </h4>
            <a
              href="https://yaklang.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm tablet:text-[15px] no-underline transition-colors hover:no-underline ${
                theme === "light"
                  ? "text-[#4a4a6a] hover:text-[#4373bb]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Yaklang
            </a>
            <a
              href="https://ssa.to"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm tablet:text-[15px] no-underline transition-colors hover:no-underline ${
                theme === "light"
                  ? "text-[#4a4a6a] hover:text-[#4373bb]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              SSA
            </a>
          </div>
          <div className="flex flex-col gap-2 tablet:gap-3">
            <h4
              className={`text-xs tablet:text-sm font-semibold uppercase tracking-wider mb-1 tablet:mb-2 ${
                theme === "light" ? "text-[#868C97]" : "text-white/50"
              }`}
            >
              More
            </h4>
            <a
              href="https://github.com/yaklang/memfit-home"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm tablet:text-[15px] no-underline transition-colors hover:no-underline ${
                theme === "light"
                  ? "text-[#4a4a6a] hover:text-[#4373bb]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
      <div className="absolute bottom-[-30px] tablet:bottom-[-50px] left-1/2 -translate-x-1/2 pointer-events-none opacity-[0.04]">
        <div
          className={`font-mono text-[100px] tablet:text-[140px] desktop:text-[180px] 2xl:text-[220px] font-extrabold whitespace-nowrap -tracking-[3px] tablet:-tracking-[5px] ${
            theme === "light" ? "text-[#1a1a2e]" : "text-white"
          }`}
          style={{ fontFamily: 'DotGothic16, sans-serif', letterSpacing: '12px' }}
        >
          memfit::
        </div>
      </div>
    </footer>
  );
};
