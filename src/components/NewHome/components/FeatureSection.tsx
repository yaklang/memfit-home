import { useTheme } from "../context/ThemeContext";

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
}: {
  number: string;
  size?: "sm" | "md" | "lg";
  theme: string;
}) => {

  return (
    <div className="relative z-10 flex-shrink-0 overflow-visible p-1">
      {/* 数字框 */}
      <div
        className="relative z-10 flex items-center justify-center font-mono w-[46px] h-[44px]"
      >
        {/* 四角装饰 */}
        <div className="absolute -left-[2px] -top-[2px] w-3 h-3" style={{ borderLeft: '2px solid #4373bb', borderTop: '2px solid #4373bb' }} />
        <div className="absolute -right-[2px] -top-[2px] w-3 h-3" style={{ borderRight: '2px solid #4373bb', borderTop: '2px solid #4373bb' }} />
        <div className="absolute -left-[2px] -bottom-[2px] w-3 h-3" style={{ borderLeft: '2px solid #4373bb', borderBottom: '2px solid #4373bb' }} />
        <div className="absolute -right-[2px] -bottom-[2px] w-3 h-3" style={{ borderRight: '2px solid #4373bb', borderBottom: '2px solid #4373bb' }} />
        <div className={`w-[34px] h-[34px] flex items-center justify-center ${
          theme === "light"
            ? "bg-[#F2F3F5] text-[#4373bb]"
            : "bg-[#1a1a2e] text-[#6fa8dc]"
        }`}>
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
          className={`text-sm tablet:text-[15px] leading-relaxed flex items-start ${
            theme === "light" ? "text-[#868C97]" : "text-[#A6AFBF]"
          }`}
        >
          <span
            className={`mr-2 flex-shrink-0 font-mono ${
              theme === "light" ? "text-[#868C97]" : "text-[#A6AFBF]"
            }`}
          >
            •
          </span>
          <span>{line.trim()}</span>
        </li>
      ))}
    </ul>
  );
};

// 渲染普通描述（带加粗支持）
const renderDescription = (desc: string, theme: string) => {
  // 支持 **text** 格式的加粗
  const parts = desc.split(/(\*\*[^*]+\*\*)/g);

  return (
    <p
      className={`text-sm tablet:text-[15px] leading-relaxed m-0 ${
        theme === "light" ? "text-[#414245]" : "text-[#A6AFBF]"
      }`}
    >
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <span key={i} className="font-semibold">
              {part.slice(2, -2)}
            </span>
          );
        }
        return part;
      })}
    </p>
  );
};

interface FeatureSectionProps {
  section: SectionData;
  index: number;
}

