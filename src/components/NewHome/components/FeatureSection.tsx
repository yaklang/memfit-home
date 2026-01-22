import { useTheme } from "../context/ThemeContext";
import { useEffect, useRef, useState } from "react";
import { LazyBackgroundImage } from "@site/src/components/LazyImage";
import { SectionItem } from "../locales";
import {
  BookOpenIcon,
  BrainIcon,
  ListTodoIcon,
  RefreshIcon,
  WrenchIcon,
} from "../icons";

// 渲染技术架构的列表项（使用 :: 前缀）
const renderTechList = (desc: string, theme: string) => {
  return (
    <div
      className={`text-base ${
        theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
      }`}
    >
      <span className={`mr-2 flex-shrink-0 font-mono`}>•</span>
      {desc}
    </div>
  );
};

interface FeatureSectionProps {
  section: SectionItem;
  index: number;
  totalSections?: number;
  allSections?: SectionItem[];
}

export const FeatureSection = ({
  section,
  index,
  totalSections = 0,
  allSections = [],
}: FeatureSectionProps) => {
  const { theme } = useTheme();
  const highlightColor = theme === "light" ? "#4373BB" : "#66A2EB";
  const sectionNumber = String(index + 1).padStart(2, "0");

  const sectionRef = useRef<HTMLDivElement>(null);
  const [isFixed, setIsFixed] = useState(false);
  const [fixedTop, setFixedTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // 只在桌面端（宽度大于1440px）启用折叠效果
      if (window.innerWidth < 1024) {
        setIsFixed(false);
        return;
      }

      if (!sectionRef.current) return;

      const headerHeight = 56; // 桌面端header高度
      const sectionContainer = sectionRef.current.parentElement;

      if (!sectionContainer) return;

      const containerRect = sectionContainer.getBoundingClientRect();

      // 最后一个section不需要fixed，直接跟随滚动
      if (index === totalSections - 1) {
        setIsFixed(false);
        return;
      }

      // 其他section：只要容器顶部已经滚动到header下方，就应该fixed
      const shouldBeFixed =
        containerRect.top <= headerHeight &&
        containerRect.bottom > headerHeight;

      setIsFixed(shouldBeFixed);
      setFixedTop(headerHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [index, totalSections]);

  // 背景图片映射
  const bgImages = [
    "/newImg/bg-1.jpg", // Plan
    "/newImg/bg-2.jpg", // ReAct
    "/newImg/bg-3.jpg", // Tools
    "/newImg/bg-4.jpg", // Memory
    "/newImg/bg-5.jpg", // Knowledge
  ];

  const bgBlackImages = [
    "/newImg/bg-black-1.jpg", // Plan
    "/newImg/bg-black-2.jpg", // ReAct
    "/newImg/bg-black-3.jpg", // Tools
    "/newImg/bg-black-4.jpg", // Memory
    "/newImg/bg-black-5.jpg", // Knowledge
  ];

  // 左侧装饰图片映射
  const leftImages = [
    "/newImg/left-1.png",
    "/newImg/left-2.png",
    "/newImg/left-3.png",
    "/newImg/left-4.png",
    "/newImg/left-5.png",
  ];

  const leftBlackImages = [
    "/newImg/left-black-1.png",
    "/newImg/left-black-2.png",
    "/newImg/left-black-3.png",
    "/newImg/left-black-4.png",
    "/newImg/left-black-5.png",
  ];

  const leftIcon = [
    <ListTodoIcon />,
    <RefreshIcon />,
    <WrenchIcon />,
    <BookOpenIcon />,
    <BrainIcon />,
  ];

  return (
    <div
      ref={sectionRef}
      className={`w-full transition-all duration-300 ease-in-out ${theme === "light" ? "bg-[#F8F9FA]" : "bg-[#0f0f1a]"}`}
      style={{
        zIndex: index + 1,
        position: isFixed ? "fixed" : "relative",
        top: isFixed ? `${fixedTop}px` : "auto",
        height: isFixed ? "calc(100vh - 56px)" : "auto",
      }}
      id={section.id}
    >
      {/* 移动端布局 - 高度约954px */}
      <div className="tablet:hidden relative z-10 h-auto">
        <div className="px-4 py-10 flex flex-col">
          {/* 标题区 */}
          <div className="flex items-center gap-2 ">
            <span
              className={`flex items-end ${
                theme === "light" ? "stroke-[#4373BB]" : "stroke-[#66A2EB]"
              }`}
            >
              {leftIcon[index]}
            </span>
            <span
              className={`text-xl ${
                theme === "light" ? "text-[#4373BB]" : "text-[#66A2EB]"
              }`}
              style={{ fontFamily: "DotGothic16, sans-serif" }}
            >
              {section.title} （{section.subtitle}）
            </span>
          </div>
          <div
            className={`text-base ${theme === "light" ? "text-[#868C97]" : "text-[#A6AFBF]"}`}
          >
            {section.description}
          </div>
          {/* 内容块 */}
          <div className="flex flex-col mb-8 mt-4">
            {section.features.map((feature) => renderTechList(feature, theme))}
          </div>

          {/* 截图卡片 */}
          <div className="flex items-center justify-center rounded-xl overflow-hidden flex-shrink-0 relative w-full py-[10px] px-[20px]">
            {/* 背景装饰图 - 懒加载 */}
            <LazyBackgroundImage
              imageUrl={
                theme === "light"
                  ? bgImages[index]
                  : bgBlackImages[index] || bgBlackImages[0]
              }
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div className={`w-full relative z-10 overflow-hidden`}>
              <img
                src={`/newImg/content-${index + 1}.png`}
                alt={section.title}
                className="w-full h-auto"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 平板端布局 - 高度约1062px */}
      <div className="hidden tablet:block desktop:hidden relative z-10 h-auto">
        <div className="px-6 py-12">
          {/* 标题区 */}
          <div className="flex items-center gap-2 ">
            <span
              className={`flex items-end ${
                theme === "light" ? "stroke-[#4373BB]" : "stroke-[#66A2EB]"
              }`}
            >
              {leftIcon[index]}
            </span>
            <span
              className={`text-xl ${
                theme === "light" ? "text-[#4373BB]" : "text-[#66A2EB]"
              }`}
              style={{ fontFamily: "DotGothic16, sans-serif" }}
            >
              {section.title} （{section.subtitle}）
            </span>
          </div>
          <div
            className={`text-base ${theme === "light" ? "text-[#868C97]" : "text-[#A6AFBF]"}`}
          >
            {section.description}
          </div>
          {/* 内容块 */}
          <div className="flex flex-col mb-8 mt-4">
            {section.features.map((feature) => renderTechList(feature, theme))}
          </div>

          {/* 截图卡片 */}
          <div className="flex h-[468px] items-center justify-center rounded-xl overflow-hidden flex-shrink-0 relative w-full py-[80px] px-[30px]">
            {/* 背景装饰图 - 懒加载 */}
            <LazyBackgroundImage
              imageUrl={bgImages[index] || bgImages[0]}
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div className={`w-full relative z-10 overflow-hidden`}>
              <img
                src={`/newImg/content-${index + 1}.png`}
                alt={section.title}
                className="w-full h-auto"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>

      {/* PC端布局 - 高度约880px */}
      <div className="hidden desktop:block relative z-10 h-full max-w-[1600px] mx-auto">
        <div className="py-20 mx-auto px-6">
          <div className="flex justify-between gap-5 h-full">
            {/* 左侧内容 */}
            <div className="w-[460px] xl:h-[520px]">
              {/* 导航卡片列表 */}
              <div className="flex flex-col">
                {allSections.map((item, idx) => {
                  const isActive = index === idx;
                  return (
                    <div
                      key={item.id}
                      className={`cursor-pointer relative ${idx !== 0 ? "mt-[-1px]" : ""}`}
                      onClick={() => {
                        const targetEl = document.getElementById(item.id);
                        if (targetEl) {
                          const headerHeight = 56;
                          const top =
                            targetEl.getBoundingClientRect().top +
                            window.pageYOffset -
                            headerHeight;
                          window.scrollTo({ top, behavior: "smooth" });
                        }
                      }}
                    >
                      {/* 四个角 */}
                      <div
                        className="absolute left-0 top-0 w-2 h-2"
                        style={{
                          borderLeft: `1px solid ${isActive ? highlightColor : theme === "light" ? "#868C97" : "#A6AFBF"}`,
                          borderTop: `1px solid ${isActive ? highlightColor : theme === "light" ? "#868C97" : "#A6AFBF"}`,
                        }}
                      />
                      <div
                        className="absolute right-0 top-0 w-2 h-2"
                        style={{
                          borderRight: `1px solid ${isActive ? highlightColor : theme === "light" ? "#868C97" : "#A6AFBF"}`,
                          borderTop: `1px solid ${isActive ? highlightColor : theme === "light" ? "#868C97" : "#A6AFBF"}`,
                        }}
                      />
                      <div
                        className="absolute left-0 bottom-0 w-2 h-2"
                        style={{
                          borderLeft: `1px solid ${isActive ? highlightColor : theme === "light" ? "#868C97" : "#A6AFBF"}`,
                          borderBottom: `1px solid ${isActive ? highlightColor : theme === "light" ? "#868C97" : "#A6AFBF"}`,
                        }}
                      />
                      <div
                        className="absolute right-0 bottom-0 w-2 h-2"
                        style={{
                          borderRight: `1px solid ${isActive ? highlightColor : theme === "light" ? "#868C97" : "#A6AFBF"}`,
                          borderBottom: `1px solid ${isActive ? highlightColor : theme === "light" ? "#868C97" : "#A6AFBF"}`,
                        }}
                      />
                      {/* 卡片头部 - 始终显示 */}
                      <div className="px-4 py-4 relative">
                        {/* 标题和标签 */}
                        <div className="flex items-center gap-2 ">
                          <span
                            className={`flex items-end ${
                              isActive
                                ? theme === "light"
                                  ? "stroke-[#4373BB]"
                                  : "stroke-[#66A2EB]"
                                : theme === "light"
                                  ? "stroke-[#353639]"
                                  : "stroke-[#C8D0DD]"
                            }`}
                          >
                            {leftIcon[idx]}
                          </span>
                          <span
                            className={`text-xl ${
                              isActive
                                ? theme === "light"
                                  ? "text-[#4373BB]"
                                  : "text-[#66A2EB]"
                                : theme === "light"
                                  ? "text-[#353639]"
                                  : "text-[#C8D0DD]"
                            }`}
                            style={{ fontFamily: "DotGothic16, sans-serif" }}
                          >
                            {item.title} （{item.subtitle}）
                          </span>
                        </div>
                        <div
                          className={`text-base mt-2 ${theme === "light" ? "text-[#868C97]" : "text-[#A6AFBF]"}`}
                        >
                          {item.description}
                        </div>
                        {/* 左侧装饰图 */}
                        {isActive ? (
                          <img
                            src={
                              theme === "light"
                                ? leftImages[idx]
                                : leftBlackImages[idx]
                            }
                            alt={item.title}
                            className="object-contain w-[150px] absolute top-[-75px] right-0"
                          />
                        ) : null}
                      </div>
                      {/* 展开的详情 */}
                      {isActive ? (
                        <div className="px-4 pb-5">
                          {item.features.map((feature) =>
                            renderTechList(feature, theme),
                          )}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 右侧截图卡片 */}
            <div className="flex items-center overflow-hidden justify-center flex-1 rounded-md relative xl:h-[720px] h-[468px]">
              {/* 背景装饰图 - 懒加载 */}
              <LazyBackgroundImage
                imageUrl={
                  theme === "light"
                    ? bgImages[index]
                    : bgBlackImages[index] || bgBlackImages[0]
                }
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <img
                src={
                  theme === "light"
                    ? `/newImg/content-${index + 1}.png`
                    : `/newImg/content-black-${index + 1}.png`
                }
                alt={section.title}
                className="2xl:h-[540px] h-auto z-10"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
