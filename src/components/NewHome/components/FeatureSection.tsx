import { useTheme } from "../context/ThemeContext";
import { useEffect, useRef, useState } from "react";

export interface SectionData {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  features: { title: string; desc: string }[];
}

// 带四角装饰的数字框组件
const NumberBox = ({
  number,
  size = "md",
  theme,
  highlightColor,
}: {
  number: string;
  size?: "sm" | "md" | "lg";
  theme: string;
  highlightColor: string;
}) => {

  return (
    <div className="relative z-10 flex-shrink-0 overflow-visible p-1">
      {/* 数字框 */}
      <div
        className="relative z-10 flex items-center justify-center w-[46px] h-[44px]"
      >
        {/* 四角装饰 */}
        <div className="absolute -left-[2px] -top-[2px] w-2 h-2" style={{ borderLeft: `1px solid ${highlightColor}`, borderTop: `1px solid ${highlightColor}` }} />
        <div className="absolute -right-[2px] -top-[2px] w-2 h-2" style={{ borderRight: `1px solid ${highlightColor}`, borderTop: `1px solid ${highlightColor}` }} />
        <div className="absolute -left-[2px] -bottom-[2px] w-2 h-2" style={{ borderLeft: `1px solid ${highlightColor}`, borderBottom: `1px solid ${highlightColor}` }} />
        <div className="absolute -right-[2px] -bottom-[2px] w-2 h-2" style={{ borderRight: `1px solid ${highlightColor}`, borderBottom: `1px solid ${highlightColor}` }} />
        <div className={`w-[34px] h-[34px] flex items-center justify-center text-[24px]`}
          style={{ 
            fontFamily: 'DotGothic16, sans-serif',
            backgroundColor: theme === "light" ? "#F2F3F5" : "#1a1a2e",
            color: highlightColor
          }}
        >
        {number}
        </div>
        
        {/* {number} */}
      </div>
    </div>
  );
};

// 渲染技术架构的列表项（使用 :: 前缀）
const renderTechList = (desc: string, theme: string) => {
  const lines = desc.split("/n").filter((line) => line.trim());

  return (
    <ul className="mt-2 space-y-2 list-none p-0 m-0">
      {lines.map((line, i) => (
        <li
          key={i}
          className={`text-sm leading-relaxed flex items-start ${
            theme === "light" ? "text-[#868C97]" : "text-[#A6AFBF]"
          }`}
        >
          {lines.length > 1 && (
            <span
              className={`mr-2 flex-shrink-0 font-mono`}
            >
              •
            </span>
          )}
          <span>{line.trim()}</span>
        </li>
      ))}
    </ul>
  );
};


interface FeatureSectionProps {
  section: SectionData;
  index: number;
  totalSections?: number;
  isFirst?: boolean;
}

