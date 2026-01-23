import { CONTENT, type Locale } from "../locales";
import { useTheme } from "../context/ThemeContext";
import { DotIcon } from "../icons";
import { AnimatedTitle } from "./AnimatedTitle";
import { LazyBackgroundImage } from "@site/src/components/LazyImage";

interface WhatIsSectionProps {
  locale: Locale;
}

export const WhatIsSection = ({ locale }: WhatIsSectionProps) => {
  const { whatIs } = CONTENT[locale];
  const { theme } = useTheme();

  // 处理描述中的换行符
  const renderDescription = (text: string) => {
    return text.split("\n").map((line, index, array) => (
      <span key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </span>
    ));
  };

  // 卡片组件 - 带四角装饰
  const FeatureCard = ({
    title,
    variant = "default",
  }: {
    title: string;
    variant?: "default" | "alt";
  }) => (
    <div
      className={`relative inline-block w-fit px-3 py-[6px] border-l-2 border-l-[#1890FF] desktop:whitespace-nowrap ${
        variant === "default"
          ? theme === "light"
            ? "border border-[#E6E8ED] bg-[#f8f9fa]"
            : "border border-white/10 bg-[#171717]"
          : theme === "light"
            ? "border border-[#E6E8ED] bg-white"
            : "border border-white/10 bg-[#2a2b2d]"
      }`}
    >
      {/* 四角装饰 - 在卡片边框外侧 */}
      {/* 左上角 */}
      <div
        className="absolute -left-[2px] -top-[2px] w-[5px] h-[5px]"
        style={{
          borderLeft: "1px solid #868C97",
          borderTop: "1px solid #868C97",
        }}
      />
      {/* 右上角 */}
      <div
        className="absolute -right-[2px] -top-[2px] w-[5px] h-[5px]"
        style={{
          borderRight: "1px solid #868C97",
          borderTop: "1px solid #868C97",
        }}
      />
      {/* 左下角 */}
      <div
        className="absolute -left-[2px] -bottom-[2px] w-[5px] h-[5px]"
        style={{
          borderLeft: "1px solid #868C97",
          borderBottom: "1px solid #868C97",
        }}
      />
      {/* 右下角 */}
      <div
        className="absolute -right-[2px] -bottom-[2px] w-[5px] h-[5px]"
        style={{
          borderRight: "1px solid #868C97",
          borderBottom: "1px solid #868C97",
        }}
      />

      {/* 卡片内容 */}
      <span
        className={`text-sm ${
          theme === "light" ? "text-[#353639]" : "text-white"
        }`}
      >
        {title}
      </span>
    </div>
  );

  // 左侧加粗，右侧正常的分割组件，分隔符为冒号
  const WhatIsBoldSplit = ({
    text,
    theme,
  }: {
    text: string;
    theme: string;
  }) => {
    // 以第一个冒号分割
    const [left, ...rightArr] = text.split("：");
    const right = rightArr.join("：");
    return (
      <p
        className={`leading-7 mb-0 ${
          theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
        }`}
      >
        <span className="mr-2 flex-shrink-0 font-mono">•</span>
        <span className="font-bold">
          {left}
          {right ? "：" : ""}
        </span>
        {right && <span>{right.trim()}</span>}
      </p>
    );
  };

  return (
    <section
      className={`px-6 ${theme ==='light'? " bg-[#f8f9fa]": "bg-[#171717]"}`}
    >
      <div className="max-w-[1600px] mx-auto">
      {/* 移动端布局 - 高度约1063px */}
      <div className="tablet:hidden">
        <div className="py-10 flex flex-col">
          {/* 标题 */}
          <div
            className={`mb-3 text-5xl ${
              theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
            }`}
            style={{ fontFamily: "DotGothic16, sans-serif" }}
          >
            <AnimatedTitle
              title={whatIs.title}
              highlightPattern={/(memfit|Memfit|MEMFIT)/gi}
            />
          </div>

          {/* 描述 */}
          <p
            className={`text-[18px] leading-relaxed mb-5 ${
              theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
            }`}
          >
            {whatIs.description}
          </p>

          {/* 点阵 */}
          <div className="flex overflow-hidden gap-1 mb-6">
            {Array.from({ length: 40 }).map((_, i) => (
              <DotIcon key={i} className="flex-shrink-0" />
            ))}
          </div>

          {/* 文字内容 */}
          <LazyBackgroundImage
            imageUrl={
              theme === "light"
                ? "/newImg/content-bg.png"
                : "/newImg/content-bg-black.png"
            }
            className={`flex flex-col gap-4 p-4 border border-solid ${theme === 'light' ? "border-[#E6E8ED]" : "border-[#474A4F]"}`}
            style={{
              backgroundSize: "16px 16px",
              backgroundRepeat: "repeat",
            }}
            priority={true}
          >
            <div
              className={`text-[32px] ${
                theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
              }`}
              style={{ fontFamily: "DotGothic16, sans-serif" }}
            >
              {whatIs.textOne}
            </div>
            <div
              className={`text-[16px] leading-7 mb-0 ${
                theme === "light" ? "text-[#868C97]" : "text-[#A6AFBF]"
              }`}
            >
              {whatIs.textTwo}
            </div>

            <WhatIsBoldSplit text={whatIs.textThree} theme={theme} />

            <WhatIsBoldSplit text={whatIs.textFour} theme={theme} />

            <WhatIsBoldSplit text={whatIs.text5} theme={theme} />

            {/* 图片区域 */}
            <div className="flex-1 flex items-center justify-center mb-6">
              <img
                src={
                  theme === "light"
                    ? "/newImg/whatIs-content.png"
                    : "/newImg/whatIs-content-black.png"
                }
                alt="Memfit AI Overview"
                className="w-full max-w-[380px] h-auto"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* 三点说明 */}
            <div
              className={`text-[18px] ${
                theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
              }`}
            >
              {whatIs.text6}
            </div>

            <div className="flex flex-col gap-4 overflow-visible">
              <FeatureCard title={whatIs.text7} />
              <FeatureCard title={whatIs.text8} />
              <FeatureCard title={whatIs.text9} variant="alt" />
            </div>
          </LazyBackgroundImage>
        </div>
      </div>

      {/* 平板端布局 - 高度约1093px */}
      <div className="hidden tablet:block desktop:hidden">
        <div className="min-h-[1093px] py-12 flex flex-col px-6 mx-auto">
          {/* 标题 */}
          <div
            className={`mb-4 text-[48px] ${
              theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
            }`}
            style={{ fontFamily: "DotGothic16, sans-serif" }}
          >
            <AnimatedTitle
              title={whatIs.title}
              highlightPattern={/(memfit|Memfit|MEMFIT)/gi}
            />
          </div>

          {/* 描述 */}
          <p
            className={`text-[18px] leading-relaxed mb-6 ${
              theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
            }`}
          >
            {whatIs.description}
          </p>

          {/* 点阵 */}
          <div className="flex overflow-hidden gap-2 mb-8">
            {Array.from({ length: 60 }).map((_, i) => (
              <DotIcon key={i} className="flex-shrink-0" />
            ))}
          </div>

          {/* 文字内容 */}
          <LazyBackgroundImage
            imageUrl={
              theme === "light"
                ? "/newImg/content-bg.png"
                : "/newImg/content-bg-black.png"
            }
            className={`flex flex-col gap-4 p-4 border border-solid ${theme === 'light' ? "border-[#E6E8ED]" : "border-[#474A4F]"}`}
            style={{
              backgroundSize: "16px 16px",
              backgroundRepeat: "repeat",
            }}
            priority={true}
          >
            <div
              className={`text-[32px] ${
                theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
              }`}
              style={{ fontFamily: "DotGothic16, sans-serif" }}
            >
              {whatIs.textOne}
            </div>
            <div
              className={`text-[16px] leading-7 mb-5 ${
                theme === "light" ? "text-[#868C97]" : "text-[#A6AFBF]"
              }`}
            >
              {whatIs.textTwo}
            </div>

            <WhatIsBoldSplit text={whatIs.textThree} theme={theme} />

            <WhatIsBoldSplit text={whatIs.textFour} theme={theme} />

            <WhatIsBoldSplit text={whatIs.text5} theme={theme} />

            {/* 图片区域 */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={
                  theme === "light"
                    ? "/newImg/whatIs-content.png"
                    : "/newImg/whatIs-content-black.png"
                }
                alt="Memfit AI Overview"
                className="w-full h-auto"
                loading="lazy"
                decoding="async"
              />
            </div>

            {/* 三点说明 */}
            <div
              className={`text-[18px] ${
                theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
              }`}
            >
              {whatIs.text6}
            </div>

            <div className="flex flex-col gap-4 overflow-visible">
              <FeatureCard title={whatIs.text7} />
              <FeatureCard title={whatIs.text8} />
              <FeatureCard title={whatIs.text9} variant="alt" />
            </div>
          </LazyBackgroundImage>
        </div>
      </div>

      {/* PC端布局 - 高度约897px */}
      <div className="hidden desktop:block">
        <div className="min-h-[897px] py-16 2xl:py-20 flex flex-col">
          {/* 顶部区域：左侧标题，右侧描述 */}
          <div className="flex justify-between items-start mb-6">
            {/* 左上角标题 */}
            <div
              className={`flex-shrink-0 text-[48px] ${
                theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
              }`}
              style={{ fontFamily: "DotGothic16, sans-serif" }}
            >
              <AnimatedTitle
                title={whatIs.title}
                highlightPattern={/(memfit|Memfit|MEMFIT)/gi}
              />
            </div>

            {/* 右上角描述文字 */}
            <p
              className={`max-w-[528px] text-[18px] text-right ${
                theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
              }`}
            >
              {renderDescription(whatIs.description)}
            </p>
          </div>

          {/* 点阵 - 全宽 */}
          <div className="flex overflow-hidden gap-1 mb-10">
            {Array.from({ length: 200 }).map((_, i) => (
              <DotIcon key={i} className="flex-shrink-0" />
            ))}
          </div>

          {/* 主内容区：左右两栏 */}
          <LazyBackgroundImage
            imageUrl={
              theme === "light"
                ? "/newImg/content-bg.png"
                : "/newImg/content-bg-black.png"
            }
            className={`relative flex-1 grid grid-cols-[372px_1fr] xl:grid-cols-[530px_1fr] 2xl:gap-16 rounded-[4px] p-5 border border-solid ${theme === 'light' ? "border-[#E6E8ED]" : "border-[#474A4F]"}`}
            style={{
              backgroundSize: "16px 16px",
              backgroundRepeat: "repeat",
            }}
            priority={true}
          >
            {/* 左上 */}
            <div 
              className="absolute left-0 -translate-x-1/2 -top-[6px] w-[1px] h-3" 
              style={{ backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF" }} 
            />
            <div 
              className="absolute left-0 -translate-x-1/2 top-0 w-3 h-[1px]" 
              style={{ backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF" }} 
            />

            {/* 右上 */}
            <div 
              className="absolute right-0 translate-x-1/2 -top-[6px] w-[1px] h-3" 
              style={{ backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF" }} 
            />
            <div 
              className="absolute right-0 translate-x-1/2 top-0 w-3 h-[1px]" 
              style={{ backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF" }} 
            />

            {/* 左下 */}
            <div 
              className="absolute left-0 -translate-x-1/2 -bottom-[6px] w-[1px] h-3" 
              style={{ backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF" }} 
            />
            <div 
              className="absolute left-0 -translate-x-1/2 bottom-0 w-3 h-[1px]" 
              style={{ backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF" }} 
            />

            {/* 右下 */}
            <div 
              className="absolute right-0 translate-x-1/2 -bottom-[6px] w-[1px] h-3" 
              style={{ backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF" }} 
            />
            <div 
              className="absolute right-0 translate-x-1/2 bottom-0 w-3 h-[1px]" 
              style={{ backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF" }} 
            />
            
            {/* 左侧内容 */}
            <div className="flex flex-col">
              {/* 文字内容 */}
              <div
                className={`text-[32px] ${
                  theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
                }`}
                style={{ fontFamily: "DotGothic16, sans-serif" }}
              >
                {whatIs.textOne}
              </div>
              <div
                className={`text-[16px] leading-7 mb-5 ${
                  theme === "light" ? "text-[#868C97]" : "text-[#A6AFBF]"
                }`}
              >
                {whatIs.textTwo}
              </div>

              <WhatIsBoldSplit text={whatIs.textThree} theme={theme} />

              <WhatIsBoldSplit text={whatIs.textFour} theme={theme} />

              <WhatIsBoldSplit text={whatIs.text5} theme={theme} />

              {/* 两点说明 - 推到底部 */}
              <div className="mt-auto">
                <div
                  className={`text-[18px] mb-3 ${
                    theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
                  }`}
                >
                  {whatIs.text6}
                </div>

                <div className="flex flex-col gap-4 overflow-visible">
                  <FeatureCard title={whatIs.text7} />
                  <FeatureCard title={whatIs.text8} />
                  <FeatureCard title={whatIs.text9} variant="alt" />
                </div>
              </div>
            </div>

            {/* 右侧图片 */}
            <div className="flex items-center justify-center">
              <img
                src={
                  theme === "light"
                    ? "/newImg/whatIs-content.png"
                    : "/newImg/whatIs-content-black.png"
                }
                alt="Memfit AI Overview"
                className="w-full max-w-[680px] xl:max-w-[870px] h-auto"
                loading="lazy"
                decoding="async"
              />
            </div>
          </LazyBackgroundImage>
        </div>
      </div>
      </div>
    </section>
  );
};
