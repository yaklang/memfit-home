import Link from "@docusaurus/Link";
import { CONTENT, type Locale } from "../locales";
import { useTheme } from "../context/ThemeContext";
import {
  MemfitLogo,
  MemfitLogoDark,
  FooterTitleIcon,
  DownloadIcon,
} from "../icons";
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
  const highlightColor = theme === "light" ? "#4373BB" : "#66A2EB";
  const { downloadUrl, buttonText } = useDownload(locale);

  // 断点: 默认(393) / tablet(744) / desktop(1440) / 2xl(1920)

  return (
    <footer
      className="relative flex-col flex desktop:items-center px-6"
      style={{
        background:
          theme === "light"
            ? "linear-gradient(180deg, #F8F9FA 0%, #A1B9DC 100%)"
            : "linear-gradient(180deg, #171717 0%, #2C4468 100%)",
      }}
    >
      <div className="max-w-[1600px] w-full grid grid-cols-1 desktop:grid-cols-[1fr_2fr] gap-8 desktop:gap-16 pt-10 tablet:py-12 desktop:py-16 ">
        <div className="flex flex-col gap-4 tablet:gap-6">
          <MemfitLogoSwitch className="h-[56px] tablet:h-12 desktop:h-14 w-fit" />
          <a
            href={downloadUrl}
            download
            className="w-full desktop:max-w-fit inline-flex items-center justify-center px-5 tablet:px-7 py-2 tablet:py-3.5 text-sm tablet:text-[15px] font-semibold rounded-4 transition-all hover:-translate-y-0.5"
            style={{
              backgroundColor: highlightColor,
              color: "#EEF3F9",
            }}
          >
            {buttonText}
            <DownloadIcon className="ml-1 w-5 h-5" />
          </a>
          <div
            className={`text-sm ${
              theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
            }`}
          >
            Copyright © {new Date().getFullYear()} Memfit AI. Built with Docusaurus.
          </div>
        </div>
        <div className="hidden desktop:grid grid-cols-2 tablet:grid-cols-4 gap-6 tablet:gap-8">
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
                  ? "text-[#353639]"
                  : "text-[#C8D0DD] hover:text-white"
              }`}
            >
              Overview
            </Link>
            <Link
              to="/docs/product/architecture/recursive-dual-engine"
              className={`text-sm tablet:text-[15px] no-underline transition-colors hover:no-underline ${
                theme === "light"
                  ? "text-[#353639]"
                  : "text-[#C8D0DD] hover:text-white"
              }`}
            >
              Architecture
            </Link>
            <Link
              to="/docs/product/features/react-loop"
              className={`text-sm tablet:text-[15px] no-underline transition-colors hover:no-underline ${
                theme === "light"
                  ? "text-[#353639]"
                  : "text-[#C8D0DD] hover:text-white"
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
                  ? "text-[#353639]"
                  : "text-[#C8D0DD] hover:text-white"
              }`}
            >
              Quick Start
            </Link>
            <Link
              to="/docs/help/tutorials/configuration"
              className={`text-sm tablet:text-[15px] no-underline transition-colors hover:no-underline ${
                theme === "light"
                  ? "text-[#353639]"
                  : "text-[#C8D0DD] hover:text-white"
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
                  ? "text-[#353639]"
                  : "text-[#C8D0DD] hover:text-white"
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
                  ? "text-[#353639]"
                  : "text-[#C8D0DD] hover:text-white"
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
                  ? "text-[#353639]"
                  : "text-[#C8D0DD] hover:text-white"
              }`}
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
      <FooterTitleIcon className={`max-w-[1600px] w-full h-auto tablet:w-1/2 desktop:w-full`} />
    </footer>
  );
};
