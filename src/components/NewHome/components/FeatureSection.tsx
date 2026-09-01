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
      className={`w-full transition-all duration-300 ease-in-out`}
      style={{
        zIndex: index + 1,
        position: isFixed ? "fixed" : "relative",
        top: isFixed ? `${fixedTop}px` : "auto",
        height: isFixed ? "calc(100vh - 56px)" : "auto",
      }}
      id={section.id}
    >
      {/* 移动/平板端布局（GEO：原移动、平板两套副本合并为单份响应式 DOM；
          桌面端规范副本由 NavigationBar 渲染，本组件桌面端不重复输出文案） */}
      <div className={`desktop:hidden relative z-10 h-auto ${theme ==='light'? " bg-[#f8f9fa]": "bg-[#171717]" }`}>
        <div className="px-4 tablet:px-6 py-10 tablet:py-12 flex flex-col">
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
              className={`text-xl font-dotgothic ${
                theme === "light" ? "text-[#4373BB]" : "text-[#66A2EB]"
              }`}
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
          <div className="flex items-center justify-center rounded-xl overflow-hidden flex-shrink-0 relative w-full py-[10px] tablet:py-[80px] px-[20px] tablet:px-[30px] tablet:h-[468px]">
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
                src={theme === "light" ? `/newImg/content-${index + 1}.png`  : `/newImg/content-black-${index + 1}.png`}
                alt={section.title}
                width={1840}
                height={[1256, 1224, 1256, 1256, 1292][index] ?? 1256}
                className="w-full h-auto"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
      {/* PC端放到navigationBar处理 */}
    </div>
  );
};
