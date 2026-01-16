import { CONTENT, type Locale } from "../locales";
import { useTheme } from "../context/ThemeContext";
import { ConcentricCircleIcon, NetworkIcon, ProblemTitleTextZh } from "../icons";
import { AnimatedTitle } from "./AnimatedTitle";

interface ProblemSectionProps {
  locale: Locale;
}

export const ProblemSection = ({ locale }: ProblemSectionProps) => {
  const { problem } = CONTENT[locale];
  const { theme } = useTheme();
  const isZh = locale === "zh-Hans";

  // 传统 AI Agent 的列表内容
  const traditionalItems = isZh
    ? [
        {
          bold: "纯 ReAct Agent",
          text: "容易在长链路任务中迷失方向，在多步操作后忘记最初的目标。",
        },
        {
          bold: "纯 Plan-Execute Agent",
          text: "过于僵化，当初步计划遇到意外障碍或新信息时往往会失败。",
        },
      ]
    : [
        {
          bold: "Pure ReAct Agent",
          text: "easily loses direction in long-chain tasks, forgetting the original goal after multiple steps.",
        },
        {
          bold: "Pure Plan-Execute Agent",
          text: "too rigid, often failing when initial plans encounter unexpected obstacles or new information.",
        },
      ];

  // Memfit AI 的描述
  const memfitDescription = isZh
    ? {
        prefix: "Memfit AI 通过",
        bold: "递归耦合",
        suffix:
          "这两种范式解决了这个问题。它制定计划，执行计划，如果某个子任务变得过于复杂，它会递归地触发一个新的规划阶段。这使得它能够处理任意复杂度的任务，同时适应实时反馈。",
      }
    : {
        prefix: "Memfit AI solves this problem through",
        bold: "recursive coupling",
        suffix:
          "of these two paradigms. It makes plans, executes them, and if a subtask becomes too complex, it recursively triggers a new planning phase. This enables it to handle tasks of arbitrary complexity while adapting to real-time feedback.",
      };

  // 传统 AI Agent 面临的问题描述
  const traditionalProblem = isZh
    ? {
        prefix: "传统的 AI Agent 通常面临\"",
        highlight: "单一范式困境",
        suffix: "\"：",
      }
    : {
        prefix: "Traditional AI Agents typically face the \"",
        highlight: "single-paradigm dilemma",
        suffix: "\":",
      };

  return (
    <section
      className={`px-4 tablet:px-6 desktop:px-12 2xl:px-16 ${
        theme === "light" ? "bg-[#F2F3F5]" : "bg-[#0a0a14]"
      }`}
    >
      {/* 移动端布局 - 高度约969px */}
      <div className="tablet:hidden">
        <div className="min-h-[819px] py-10 flex flex-col">
          {/* 标题 */}
          <div
            className={`text-[28px] mb-10 ${
              theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
            }`}
            style={{ fontFamily: 'DotGothic16, sans-serif' }}
          >
            <AnimatedTitle title={problem.title} />
          </div>

          {/* 传统 AI Agent 卡片 */}
          <div className="mb-6">
            {/* 图标 */}
            <div className="mb-4">
              <ConcentricCircleIcon className="w-16 h-16" />
            </div>

            {/* 标题 */}
            <h3
              className={`text-xl font-semibold mb-3 ${
                theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
              }`}
            >
              {problem.traditional.title}
            </h3>

            {/* 描述 */}
            <p
              className={`text-sm leading-relaxed mb-4 ${
                theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
              }`}
            >
              {traditionalProblem.prefix}
              <span className="text-[#E53935]">{traditionalProblem.highlight}</span>
              {traditionalProblem.suffix}
            </p>

            {/* 列表 */}
            <ul className="space-y-2 pl-0">
              {traditionalItems.map((item, index) => (
                <li
                  key={index}
                  className={`text-sm leading-relaxed flex items-start ${
                    theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
                  }`}
                >
                  <span>
                    <span className="font-semibold">{item.bold}</span> {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* 分隔线 */}
          <div
            className={`w-full h-px my-6 ${
              theme === "light" ? "bg-[#E6E8ED]" : "bg-white/20"
            }`}
          />

          {/* Memfit AI 卡片 */}
          <div>
            {/* 图标 */}
            <div className="mb-4">
              <NetworkIcon className="w-16 h-16" />
            </div>

            {/* 标题 */}
            <h3
              className={`text-xl font-semibold mb-3 ${
                theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
              }`}
            >
              {problem.memfit.title}
            </h3>

            {/* 描述 */}
            <p
              className={`text-sm leading-relaxed ${
                theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
              }`}
            >
              {memfitDescription.prefix}
              <span className="font-semibold">{memfitDescription.bold}</span>
              {memfitDescription.suffix}
            </p>
          </div>
        </div>
      </div>

      {/* 平板端布局 - 高度约809px */}
      <div className="hidden tablet:block desktop:hidden">
        <div className="min-h-[809px] py-12 flex flex-col max-w-[600px] mx-auto">
          {/* 标题 */}
          <div
            className={`flex justify-center items-center text-[32px] mb-10 ${
              theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
            }`}
            style={{ fontFamily: 'DotGothic16, sans-serif' }}
          >
            <AnimatedTitle title={problem.title} />
          </div>

          {/* 传统 AI Agent 卡片 */}
          <div className="mb-8">
            {/* 图标 */}
            <div className="mb-5">
              <ConcentricCircleIcon className="w-14 h-14" />
            </div>

            {/* 标题 */}
            <h3
              className={`text-2xl font-semibold mb-4 ${
                theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
              }`}
            >
              {problem.traditional.title}
            </h3>

            {/* 描述 */}
            <p
              className={`text-[15px] leading-relaxed mb-4 ${
                theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
              }`}
            >
              {traditionalProblem.prefix}
              <span className="text-[#E53935]">{traditionalProblem.highlight}</span>
              {traditionalProblem.suffix}
            </p>

            {/* 列表 */}
            <ul className="space-y-3">
              {traditionalItems.map((item, index) => (
                <li
                  key={index}
                  className={`text-[15px] leading-relaxed flex items-start ${
                    theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
                  }`}
                >
                  <span className="mr-2 mt-2 w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                  <span>
                    <span className="font-semibold">{item.bold}</span> {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* 分隔线 */}
          <div
            className={`w-full h-px my-8 ${
              theme === "light" ? "bg-[#E6E8ED]" : "bg-white/20"
            }`}
          />

          {/* Memfit AI 卡片 */}
          <div>
            {/* 图标 */}
            <div className="mb-5">
              <NetworkIcon className="w-14 h-14" />
            </div>

            {/* 标题 */}
            <h3
              className={`text-2xl font-semibold mb-4 ${
                theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
              }`}
            >
              {problem.memfit.title}
            </h3>

            {/* 描述 */}
            <p
              className={`text-[15px] leading-relaxed ${
                theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
              }`}
            >
              {memfitDescription.prefix}
              <span className="font-semibold">{memfitDescription.bold}</span>
              {memfitDescription.suffix}
            </p>
          </div>
        </div>
      </div>

      {/* PC端布局 - 高度约600px */}
      <div className="hidden desktop:block">
        <div className="min-h-[600px] py-16 2xl:py-20 flex flex-col">
          {/* 标题 - 居中 */}
          <div
            className={`text-[48px] 2xl:text-[48px] flex justify-center items-center mb-10 ${theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"}`}
            style={{ fontFamily: 'DotGothic16, sans-serif' }}
          >
            <AnimatedTitle title={problem.title} />
          </div>
          {/* 两栏布局 */}
          <div className="flex-1 grid grid-cols-2 gap-8 2xl:gap-16">
            {/* 传统 AI Agent 卡片 */}
            <div className="flex flex-col items-center text-center">
              {/* 图标 */}
              <div className="mb-6">
                <ConcentricCircleIcon className="w-14 h-14" />
              </div>

              {/* 标题 */}
              <h3
                className={`text-xl 2xl:text-2xl font-semibold mb-6 ${
                  theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
                }`}
              >
                {problem.traditional.title}
              </h3>

              {/* 内容区 - 左对齐 */}
              <div className="text-left max-w-[400px] 2xl:max-w-[480px]">
                {/* 描述 */}
                <p
                  className={`text-sm 2xl:text-[15px] leading-relaxed mb-4 ${
                    theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
                  }`}
                >
                  {traditionalProblem.prefix}
                  <span className="text-[#E53935]">{traditionalProblem.highlight}</span>
                  {traditionalProblem.suffix}
                </p>

                {/* 列表 */}
                <ul className="space-y-2 p-0">
                  {traditionalItems.map((item, index) => (
                    <li
                      key={index}
                      className={`text-sm 2xl:text-[15px] leading-relaxed flex items-start ${
                        theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
                      }`}
                    >
                      <span>
                        <span className="font-semibold">{item.bold}</span> {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Memfit AI 卡片 */}
            <div className="flex flex-col items-center text-center">
              {/* 图标 */}
              <div className="mb-6">
                <NetworkIcon className="w-12 h-12 2xl:w-14 2xl:h-14" />
              </div>

              {/* 标题 */}
              <h3
                className={`text-xl 2xl:text-2xl font-semibold mb-6 ${
                  theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
                }`}
              >
                {problem.memfit.title}
              </h3>

              {/* 内容区 - 左对齐 */}
              <div className="text-left max-w-[400px] 2xl:max-w-[480px]">
                {/* 描述 */}
                <p
                  className={`text-sm 2xl:text-[15px] leading-relaxed ${
                    theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
                  }`}
                >
                  {memfitDescription.prefix}
                  <span className="font-semibold">{memfitDescription.bold}</span>
                  {memfitDescription.suffix}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
