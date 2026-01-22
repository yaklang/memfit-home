import { useState, useEffect } from "react";
import { CONTENT, type Locale } from "../locales";
import { useTheme } from "../context/ThemeContext";
import { DotIcon } from "../icons";
import { AnimatedTitle } from "./AnimatedTitle";

interface NavigationBarProps {
  locale: Locale;
}

export const NavigationBar = ({ locale }: NavigationBarProps) => {
  const { navigation } = CONTENT[locale];
  const { theme } = useTheme();

  return (
    <div
      className={`w-full ${theme === "light" ? "bg-[#F8F9FA]" : "bg-[#0a0a14]"}`}
    >
      <div className="max-w-[1600px] mx-auto pt-[40px] px-6">
        <div className="desktop:flex justify-between items-start mb-6">
          {/* 左上角标题 */}
          <h2
            className={`text-[48px] flex-shrink-0 font-normal ${
              theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
            }`}
            style={{ fontFamily: "DotGothic16, sans-serif" }}
          >
            <AnimatedTitle title={navigation.title} />
          </h2>

          {/* 右上角描述文字 */}
          <p
            className={`text-[18px] leading-relaxed desktop:text-right desktop:max-w-[528px] ${
              theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
            }`}
          >
            {navigation.description}
          </p>
        </div>
        {/* 点阵 - 全宽 */}
        <div className="flex overflow-hidden gap-2">
          {Array.from({ length: 200 }).map((_, i) => (
            <DotIcon key={i} className="flex-shrink-0" />
          ))}
        </div>
      </div>
    </div>
  );
};
