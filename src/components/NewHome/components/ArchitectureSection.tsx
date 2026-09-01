import { CONTENT, type Locale } from "../locales";
import { useTheme } from "../context/ThemeContext";
import { DotStrip } from "../icons";
import { AnimatedTitle } from "./AnimatedTitle";
import { LazyBackgroundImage } from "@site/src/components/LazyImage";

interface ArchitectureSectionProps {
  locale: Locale;
}

export const ArchitectureSection = ({ locale }: ArchitectureSectionProps) => {
  const { architecture } = CONTENT[locale];
  const { theme } = useTheme();

  return (
    <section
      className={`px-4 tablet:px-6 ${theme ==='light'? " bg-[#f8f9fa]": "bg-[#171717]"}`}
    >
      {/* GEO：单一响应式副本——桌面/移动共用一份 DOM（布局差异全部由断点类表达），
          避免同一文案在 HTML 中被 AI 爬虫提取两遍 */}
      <div className="max-w-[1600px] mx-auto">
        <div className="py-10 tablet:py-12 desktop:py-16 2xl:py-20 flex flex-col desktop:min-h-[1037px]">
          {/* 顶部区域：移动端上下排布，桌面端左侧标题 + 右侧描述 */}
          <div className="flex flex-col desktop:flex-row desktop:justify-between desktop:items-start desktop:mb-6">
            {/* 标题 */}
            <h2
              className={`text-[32px] tablet:text-[48px] desktop:text-[48px] 2xl:text-[42px] flex-shrink-0 mb-3 tablet:mb-4 desktop:mb-0 font-normal font-dotgothic ${
                theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
              }`}
            >
              <AnimatedTitle title={architecture.title} />
            </h2>

            {/* 描述 */}
            <p
              className={`text-[18px] leading-relaxed mb-5 tablet:mb-6 desktop:mb-0 desktop:w-[528px] desktop:text-right ${
                theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
              }`}
            >
              {architecture.description}
            </p>
          </div>

          {/* 点阵 */}
          <DotStrip gap={1} className="mb-6 tablet:mb-8 desktop:mb-10" />

          {/* 架构图 */}
          <LazyBackgroundImage
            imageUrl={
              theme === "light"
                ? "/newImg/content-bg.png"
                : "/newImg/content-bg-black.png"
            }
            className={`relative flex-1 flex items-center justify-center px-6 tablet:px-10 py-4 tablet:py-6 desktop:px-32 desktop:py-10 border border-solid ${theme === 'light' ? "border-[#E6E8ED]" : "border-[#474A4F]"}`}
            style={{
              backgroundSize: "16px 16px",
              backgroundRepeat: "repeat",
            }}
          >
            {/* 桌面端四角刻度装饰（纯装饰、无文本，移动端隐藏） */}
            <div
              className="hidden desktop:block absolute left-0 -translate-x-1/2 -top-[6px] w-[1px] h-3"
              style={{
                backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF",
              }}
            />
            <div
              className="hidden desktop:block absolute left-0 -translate-x-1/2 top-0 w-3 h-[1px]"
              style={{
                backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF",
              }}
            />
            <div
              className="hidden desktop:block absolute right-0 translate-x-1/2 -top-[6px] w-[1px] h-3"
              style={{
                backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF",
              }}
            />
            <div
              className="hidden desktop:block absolute right-0 translate-x-1/2 top-0 w-3 h-[1px]"
              style={{
                backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF",
              }}
            />
            <div
              className="hidden desktop:block absolute left-0 -translate-x-1/2 -bottom-[6px] w-[1px] h-3"
              style={{
                backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF",
              }}
            />
            <div
              className="hidden desktop:block absolute left-0 -translate-x-1/2 bottom-0 w-3 h-[1px]"
              style={{
                backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF",
              }}
            />
            <div
              className="hidden desktop:block absolute right-0 translate-x-1/2 -bottom-[6px] w-[1px] h-3"
              style={{
                backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF",
              }}
            />
            <div
              className="hidden desktop:block absolute right-0 translate-x-1/2 bottom-0 w-3 h-[1px]"
              style={{
                backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF",
              }}
            />
            <img
              src={
                theme === "light"
                  ? "/newImg/architecture-content.png"
                  : "/newImg/architecture-content-black.png"
              }
              alt="Architecture Diagram"
              width={2546}
              height={1441}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </LazyBackgroundImage>
        </div>
      </div>
    </section>
  );
};
