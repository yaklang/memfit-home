import Link from "@docusaurus/Link";
import { CONTENT, type Locale } from "../locales";
import { DownloadIcon, MemfitWhiteText } from "../icons";
import { useDownload } from "../hooks/useDownload";
import { useTheme } from "../context/ThemeContext";

interface HeroSectionProps {
  locale: Locale;
}

export const HeroSection = ({ locale }: HeroSectionProps) => {
  const content = CONTENT[locale];
  const { downloadUrl, buttonText } = useDownload(locale);
  const { theme } = useTheme();
  const highlightColor = theme === "light" ? "#4373BB" : "#66A2EB";

  // - 手机端（393px）: 852px
  // - iPad（744px）: 852px  
  // - 1440 设计稿: 776px
  // - 1920 设计稿: 1152px

  return (
    <section className="relative h-[780px] desktop:h-[766px] 2xl:h-[1152px] flex flex-col overflow-hidden">
      {/* 背景图 - 蓝色渐变条纹背景 - 首屏关键资源，立即加载 */}
      <div className="absolute inset-0 z-0">
        <img
          src="/newImg/header-bg.png"
          alt=""
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </div>
      
      {/* 内容区域 - 垂直居中 */}
      <div className="flex-1 w-full flex items-center justify-center relative z-10 px-4 tablet:px-6 desktop:px-12 2xl:px-16" >
        <div className="text-center w-full max-w-[1600px] mx-auto">
      
          <div 
            className="mb-2"
          >
            <MemfitWhiteText className="w-full tablet:w-[361px] desktop:w-[436px] h-auto"/>
          </div>

          <p 
            className="text-[36px] font-normal text-[#EEF3F9] mb-10 tablet:mb-12 desktop:mb-14 2xl:mb-16"
            style={{
              textShadow: '0 2px 16px rgba(0, 0, 0, 0.2)',
              lineHeight: '1.5',
            }}
          >
            {content.hero.slogan}
          </p>
          
      
          <div className="flex flex-col items-center mt-[280px] desktop:mt-[0px]  justify-center gap-4 tablet:gap-5 desktop:flex-row desktop:gap-6">
            {/* 主按钮 - 白色实心 */}
            <a
              href={downloadUrl}
              download
              className="w-full h-[46px] flex-shrink-0  desktop:w-[171px] desktop:h-[36px] flex items-center justify-center gap-2 bg-white rounded-4 hover:brightness-110 hover:shadow-[0_8px_40px_rgba(0,0,0,0.2)] hover:no-underline text-[18px]  desktop:text-[14px] transition-all"
              style={{ color: highlightColor }}
            >
              {buttonText}
              <DownloadIcon className="w-5 h-5 " />
            </a>
            {/* 次按钮 - 手机/iPad纯文字，PC有边框 */}
            <Link
              to="/downloads"
              className="w-full h-[46px] flex-shrink-0 desktop:w-[117px] desktop:h-[36px] flex items-center justify-center rounded-4 text-white hover:bg-white/10 hover:shadow-[0_8px_40px_rgba(0,0,0,0.2)] hover:no-underline hover:text-[#ffffff] text-[18px]  desktop:text-[14px] transition-all" style={{border: '1px solid #A1B9DD'}}
            >
              {content.buttons.moreVersions}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
