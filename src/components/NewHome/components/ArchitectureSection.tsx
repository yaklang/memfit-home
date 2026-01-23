import { CONTENT, type Locale } from "../locales";
import { useTheme } from "../context/ThemeContext";
import { DotIcon } from "../icons";
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
      className={`px-4 tablet:px-6 desktop:px-12`}
    >
      {/* 移动端布局 - 高度约537px */}
      <div className="tablet:hidden">
        <div className="min-h-[537px] py-10 flex flex-col">
          {/* 标题 */}
          <h2
            className={`text-[28px] mb-3 font-normal ${
              theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
            }`}
            style={{ fontFamily: "DotGothic16, sans-serif" }}
          >
            <AnimatedTitle title={architecture.title} />
          </h2>

          {/* 描述 */}
          <p
            className={`text-[18px] leading-relaxed mb-5 ${
              theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
            }`}
          >
            {architecture.description}
          </p>

          {/* 点阵 */}
          <div className="flex overflow-hidden gap-1 mb-6">
            {Array.from({ length: 40 }).map((_, i) => (
              <DotIcon key={i} className="flex-shrink-0" />
            ))}
          </div>

          {/* 架构图 */}
          <LazyBackgroundImage
            imageUrl={
              theme === "light"
                ? "/newImg/content-bg.png"
                : "/newImg/content-bg-black.png"
            }
            className={`flex-1 flex items-center justify-center px-6 py-4 border border-solid ${theme === 'light' ? "border-[#E6E8ED]" : "border-[#474A4F]"}`}
            style={{
              backgroundSize: "16px 16px",
              backgroundRepeat: "repeat",
            }}
          >
            <img
              src={
                theme === "light"
                  ? "/newImg/architecture-content.png"
                  : "/newImg/architecture-content-black.png"
              }
              alt="Architecture Diagram"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </LazyBackgroundImage>
        </div>
      </div>

      {/* 平板端布局 - 高度约683px */}
      <div className="hidden tablet:block desktop:hidden">
        <div className="py-12 flex flex-col mx-auto">
          {/* 标题 */}
          <h2
            className={`text-[32px] mb-4 font-normal ${
              theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
            }`}
            style={{ fontFamily: "DotGothic16, sans-serif" }}
          >
            <AnimatedTitle title={architecture.title} />
          </h2>

          {/* 描述 */}
          <p
            className={`text-[18px] leading-relaxed mb-6 ${
              theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
            }`}
          >
            {architecture.description}
          </p>

          {/* 点阵 */}
          <div className="flex overflow-hidden gap-2 mb-8">
            {Array.from({ length: 60 }).map((_, i) => (
              <DotIcon key={i} className="flex-shrink-0" />
            ))}
          </div>

          {/* 架构图 */}
          <LazyBackgroundImage
            imageUrl={
              theme === "light"
                ? "/newImg/content-bg.png"
                : "/newImg/content-bg-black.png"
            }
            className={`flex-1 flex items-center justify-center px-10 py-6 border border-solid ${theme === 'light' ? "border-[#E6E8ED]" : "border-[#474A4F]"}`}
            style={{
              backgroundSize: "16px 16px",
              backgroundRepeat: "repeat",
            }}
          >
            <img
              src={
                theme === "light"
                  ? "/newImg/architecture-content.png"
                  : "/newImg/architecture-content-black.png"
              }
              alt="Architecture Diagram"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </LazyBackgroundImage>
        </div>
      </div>

      {/* PC端布局 - 高度约1037px */}
      <div className="hidden desktop:block max-w-[1600px] mx-auto">
        <div className="min-h-[1037px] py-16 2xl:py-20 flex flex-col">
          {/* 顶部区域：左侧标题，右侧描述 */}
          <div className="flex justify-between items-start mb-6">
            {/* 左上角标题 */}
            <h2
              className={`text-[48px] 2xl:text-[42px] flex-shrink-0 font-normal ${
                theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
              }`}
              style={{ fontFamily: "DotGothic16, sans-serif" }}
            >
              <AnimatedTitle title={architecture.title} />
            </h2>

            {/* 右上角描述文字 */}
            <p
              className={`text-[18px] w-[528px] leading-relaxed text-right ${
                theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
              }`}
            >
              {architecture.description}
            </p>
          </div>

          {/* 点阵 - 全宽 */}
          <div className="flex overflow-hidden gap-1 mb-10">
            {Array.from({ length: 200 }).map((_, i) => (
              <DotIcon key={i} className="flex-shrink-0" />
            ))}
          </div>

          {/* 架构图 - 居中显示 */}
          <LazyBackgroundImage
            imageUrl={
              theme === "light"
                ? "/newImg/content-bg.png"
                : "/newImg/content-bg-black.png"
            }
            className={`relative flex-1 flex items-center justify-center px-16 py-10 border border-solid ${theme === 'light' ? "border-[#E6E8ED]" : "border-[#474A4F]"}`}
            style={{
              backgroundSize: "16px 16px",
              backgroundRepeat: "repeat",
            }}
          >
            {/* 左上 */}
            <div
              className="absolute left-0 -translate-x-1/2 -top-[6px] w-[1px] h-3"
              style={{
                backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF",
              }}
            />
            <div
              className="absolute left-0 -translate-x-1/2 top-0 w-3 h-[1px]"
              style={{
                backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF",
              }}
            />

            {/* 右上 */}
            <div
              className="absolute right-0 translate-x-1/2 -top-[6px] w-[1px] h-3"
              style={{
                backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF",
              }}
            />
            <div
              className="absolute right-0 translate-x-1/2 top-0 w-3 h-[1px]"
              style={{
                backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF",
              }}
            />

            {/* 左下 */}
            <div
              className="absolute left-0 -translate-x-1/2 -bottom-[6px] w-[1px] h-3"
              style={{
                backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF",
              }}
            />
            <div
              className="absolute left-0 -translate-x-1/2 bottom-0 w-3 h-[1px]"
              style={{
                backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF",
              }}
            />

            {/* 右下 */}
            <div
              className="absolute right-0 translate-x-1/2 -bottom-[6px] w-[1px] h-3"
              style={{
                backgroundColor: theme === "light" ? "#868C97" : "#A6AFBF",
              }}
            />
            <div
              className="absolute right-0 translate-x-1/2 bottom-0 w-3 h-[1px]"
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
