import { CONTENT, type Locale } from "../locales";
import { useTheme } from "../context/ThemeContext";
import { ThumbUpIcon, EmojiSadIcon } from "../icons";
import { AnimatedTitle } from "./AnimatedTitle";

interface ProblemSectionProps {
  locale: Locale;
}

export const ProblemSection = ({ locale }: ProblemSectionProps) => {
  const { problem, comparisonData } = CONTENT[locale];
  const { theme } = useTheme();

  // 获取高亮颜色
  const highlightColor = theme === "light" ? "#4373BB" : "#66A2EB";

  return (
    <section
      className={`px-4 tablet:px-6 desktop:px-6 ${theme ==='light'? " bg-[#f8f9fa]": "bg-[#171717]"}`}
    >
      <div className="py-10 tablet:py-12 desktop:py-16 2xl:py-20 flex flex-col max-w-[1600px] mx-auto">
        {/* 标题 - 居中 */}
        <div
          className={`text-[32px] tablet:text-[48px] flex justify-center items-center mb-1 font-dotgothic ${theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"}`}
        >
          <AnimatedTitle
            title={problem.title}
            highlightPattern={/vs/gi}
            highlightColor={highlightColor}
          />
        </div>

        {/* 副标题 */}
        <p
          className={`text-center text-lg mb-6 tablet:mb-8 desktop:mb-10 font-dotgothic ${
            theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
          }`}
        >
          {problem.description}
        </p>

        {/* 对比表格 */}
        <div className="w-full">
          {/* 表头 */}
          <div
            className={`grid grid-cols-[72px_1fr_1fr] tablet:grid-cols-[120px_1fr_1fr] desktop:grid-cols-[192px_1fr_1fr] border-0 border-b border-t border-solid ${
              theme === "light" ? "border-[#C0C6D1]" : "border-[#5F636B]"
            }`}
          >
            <div
              className={`p-3 desktop:px-6 text-2xl tablet:text-[32px] flex items-center font-dotgothic ${
                theme === "light" ? "text-[#868C97]" : "text-[#A6AFBF]"
              }`}
            >
              {problem.dimensionLabel}
            </div>
            <div
              className={`p-3 desktop:px-6 text-xs tablet:text-sm desktop:text-base border-l border-r border-0 border-solid ${
                theme === "light"
                  ? "bg-[#e6ecf6] text-[#1976D2] border-[#C0C6D1]"
                  : "bg-[#253241] text-[#42A5F5] border-[#5F636B]"
              }`}
            >
              <div
                className={`text-2xl desktop:text-[32px] desktop:flex items-center ${theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"}`}
              >
                <div
                  className={`text-2xl desktop:text-[32px] mr-2 font-dotgothic ${theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"}`}
                >
                  {problem.memfitLabel}
                </div>
                <div
                  className={`text-[12px] px-2 py-0.5 rounded-12 inline-flex items-center ${
                    theme === "light"
                      ? "bg-[#4373BB] text-[#EEF3F9]"
                      : "bg-[#66A2EB] text-[#DFEBFB]"
                  }`}
                >
                  <ThumbUpIcon className="mr-1" stroke={theme === "light" ? "#EEF3F9": "#DFEBFB"} />
                  {problem.memfitTag}
                </div>
              </div>
              <div
                className={`text-[16px] ${theme === "light" ? "text-[#868C97]" : "text-[#A6AFBF]"}`}
              >
                {problem.memfitSubtitle}
              </div>
            </div>
            <div
              className={`p-3 desktop:px-6 ${
                theme === "light"
                  ? "text-[#5A5D64]"
                  : "text-[#A6AFBF]"
              }`}
            >
              <div
                className={`text-2xl desktop:text-[32px] desktop:flex items-center ${theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"}`}
              >
                <div
                  className={`text-2xl desktop:text-[32px] mr-2 font-dotgothic ${theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"}`}
                >
                  {problem.traditionalLabel}
                </div>
                <div
                  className={`text-[12px] px-2 py-0.5 rounded-12 inline-flex items-center ${
                    theme === "light"
                      ? "bg-[#C0C6D1] text-[#353639]"
                      : "bg-[#5F636B] text-[#C8D0DD]"
                  }`}
                >
                  <EmojiSadIcon className="mr-1" stroke={theme === "light" ? "#353639": "#C8D0DD"}/>
                  {problem.traditionalTag}
                </div>
              </div>
              <div
                className={`text-[16px] ${theme === "light" ? "text-[#868C97]" : "text-[#A6AFBF]"}`}
              >
                {problem.traditionalSubtitle}
              </div>
            </div>
          </div>

          {/* 表格内容 */}
          {comparisonData.map((item, index) => (
            <div
              key={index}
              className={`grid grid-cols-[72px_1fr_1fr] tablet:grid-cols-[120px_1fr_1fr] text-[16px] desktop:grid-cols-[192px_1fr_1fr] border-b border-0 border-solid ${
                theme === "light" ? "border-[#C0C6D1]" : "border-[#5F636B]"
              }`}
            >
              <div
                className={`p-3 desktop:p-5 ${
                  theme === "light" ? "text-[#868C97]" : "text-[#A6AFBF]"
                }`}
              >
                {item.dimension}
              </div>
              <div
                className={`flex items-center p-3 border-0 border-l border-r border-solid ${
                  theme === "light"
                    ? "bg-[#e6ecf6] text-[#353639] border-[#C0C6D1]"
                    : "bg-[#253241] text-[#C8D0DD] border-[#5F636B]"
                }`}
              >
                <ThumbUpIcon className="hidden tablet:block mr-1 " stroke={theme === "light" ? "#4373BB": "#66A2EB"} />
                <span className="break-words">{item.memfit}</span>
              </div>
              <div
                className={`p-3 desktop:px-6 flex items-center ${
                  theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
                }`}
              >
                <EmojiSadIcon className="hidden tablet:block mr-1" stroke={theme === "light" ? "#868C97": "#A6AFBF"} />
                <span className="break-words">{item.traditional}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