export const FeatureSection = ({ section, index }: FeatureSectionProps) => {
  const { theme } = useTheme();
  const sectionNumber = String(index + 1).padStart(2, "0");

  // 背景图片映射
  const bgImages = [
    "/newImg/bg-1.png", // Plan
    "/newImg/bg-2.png", // ReAct
    "/newImg/bg-3.png", // Tools
    "/newImg/bg-4.png", // Memory
    "/newImg/bg-5.png", // Knowledge
  ];

  const bgBlackImages = [
    "/newImg/bg-black-1.png", // Plan
    "/newImg/bg-black-2.png", // ReAct
    "/newImg/bg-black-3.png", // Tools
    "/newImg/bg-black-4.png", // Memory
    "/newImg/bg-black-5.png", // Knowledge
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
    <section
      id={section.id}
      className={` overflow-hidden ${
        theme === "light" ? "bg-[#F8F9FA]" : "bg-[#0f0f1a]"
      }`}
    >

      {/* 移动端布局 - 高度约954px */}
      <div className="tablet:hidden relative z-10">
        <div className="min-h-[754px] px-4 py-10 flex flex-col">
          {/* 标题区 */}
          <div className="flex items-center gap-3 mb-8 overflow-visible">
            <NumberBox number={sectionNumber} size="sm" theme={theme} />
            <h3
              className={`text-xl font-bold m-0 ${
                theme === "light" ? "text-[#353639]" : "text-white"
              }`}
            >
              {section.title}{" "}
              <span className="text-[#4373bb]">({section.subtitle})</span>
            </h3>
          </div>

          {/* 内容块 */}
          <div className="flex flex-col gap-6 mb-8">
            {section.features.map((feature, idx) => {
              console.log(feature.desc,'feature.desc');
              const isTechArchitecture = ["技术架构","Technical Architecture"].includes(feature.title) || section.id === 'tools';
              return (
                <div key={idx} className="flex flex-col gap-2">
                  <h4
                    className={`text-base font-semibold m-0 ${
                      theme === "light" ? "text-[#353639]" : "text-white"
                    }`}
                  >
                    {feature.title}
                  </h4>
                  {isTechArchitecture
                    ? renderTechList(feature.desc, theme)
                    : renderDescription(feature.desc, theme)}
                </div>
              );
            })}
          </div>

          {/* 截图卡片 */}
          <div className="flex h-[268px] items-center justify-center rounded-xl overflow-hidden flex-shrink-0 relative w-full py-[10px] px-[20px]">
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
                className={`w-full  relative z-10 rounded-2xl overflow-hidden shadow-2xl `}
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
      <div className="hidden tablet:block desktop:hidden relative z-10">
        <div className="min-h-[1062px] px-6 py-12 flex flex-col max-w-[696px] mx-auto items-center">
          {/* 标题区 */}
          <div className="flex items-center gap-4 mb-10 overflow-visible">
            <NumberBox number={sectionNumber} size="md" theme={theme} />
            <h3
              className={`text-2xl font-bold m-0 ${
                theme === "light" ? "text-[#353639]" : "text-white"
              }`}
            >
              {section.title}{" "}
              <span className="text-[#4373bb]">({section.subtitle})</span>
            </h3>
          </div>

          {/* 内容块 */}
          <div className="flex flex-col gap-8 mb-10">
            {section.features.map((feature, idx) => {
              const isTechArchitecture = ["技术架构","Technical Architecture"].includes(feature.title) || section.id === 'tools';
              return (
                <div key={idx} className="flex flex-col gap-2">
                  <h4
                    className={`text-lg font-semibold m-0 ${
                      theme === "light" ? "text-[#353639]" : "text-white"
                    }`}
                  >
                    {feature.title}
                  </h4>
                  {isTechArchitecture
                    ? renderTechList(feature.desc, theme)
                    : renderDescription(feature.desc, theme)}
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
                className={`w-full  relative z-10 rounded-2xl overflow-hidden shadow-2xl `}
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

      {/* PC端布局 - 高度约880px */}
      <div className="hidden desktop:block relative z-10">
        <div className="h-[880px] px-12 py-20 2xl:max-w-[1600px] mx-auto">
          <div className="flex justify-between items-center gap-12 2xl:gap-20 h-full">
            {/* 左侧内容 */}
            <div className="h-full flex flex-col">
              {/* 标题区 */}
              <div className="flex items-center gap-4 mb-10 overflow-visible">
                <NumberBox number={sectionNumber} size="lg" theme={theme} />
                <h3
                  className={`text-2xl 2xl:text-3xl font-bold m-0 ${
                    theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
                  }`}
                >
                  {section.title}{" "}
                  <span className={`${theme === "light" ? "text-[#9CA3B1]" : "text-[#868D9A]"}`}>({section.subtitle})</span>
                </h3>
              </div>

              {/* 内容块 */}
              <div className="flex flex-col gap-8 2xl:gap-10">
                {section.features.map((feature, idx) => {
                  const isTechArchitecture = ["技术架构","Technical Architecture"].includes(feature.title) || section.id === 'tools';
                  return (
                    <div key={idx} className="flex flex-col gap-2">
                      <h4
                        className={`text-base 2xl:text-lg font-semibold m-0 ${
                          theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
                        }`}
                      >
                        {feature.title}
                      </h4>
                      {isTechArchitecture
                        ? renderTechList(feature.desc, theme)
                        : renderDescription(feature.desc, theme)}
                    </div>
                  );
                })}
              </div>

              {/* 左下角装饰图 */}
              <div className="mt-auto pt-8">
                <img
                  src={theme === "light" ? leftImages[index] : leftBlackImages[index] || leftBlackImages[0]}
                  alt="decoration"
                  className="w-32 2xl:w-40 h-auto opacity-80"
                />
              </div>
            </div>

            {/* 右侧截图卡片 */}
            <div className="flex h-full items-center justify-center rounded-xl overflow-hidden flex-shrink-0 relative w-full xl:w-[912px] 2xl:w-[1060px] py-[80px] px-[30px] 2xl:py-[90px] 2xl:px-[50px]">
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
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
