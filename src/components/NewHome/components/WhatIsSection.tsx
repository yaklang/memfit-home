import { CONTENT, type Locale } from "../locales";
import { useTheme } from "../context/ThemeContext";
import { DotIcon } from "../icons";
import { AnimatedTitle } from "./AnimatedTitle";

interface WhatIsSectionProps {
  locale: Locale;
}

export const WhatIsSection = ({ locale }: WhatIsSectionProps) => {
  const { whatIs } = CONTENT[locale];
  const { theme } = useTheme();

  // 处理描述中的换行符
  const renderDescription = (text: string) => {
    return text.split('\n').map((line, index, array) => (
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));
  };

  // 卡片组件 - 带四角装饰
  const FeatureCard = ({ 
    title, 
    description, 
    variant = "default" 
  }: { 
    title: string; 
    description: string; 
    variant?: "default" | "alt";
  }) => (
    <div className={`relative inline-block w-fit px-3 py-3 border-l-2 border-l-[#1890FF] whitespace-nowrap ${
      variant === "default"
        ? theme === "light" 
          ? "bg-[#F8F9FA] border border-[#E6E8ED]" 
          : "bg-[#0f1724] border border-white/10"
        : theme === "light" 
          ? "bg-white border border-[#E6E8ED]" 
          : "bg-[#071022] border border-white/10"
    }`}>
      {/* 四角装饰 - 在卡片边框外侧 */}
      {/* 左上角 */}
      <div className="absolute -left-[2px] -top-[2px] w-[10px] h-[10px]" style={{ borderLeft: '2px solid #868C97', borderTop: '2px solid #868C97' }} />
      {/* 右上角 */}
      <div className="absolute -right-[2px] -top-[2px] w-[10px] h-[10px]" style={{ borderRight: '2px solid #868C97', borderTop: '2px solid #868C97' }} />
      {/* 左下角 */}
      <div className="absolute -left-[2px] -bottom-[2px] w-[10px] h-[10px]" style={{ borderLeft: '2px solid #868C97', borderBottom: '2px solid #868C97' }} />
      {/* 右下角 */}
      <div className="absolute -right-[2px] -bottom-[2px] w-[10px] h-[10px]" style={{ borderRight: '2px solid #868C97', borderBottom: '2px solid #868C97' }} />
      
      {/* 卡片内容 */}
      <span className={`text-sm tablet:text-[15px] desktop:text-sm 2xl:text-[15px] ${
        theme === "light" ? "text-[#353639]" : "text-white"
      }`}>
        <span className="font-semibold">{title}</span>
        <span className={theme === "light" ? "text-[#4b5563]" : "text-white/60"}>
          {description}
        </span>
      </span>
    </div>
  );

  return (
    <section
      className={`px-4 tablet:px-6 desktop:px-12 2xl:px-16 ${
        theme === "light" ? "bg-white" : "bg-[#0f0f1a]"
      }`}
    >
      {/* 移动端布局 - 高度约1063px */}
      <div className="tablet:hidden">
        <div className="h-[1043px] py-10 flex flex-col">
          {/* 标题 */}
          <div className={`mb-3 text-[28px] ${
            theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
          }`} style={{ fontFamily: 'DotGothic16, sans-serif' }}>
            <AnimatedTitle title={whatIs.title} highlightPattern={/(memfit|Memfit|MEMFIT)/gi} />
          </div>
          
          {/* 描述 */}
          <p className={`text-[18px] leading-relaxed mb-5 ${
            theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
          }`}>
            {whatIs.description}
          </p>

          {/* 点阵 */}
          <div className="flex overflow-hidden gap-1 mb-6">
            {Array.from({ length: 40 }).map((_, i) => (
              <DotIcon key={i} className="flex-shrink-0"/>
            ))}
          </div>

          {/* 文字内容 */}
          <div className="flex flex-col gap-4 p-4" style={{
              backgroundImage: theme === 'light' ? 'url(/newImg/content-bg.png)' : 'url(/newImg/content-bg-black.png)',
              backgroundSize: '24px 24px',
              backgroundRepeat: 'repeat'
            }}>
          <p className={`text-[16px] leading-6 mb-2 ${
            theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
          }`}>
            {whatIs.textOne}
            <span className="font-semibold">
              {whatIs.textTwo}
            </span>
            {whatIs.textThree}
          </p>

          <p className={`text-[16px] leading-6 mb-4 ${
            theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
          }`}>
            {whatIs.textFour}
          </p>

          {/* 图片区域 */}
          <div className="flex-1 flex items-center justify-center mb-6">
            <img
              src={theme === 'light' ? '/newImg/whatIs-content.png' : '/newImg/whatIs-content-black.png'}
              alt="Memfit AI Overview"
              className="w-full max-w-[380px] h-auto"
            />
          </div>

          {/* 两点说明 */}
          <div className={`text-[14px] mb-3 ${
            theme === "light" ? "text-[#9CA3B1]" : "text-[#868D9A]"
          }`}>
            {whatIs.text5}
          </div>

          <div className="flex flex-col gap-4 overflow-visible">
            <FeatureCard 
              title={whatIs.text6} 
              description={whatIs.text7} 
              variant="default"
            />
            <FeatureCard 
              title={whatIs.text8} 
              description={whatIs.text9} 
              variant="alt"
            />
          </div>
          </div>
        </div>
      </div>

      {/* 平板端布局 - 高度约1093px */}
      <div className="hidden tablet:block desktop:hidden">
        <div className="min-h-[1093px] py-12 flex flex-col max-w-[600px] mx-auto">
          {/* 标题 */}
          <div className={`mb-4 text-[32px] ${
            theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
          }`} style={{ fontFamily: 'DotGothic16, sans-serif' }}>
            <AnimatedTitle title={whatIs.title} highlightPattern={/(memfit|Memfit|MEMFIT)/gi} />
          </div>
          
          {/* 描述 */}
          <p className={`text-[18px] leading-relaxed mb-6 ${
            theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
          }`}>
            {whatIs.description}
          </p>

          {/* 点阵 */}
          <div className="flex overflow-hidden gap-1 mb-8">
            {Array.from({ length: 60 }).map((_, i) => (
              <DotIcon key={i} className="flex-shrink-0"/>
            ))}
          </div>

          {/* 文字内容 */}
          <div className="flex flex-col gap-4 p-4" style={{
              backgroundImage: theme === 'light' ? 'url(/newImg/content-bg.png)' : 'url(/newImg/content-bg-black.png)',
              backgroundSize: '24px 24px',
              backgroundRepeat: 'repeat'
            }}>
          <p className={`text-[16px] leading-7 mb-5 ${
            theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
          }`}>
            {whatIs.textOne}
            <span className="font-semibold">
              {whatIs.textTwo}
            </span>
            {whatIs.textThree}
          </p>

          <p className={`text-[16px] leading-7 mb-8 ${
            theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
          }`}>
            {whatIs.textFour}
          </p>

          {/* 图片区域 */}
          <div className="flex-1 flex items-center justify-center mb-8">
            <img
              src={theme === 'light' ? '/newImg/whatIs-content.png' : '/newImg/whatIs-content-black.png'}
              alt="Memfit AI Overview"
              className="w-full max-w-[520px] h-auto"
            />
          </div>

          {/* 两点说明 */}
          <div className={`text-[14px] mb-4 ${
            theme === "light" ? "text-[#9CA3B1]" : "text-[#868D9A]"
          }`}>
            {whatIs.text5}
          </div>

          <div className="flex flex-col gap-4 overflow-visible">
            <FeatureCard 
              title={whatIs.text6} 
              description={whatIs.text7} 
              variant="default"
            />
            <FeatureCard 
              title={whatIs.text8} 
              description={whatIs.text9} 
              variant="alt"
            />
          </div>
          </div>
        </div>
      </div>

      {/* PC端布局 - 高度约897px */}
      <div className="hidden desktop:block">
        <div className="min-h-[897px] py-16 2xl:py-20 max-w-[1400px] 2xl:max-w-[1600px] mx-auto flex flex-col">
          {/* 顶部区域：左侧标题，右侧描述 */}
          <div className="flex justify-between items-start mb-6">
            {/* 左上角标题 */}
            <div className={`flex-shrink-0 text-[36px] 2xl:text-[48px] ${
              theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
            }`} style={{ fontFamily: 'DotGothic16, sans-serif' }}>
              <AnimatedTitle title={whatIs.title} highlightPattern={/(memfit|Memfit|MEMFIT)/gi} />
            </div>
            
            {/* 右上角描述文字 */}
            <p className={`text-[18px] leading-relaxed text-right pl-28 ${
              theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
            }`}>
              {renderDescription(whatIs.description)}
            </p>
          </div>

          {/* 点阵 - 全宽 */}
          <div className="flex overflow-hidden gap-1 mb-10">
            {Array.from({ length: 200 }).map((_, i) => (
              <DotIcon key={i} className="flex-shrink-0"/>
            ))}
          </div>

          {/* 主内容区：左右两栏 */}
          <div 
            className="flex-1 grid grid-cols-[360px_1fr] 2xl:grid-cols-[420px_1fr] gap-10 2xl:gap-16 rounded-[4px] p-4"
            style={{
              backgroundImage: theme === 'light' ? 'url(/newImg/content-bg.png)' : 'url(/newImg/content-bg-black.png)',
              backgroundSize: '24px 24px',
              backgroundRepeat: 'repeat'
            }}
          >
            {/* 左侧内容 */}
            <div className="flex flex-col">
              {/* 文字内容 */}
              <p className={`text-[16px] leading-7 mb-5 ${
                theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
              }`}>
                {whatIs.textOne}
                <span className="font-semibold">
                  {whatIs.textTwo}
                </span>
                {whatIs.textThree}
              </p>

              <p className={`text-[16px] leading-7 ${
                theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
              }`}>
                {whatIs.textFour}
              </p>

              {/* 两点说明 - 推到底部 */}
              <div className="mt-auto">
                <div className={`text-[14px] mb-4 ${
                  theme === "light" ? "text-[#9CA3B1]" : "text-[#868D9A]"
                }`}>
                  {whatIs.text5}
                </div>

                <div className="flex flex-col gap-4 overflow-visible">
                  <FeatureCard 
                    title={whatIs.text6} 
                    description={whatIs.text7} 
                    variant="default"
                  />
                  <FeatureCard 
                    title={whatIs.text8} 
                    description={whatIs.text9} 
                    variant="alt"
                  />
                </div>
              </div>
            </div>

            {/* 右侧图片 */}
            <div className="flex items-center justify-center">
              <img
                src={theme === 'light' ? '/newImg/whatIs-content.png' : '/newImg/whatIs-content-black.png'}  
                alt="Memfit AI Overview"
                className="w-full max-w-[680px] 2xl:max-w-[870px] h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
