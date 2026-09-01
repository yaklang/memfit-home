import { CONTENT, type Locale } from "../locales";
import { useTheme } from "../context/ThemeContext";
import { DotStrip } from "../icons";
import { AnimatedTitle } from "./AnimatedTitle";
import { LazyBackgroundImage } from "@site/src/components/LazyImage";

interface WhatIsSectionProps {
  locale: Locale;
}

export const WhatIsSection = ({ locale }: WhatIsSectionProps) => {
  const { whatIs } = CONTENT[locale];
  const { theme } = useTheme();

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
      {/* GEO：单一响应式副本——桌面/移动共用一份 DOM（布局差异全部由断点类表达），
          避免同一文案在 HTML 中被 AI 爬虫提取两遍 */}
      <div className="py-10 tablet:py-12 tablet:px-6 tablet:mx-auto desktop:px-0 desktop:mx-0 desktop:py-16 2xl:py-20 flex flex-col desktop:min-h-[897px]">
        {/* 顶部区域：移动端上下排布，桌面端左侧标题 + 右侧描述 */}
        <div className="flex flex-col desktop:flex-row desktop:justify-between desktop:items-start desktop:mb-6">
          {/* 标题 */}
          <div
            className={`mb-3 tablet:mb-4 desktop:mb-0 text-5xl tablet:text-[48px] desktop:text-[48px] font-dotgothic ${
              theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
            }`}
          >
            <AnimatedTitle
              title={whatIs.title}
              highlightPattern={/(memfit|Memfit|MEMFIT)/gi}
            />
          </div>

          {/* 描述 */}
          <p
            className={`text-[18px] leading-relaxed mb-5 tablet:mb-6 desktop:mb-0 desktop:max-w-[528px] desktop:text-right ${
              theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
            } font-dotgothic`}
          >
            {whatIs.description}
          </p>
        </div>

        {/* 点阵 */}
        <DotStrip gap={1} className="mb-6 tablet:mb-8 desktop:mb-10" />

        {/* 主内容区：移动端纵向单列（文字 → 图 → 说明），桌面端两栏网格（左文字右图） */}
        <LazyBackgroundImage
          imageUrl={
            theme === "light"
              ? "/newImg/content-bg.png"
              : "/newImg/content-bg-black.png"
          }
          className={`relative flex flex-col gap-4 p-4 desktop:flex-1 desktop:grid desktop:grid-cols-[372px_1fr] desktop:grid-rows-[auto_1fr] desktop:gap-0 xl:grid-cols-[530px_1fr] 2xl:gap-16 desktop:rounded-[4px] desktop:p-5 border border-solid ${theme === 'light' ? "border-[#E6E8ED]" : "border-[#474A4F]"}`}
          style={{
            backgroundSize: "16px 16px",
            backgroundRepeat: "repeat",
          }}
          priority={true}
        >
          {/* 桌面端四角刻度装饰（纯装饰、无文本，移动端隐藏） */}
          <div
            className="hidden desktop:block absolute left-0 -translate-x-1/2 -top-[6px] w-[1px] h-3"
            style={{ backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF" }}
          />
          <div
            className="hidden desktop:block absolute left-0 -translate-x-1/2 top-0 w-3 h-[1px]"
            style={{ backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF" }}
          />
          <div
            className="hidden desktop:block absolute right-0 translate-x-1/2 -top-[6px] w-[1px] h-3"
            style={{ backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF" }}
          />
          <div
            className="hidden desktop:block absolute right-0 translate-x-1/2 top-0 w-3 h-[1px]"
            style={{ backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF" }}
          />
          <div
            className="hidden desktop:block absolute left-0 -translate-x-1/2 -bottom-[6px] w-[1px] h-3"
            style={{ backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF" }}
          />
          <div
            className="hidden desktop:block absolute left-0 -translate-x-1/2 bottom-0 w-3 h-[1px]"
            style={{ backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF" }}
          />
          <div
            className="hidden desktop:block absolute right-0 translate-x-1/2 -bottom-[6px] w-[1px] h-3"
            style={{ backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF" }}
          />
          <div
            className="hidden desktop:block absolute right-0 translate-x-1/2 bottom-0 w-3 h-[1px]"
            style={{ backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF" }}
          />

          {/* 文字主体：桌面端左列第一行 */}
          <div className="flex flex-col gap-4 desktop:col-start-1 desktop:row-start-1 desktop:gap-0">
            <div
              className={`text-[32px] ${
                theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
              } font-dotgothic`}
            >
              {whatIs.textOne}
            </div>
            <div
              className={`text-[16px] leading-7 mb-0 tablet:mb-5 desktop:mb-5 ${
                theme === "light" ? "text-[#868C97]" : "text-[#A6AFBF]"
              }`}
            >
              {whatIs.textTwo}
            </div>

            <WhatIsBoldSplit text={whatIs.textThree} theme={theme} />

            <WhatIsBoldSplit text={whatIs.textFour} theme={theme} />

            <WhatIsBoldSplit text={whatIs.text5} theme={theme} />
          </div>

          {/* 图片区域：移动端位于文字与说明之间，桌面端右列跨两行 */}
          <div className="flex-1 flex items-center justify-center mb-6 tablet:mb-0 desktop:col-start-2 desktop:row-start-1 desktop:row-span-2">
            <img
              src={
                theme === "light"
                  ? "/newImg/whatIs-content.png"
                  : "/newImg/whatIs-content-black.png"
              }
              alt="Memfit AI Overview"
              width={1796}
              height={1280}
              className="w-full max-w-[380px] tablet:max-w-none desktop:max-w-[680px] xl:max-w-[870px] h-auto"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* 底部说明与卡片：桌面端左列第二行贴底 */}
          <div className="flex flex-col gap-4 desktop:col-start-1 desktop:row-start-2 desktop:self-end">
            <div
              className={`text-[18px] desktop:mb-3 ${
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
        </LazyBackgroundImage>
      </div>
      </div>
    </section>
  );
};
