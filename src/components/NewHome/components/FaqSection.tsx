import { CONTENT, type Locale } from "../locales";
import { useTheme } from "../context/ThemeContext";
import { DotStrip } from "../icons";
import { AnimatedTitle } from "./AnimatedTitle";

interface FaqSectionProps {
  locale: Locale;
}

/**
 * 首页 FAQ 区块（GEO：问句式 H2/H3 + 40-60 字直答段，
 * 与 overview 文档 FAQ 口径一致；配套 FAQPage JSON-LD 见 index.tsx）
 * 单份响应式 DOM，无移动/桌面副本。
 */
export const FaqSection = ({ locale }: FaqSectionProps) => {
  const { faq } = CONTENT[locale];
  const { theme } = useTheme();

  return (
    <section
      id="faq"
      className={`px-4 tablet:px-6 ${theme ==='light'? " bg-[#f8f9fa]": "bg-[#171717]"}`}
    >
      <div className="py-10 tablet:py-12 desktop:py-16 2xl:py-20 flex flex-col max-w-[1600px] mx-auto">
        {/* 标题 - 居中 */}
        <h2
          className={`text-[32px] tablet:text-[48px] flex justify-center items-center mb-2 font-dotgothic ${
            theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
          }`}
        >
          <AnimatedTitle title={faq.title} />
        </h2>

        <DotStrip gap={1} className="mb-8 tablet:mb-10 justify-center" />

        {/* 问答列表 */}
        <div className="flex flex-col gap-4 desktop:gap-6">
          {faq.items.map((item) => (
            <div
              key={item.question}
              className={`border border-solid px-4 tablet:px-6 py-4 tablet:py-5 ${
                theme === "light"
                  ? "border-[#E6E8ED] bg-white"
                  : "border-white/10 bg-[#1f2022]"
              }`}
            >
              <h3
                className={`text-lg tablet:text-xl mb-2 font-dotgothic ${
                  theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
                }`}
              >
                {item.question}
              </h3>
              <p
                className={`text-base leading-7 ${
                  theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
                }`}
              >
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