export const FeatureSection = ({ section, index, totalSections = 0, isFirst = false }: FeatureSectionProps) => {
  const { theme } = useTheme();
  const highlightColor = theme === "light" ? "#4373BB" : "#66A2EB";
  const sectionNumber = String(index + 1).padStart(2, "0");

  const sectionRef = useRef<HTMLDivElement>(null);
  const [isFixed, setIsFixed] = useState(false);
  const [fixedTop, setFixedTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // 只在桌面端（宽度大于1440px）启用折叠效果
      if (window.innerWidth < 1440) {
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
      const shouldBeFixed = containerRect.top <= headerHeight && containerRect.bottom > headerHeight;

      setIsFixed(shouldBeFixed);
      setFixedTop(headerHeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
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

  return (
    <div
      ref={sectionRef}
      className={`w-full transition-all duration-300 ease-in-out ${theme === "light" ? "bg-[#F8F9FA]" : "bg-[#0f0f1a]"}`}
      style={{
        zIndex: index + 1,
        position: isFixed ? 'fixed' : 'relative',
        top: isFixed ? `${fixedTop}px` : 'auto',
        height: isFixed ? 'calc(100vh - 56px)' : 'auto',
      }}
      id={section.id}
    >

      {/* 移动端布局 - 高度约954px */}
      <div className="tablet:hidden relative z-10 h-auto">
        <div className="px-4 py-10 flex flex-col">
          {/* 标题区 */}
          <div className="flex items-center gap-3 mb-8 overflow-visible">
            <NumberBox number={sectionNumber} size="sm" theme={theme} highlightColor={highlightColor} />
            <h3
              className={`text-xl font-bold m-0 ${
                theme === "light" ? "text-[#353639]" : "text-white"
              }`}
            >
              {section.title}{" "}
              <span style={{ color: highlightColor }}>({section.subtitle})</span>
            </h3>
          </div>

          {/* 内容块 */}
          <div className="flex flex-col gap-6 mb-8">
            {section.features.map((feature, idx) => {
              return (
                <div key={idx} className="flex flex-col gap-2">
                  <h4
                    className={`text-base font-semibold m-0 ${
                      theme === "light" ? "text-[#353639]" : "text-white"
                    }`}
                  >
                    {feature.title}
                  </h4>
                  {renderTechList(feature.desc, theme)}
                </div>
              );
            })}
          </div>

          {/* 截图卡片 */}
          <div className="flex items-center justify-center rounded-xl overflow-hidden flex-shrink-0 relative w-full py-[10px] px-[20px]">
              {/* 背景装饰图 */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url(${theme === "light" ? bgImages[index] : bgBlackImages[index] || bgBlackImages[0]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <div
                className={`w-full relative z-10 overflow-hidden`}
              >
                <img
                  src={`/newImg/content-${index + 1}.png`}
                  alt={section.title}
                  className="w-full h-auto"
                />
              </div>
            </div>
        </div>
      </div>

      {/* 平板端布局 - 高度约1062px */}
      <div className="hidden tablet:block desktop:hidden relative z-10 h-auto">
        <div className="px-6 py-12 flex flex-col max-w-[696px] mx-auto items-center">
          {/* 标题区 */}
          <div className="flex items-center gap-4 mb-10 overflow-visible">
            <NumberBox number={sectionNumber} size="md" theme={theme} highlightColor={highlightColor} />
            <h3
              className={`text-2xl font-bold m-0 ${
                theme === "light" ? "text-[#353639]" : "text-white"
              }`}
            >
              {section.title}{" "}
              <span style={{ color: highlightColor }}>({section.subtitle})</span>
            </h3>
          </div>

          {/* 内容块 */}
          <div className="flex flex-col gap-8 mb-10">
            {section.features.map((feature, idx) => {
              return (
                <div key={idx} className="flex flex-col gap-2">
                  <h4
                    className={`text-lg font-semibold m-0 ${
                      theme === "light" ? "text-[#353639]" : "text-white"
                    }`}
                  >
                    {feature.title}
                  </h4>
                  {renderTechList(feature.desc, theme)}
                </div>
              );
            })}
          </div>

          {/* 截图卡片 */}
          <div className="flex h-[468px] items-center justify-center rounded-xl overflow-hidden flex-shrink-0 relative w-full py-[80px] px-[30px]">
              {/* 背景装饰图 */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `url(${bgImages[index] || bgImages[0]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <div
                className={`w-full relative z-10 overflow-hidden`}
              >
                <img
                  src={`/newImg/content-${index + 1}.png`}
                  alt={section.title}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </div>
        </div>
      </div>

      {/* PC端布局 - 高度约880px */}
      <div className="hidden desktop:block relative z-10 h-full">
        <div className="py-20 px-12 mx-auto">
          <div className="flex justify-between items-center gap-12 2xl:gap-20 h-full">
            {/* 左侧内容 */}
            <div className="h-full flex flex-col">
              {/* 标题区 */}
              <div className="flex items-center gap-4 mb-10 overflow-visible">
                <NumberBox number={sectionNumber} size="lg" theme={theme} highlightColor={highlightColor} />
                <h3
                  className={`text-3xl m-0 ${
                    theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
                  }`}
                >
                  {section.title}{" "}
                  <span className={`font-normal text-3xl ${theme === "light" ? "text-[#9CA3B1]" : "text-[#868D9A]"}`}>({section.subtitle})</span>
                </h3>
              </div>

              {/* 内容块 */}
              <div className="flex flex-col gap-8 2xl:gap-10">
                {section.features.map((feature, idx) => {
                  return (
                    <div key={idx} className="flex flex-col gap-2">
                      <h4
                        className={`text-base 2xl:text-lg font-semibold m-0 ${
                          theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
                        }`}
                      >
                        {feature.title}
                      </h4>
                      {renderTechList(feature.desc, theme)}
                    </div>
                  );
                })}
              </div>

              {/* 左下角装饰图 */}
              <div className="my-auto">
                <img
                  src={theme === "light" ? leftImages[index] : leftBlackImages[index] || leftBlackImages[0]}
                  alt="decoration"
                  className="w-32 2xl:w-40 h-auto opacity-80"
                  loading="lazy"
                />
              </div>
            </div>

            {/* 右侧截图卡片 */}
            <div className="flex items-center justify-center rounded-xl overflow-hidden flex-shrink-0 relative w-full desktop:w-[696px] xl:w-[912px] 2xl:w-[1060px] py-[80px] px-[30px] 2xl:py-[90px] 2xl:px-[50px]" style={{ aspectRatio: '3/2' }}>
              {/* 背景装饰图 */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{  
                  backgroundImage: `url(${theme === "light" ? bgImages[index] : bgBlackImages[index] || bgBlackImages[0]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <div
                className={`w-full  relative z-10  overflow-hidden `}
              >
                <img
                  src={theme === "light" ? `/newImg/content-${index + 1}.png` : `/newImg/content-black-${index + 1}.png`}
                  alt={section.title}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
