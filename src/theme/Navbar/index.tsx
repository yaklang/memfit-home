import {useState, useCallback} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useColorMode} from '@docusaurus/theme-common';
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
} from '../../components/NewHome/icons';
import {CONTENT, type Locale} from '../../components/NewHome/locales';

const MemfitLogoSwitch: React.FC<{className?: string}> = ({className}) => {
  const {colorMode} = useColorMode();
  return colorMode === 'dark' ? (
    <MemfitLogoDark className={className} />
  ) : (
    <MemfitLogo className={className} />
  );
};

const CloseIcon: React.FC<{className?: string}> = ({className}) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

function MobileMenu({
  isOpen,
  onClose,
  locale,
}: {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}) {
  const content = CONTENT[locale];
  const {colorMode, setColorMode} = useColorMode();
  const theme = colorMode;
  const {i18n} = useDocusaurusContext();
  const altLocale = locale === 'zh-Hans' ? 'en' : 'zh-Hans';

  const handleLocaleSwitch = useCallback(() => {
    const currentPath = window.location.pathname;
    if (locale === 'zh-Hans') {
      window.location.href = `/en${currentPath}`;
    } else {
      window.location.href = currentPath.replace(/^\/en/, '') || '/';
    }
  }, [locale]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] desktop:hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`absolute top-0 right-0 w-[280px] tablet:w-[320px] h-full shadow-2xl ${
        theme === 'light' ? 'bg-white' : 'bg-[#1a1a2e]'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-black/5">
          <MemfitLogoSwitch className="h-8" />
          <button
            onClick={onClose}
            className="p-2 bg-transparent border-none cursor-pointer"
          >
            <CloseIcon className={`w-6 h-6 ${theme === 'light' ? 'text-[#1a1a2e]' : 'text-white'}`} />
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-2">
          <Link
            to="/docs/product/overview"
            onClick={onClose}
            className={`px-4 py-3 rounded-lg text-base font-medium no-underline transition-colors ${
              theme === 'light'
                ? 'text-[#4a4a6a] hover:bg-slate-100'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            {content.nav.product}
          </Link>
          <Link
            to="/docs/help/quick-start/installation"
            onClick={onClose}
            className={`px-4 py-3 rounded-lg text-base font-medium no-underline transition-colors ${
              theme === 'light'
                ? 'text-[#4a4a6a] hover:bg-slate-100'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            {content.nav.docs}
          </Link>
          <Link
            to="/docs/help/focus-mode-dev/"
            onClick={onClose}
            className={`px-4 py-3 rounded-lg text-base font-medium no-underline transition-colors ${
              theme === 'light'
                ? 'text-[#4a4a6a] hover:bg-slate-100'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            {content.nav.developer}
          </Link>
          <Link
            to="/downloads"
            onClick={onClose}
            className={`px-4 py-3 rounded-lg text-base font-medium no-underline transition-colors ${
              theme === 'light'
                ? 'text-[#4a4a6a] hover:bg-slate-100'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            {content.nav.download}
          </Link>
        </nav>

        <div className="p-4 border-t border-black/5">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-white/60'}`}>
              {content.buttons.language}
            </span>
            <button
              onClick={handleLocaleSwitch}
              className={`px-3 py-1.5 text-sm rounded-lg border-none cursor-pointer ${
                theme === 'light'
                  ? 'bg-slate-100 text-[#4a4a6a]'
                  : 'bg-white/10 text-white/80'
              }`}
            >
              {content.buttons.languageAlt}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-sm ${theme === 'light' ? 'text-slate-500' : 'text-white/60'}`}>
              {locale === 'zh-Hans' ? '主题' : 'Theme'}
            </span>
            <div className={`flex items-center rounded-full w-14 h-8 ${
              theme === 'light' ? 'bg-black/5' : 'bg-white/10'
            }`}>
              <button
                onClick={() => theme === 'dark' && setColorMode('light')}
                className={`flex items-center justify-center w-8 h-8 border-none rounded-full transition-colors cursor-pointer ${
                  theme === 'light' ? 'bg-white shadow-sm' : 'bg-transparent'
                }`}
              >
                <SunIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => theme === 'light' && setColorMode('dark')}
                className={`flex items-center justify-center w-8 h-8 border-none rounded-full transition-colors cursor-pointer -ml-2 ${
                  theme === 'dark' ? 'bg-white/20 shadow-sm' : 'bg-transparent'
                }`}
              >
                <MoonIcon className={`w-4 h-4 ${theme === 'dark' ? 'text-[#6fa8dc]' : 'text-[#4a4a6a]'}`} />
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
              theme === 'light'
                ? 'bg-slate-100 text-[#4a4a6a]'
                : 'bg-white/10 text-white/80'
            }`}
          >
            {content.buttons.github}
            <ExternalLinkIcon className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const {i18n} = useDocusaurusContext();
  const {colorMode, setColorMode} = useColorMode();
  const theme = colorMode;
  const locale = (i18n.currentLocale === 'en' ? 'en' : 'zh-Hans') as Locale;
  const content = CONTENT[locale];

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLocaleSwitch = useCallback(() => {
    const currentPath = window.location.pathname;
    if (locale === 'zh-Hans') {
      window.location.href = `/en${currentPath}`;
    } else {
      window.location.href = currentPath.replace(/^\/en/, '') || '/';
    }
  }, [locale]);

  const linkClass = `text-[14px] font-medium transition-colors whitespace-nowrap no-underline ${
    theme === 'light'
      ? 'text-[#353639] hover:text-[#4373BB]'
      : 'text-[#C8D0DD] hover:text-[#66A2EB]'
  }`;

  return (
    <>
      <nav className="navbar navbar--fixed-top" style={{
        padding: 0, margin: 0,
        overflow: 'hidden', border: 'none', background: 'none',
        boxShadow: 'none', visibility: 'hidden', pointerEvents: 'none',
      }} aria-hidden="true" />
      <header
        className={`fixed top-0 px-6 left-0 right-0 z-[100] backdrop-blur-md border-b transition-all ${
          theme === 'light'
            ? 'bg-[#f8f9fa] border-black/5'
            : 'bg-[#171717] border-white/10'
        }`}
      >
        <div className="max-w-[1600px] mx-auto flex items-center justify-between h-[72px] desktop:h-[56px]">
          <div className="flex items-center gap-4 tablet:gap-6 desktop:gap-12">
            <Link to="/" className="flex items-center gap-2">
              <MemfitLogoSwitch className="h-8 desktop:h-7" />
            </Link>
            <nav className="hidden desktop:flex items-center gap-8 2xl:gap-12">
              <Link to="/docs/product/overview" className={linkClass}>
                {content.nav.product}
              </Link>
              <Link to="/docs/help/quick-start/installation" className={linkClass}>
                {content.nav.docs}
              </Link>
              <Link to="/docs/help/focus-mode-dev/" className={linkClass}>
                {content.nav.developer}
              </Link>
              <Link to="/downloads" className={linkClass}>
                {content.nav.download}
              </Link>
            </nav>
          </div>

          <div className="hidden desktop:flex items-center gap-6">
            <a
              href="https://github.com/yaklang/memfit-home"
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkClass} flex items-center gap-1`}
            >
              {content.buttons.github}
              <ExternalLinkIcon className="w-3 h-3" />
            </a>

            <div className="relative">
              <button
                className={`flex items-center gap-1 text-[14px] border-none font-medium bg-transparent transition-colors cursor-pointer whitespace-nowrap ${
                  theme === 'light'
                    ? 'text-[#353639] hover:text-[#4373BB]'
                    : 'text-[#C8D0DD] hover:text-[#66A2EB]'
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
                    theme === 'light' ? 'bg-white' : 'bg-[#1a1a2e]'
                  }`}
                >
                  <button
                    className={`block w-full px-4 py-3 text-sm bg-transparent border-none text-left transition-colors cursor-pointer whitespace-nowrap ${
                      theme === 'light'
                        ? 'text-[#4a4a6a] hover:bg-[#4373bb]/8 hover:text-[#4373bb]'
                        : 'text-[#C8D0DD] hover:bg-white/10 hover:text-[#C8D0DD]'
                    }`}
                    onClick={() => {
                      handleLocaleSwitch();
                      setShowLangMenu(false);
                    }}
                  >
                    {content.buttons.languageAlt}
                  </button>
                </div>
              )}
            </div>

            <div className={`flex items-center w-[56px] h-[32px] p-[4px] rounded-full ${
              theme === 'light' ? 'bg-[#E8EDF2]' : 'bg-white/10'
            }`}>
              <button
                onClick={() => theme === 'dark' && setColorMode('light')}
                className={`flex items-center justify-center w-[24px] h-[24px] border-none rounded-full transition-all cursor-pointer p-0 ${
                  theme === 'light'
                    ? 'bg-white shadow-sm'
                    : 'bg-transparent'
                }`}
              >
                {theme === 'light' ? (
                  <SunIconActive className="w-[24px] h-[24px]" />
                ) : (
                  <SunIcon className="w-[24px] h-[24px]" />
                )}
              </button>
              <button
                onClick={() => theme === 'light' && setColorMode('dark')}
                className={`flex items-center justify-center w-[24px] h-[24px] border-none rounded-full transition-all cursor-pointer p-0 ${
                  theme === 'dark'
                    ? 'bg-white/20 shadow-sm'
                    : 'bg-transparent'
                }`}
              >
                {theme === 'dark' ? (
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
            <MenuIcon className={`w-6 h-6 ${theme === 'light' ? 'text-[#1a1a2e]' : 'text-white'}`} />
          </button>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        locale={locale}
      />
    </>
  );
}
