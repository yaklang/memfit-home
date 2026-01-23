import { useState, useEffect, useRef } from "react";
import { CONTENT, type Locale, type SectionItem } from "../locales";
import { useTheme } from "../context/ThemeContext";
import { DotIcon, BookOpenIcon, BrainIcon, ListTodoIcon, RefreshIcon, WrenchIcon } from "../icons";
import { AnimatedTitle } from "./AnimatedTitle";
import { LazyBackgroundImage } from "@site/src/components/LazyImage";

interface NavigationBarProps {
  locale: Locale;
  allSections?: SectionItem[];
}

export const NavigationBar = ({ locale, allSections }: NavigationBarProps) => {
  const { architecture, navigation } = CONTENT[locale];
  const { theme } = useTheme();

  // 添加类型断言
  const archSections = (architecture as any)?.sections || [];
  const sections = allSections || archSections;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInHijackMode, setIsInHijackMode] = useState(false);

  // 使用useRef来跟踪状态，避免useEffect重新运行
  const activeIndexRef = useRef(activeIndex);
  const isInHijackModeRef = useRef(isInHijackMode);

  // 当state更新时，同步更新ref
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    isInHijackModeRef.current = isInHijackMode;
  }, [isInHijackMode]);

  // 背景图片映射
  const bgImages = [
    "/newImg/bg-1.jpg",
    "/newImg/bg-2.jpg",
    "/newImg/bg-3.jpg",
    "/newImg/bg-4.jpg",
    "/newImg/bg-5.jpg",
  ];

  const bgBlackImages = [
    "/newImg/bg-black-1.jpg",
    "/newImg/bg-black-2.jpg",
    "/newImg/bg-black-3.jpg",
    "/newImg/bg-black-4.jpg",
    "/newImg/bg-black-5.jpg",
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

  // 左侧图标映射
  const leftIcon = [
    <BookOpenIcon />,
    <BrainIcon />,
    <ListTodoIcon />,
    <RefreshIcon />,
    <WrenchIcon />,
  ];

  // 高亮颜色
  const highlightColor = theme === "light" ? "#4373BB" : "#66A2EB";

  // 渲染技术列表的函数
  const renderTechList = (desc: string, currentTheme: string) => {
    const lines = desc.split("/n").filter((line) => line.trim());

    return (
      <ul className="mt-2 space-y-2 list-none p-0 m-0">
        {lines.map((line, i) => (
          <li
            key={i}
            className={`text-sm leading-relaxed flex items-start ${
              currentTheme === "light" ? "text-[#868C97]" : "text-[#A6AFBF]"
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

  // 监听滚动，实现滚动劫持效果
  useEffect(() => {
    if (!allSections || allSections.length === 0) {
      return;
    }


    let scrollAccumulator = 0;
    const scrollThreshold = 120; // 增加阈值，避免切换太快
    let exitAccumulator = 0;
    const exitThreshold = 180; // 增加退出阈值
    let isLocked = false;
    let lockedPosition = 0;
    let animationFrameId: number | null = null;
    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    let switchTimeout: number | null = null; // 防抖延迟
    let canSwitch = true; // 是否允许切换
    // 启动滚动锁定循环
    const startLockLoop = () => {
      const lockLoop = () => {
        if (isLocked) {
          if (Math.abs(window.scrollY - lockedPosition) > 2) {
            window.scrollTo({ top: lockedPosition, behavior: 'instant' });
          }
          animationFrameId = requestAnimationFrame(lockLoop);
        }
      };
      lockLoop();
    };

    // 检查是否在劫持区域 - 只有当容器顶部到达屏幕顶部时才触发
    const checkNavZone = () => {
      const navContainer = document.getElementById('navigation-bar-container');
      if (!navContainer) return false;
      
      const headerHeight = 56;
      const navRect = navContainer.getBoundingClientRect();
      // 容器顶部必须到达header底部，且容器底部仍在屏幕内
      return navRect.top <= headerHeight + 10 && navRect.top >= -50 && navRect.bottom > window.innerHeight;
    };

    // 处理滚轮事件
    const handleWheel = (e: WheelEvent) => {
      const totalSections = allSections.length;
      const currentActiveIndex = activeIndexRef.current;
      const inNavZone = checkNavZone();
      
      if (!inNavZone) {
        if (isLocked) {
          isLocked = false;
          setIsInHijackMode(false);
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
        scrollAccumulator = 0;
        exitAccumulator = 0;
        return;
      }
      
      if (!isLocked) {
        isLocked = true;
        lockedPosition = window.scrollY;
        setIsInHijackMode(true);
        scrollAccumulator = 0;
        exitAccumulator = 0;
        startLockLoop();
      }
      
      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;
      const isAtLastSection = currentActiveIndex >= totalSections - 1;
      const isAtFirstSection = currentActiveIndex <= 0;
      
      
      if (isAtLastSection && isScrollingDown) {
        exitAccumulator += Math.abs(e.deltaY);
        
        if (exitAccumulator >= exitThreshold) {
          isLocked = false;
          setIsInHijackMode(false);
          scrollAccumulator = 0;
          exitAccumulator = 0;
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
          return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      
      if (isAtFirstSection && isScrollingUp) {
        exitAccumulator += Math.abs(e.deltaY);
        
        if (exitAccumulator >= exitThreshold) {
          isLocked = false;
          setIsInHijackMode(false);
          scrollAccumulator = 0;
          exitAccumulator = 0;
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
          return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      
      exitAccumulator = 0;
      e.preventDefault();
      e.stopPropagation();
      
      scrollAccumulator += Math.abs(e.deltaY);
      
      if (scrollAccumulator >= scrollThreshold && canSwitch) {
        if (isScrollingDown && currentActiveIndex < totalSections - 1) {
          setActiveIndex(prev => Math.min(totalSections - 1, prev + 1));
          canSwitch = false;
          scrollAccumulator = 0;
          if (switchTimeout) clearTimeout(switchTimeout);
          switchTimeout = window.setTimeout(() => {
            canSwitch = true;
          }, 600); // 切换后延迟600ms才能再次切换
        } else if (isScrollingUp && currentActiveIndex > 0) {
          setActiveIndex(prev => Math.max(0, prev - 1));
          canSwitch = false;
          scrollAccumulator = 0;
          if (switchTimeout) clearTimeout(switchTimeout);
          switchTimeout = window.setTimeout(() => {
            canSwitch = true;
          }, 600);
        }
      }
    };

    // 处理滚动事件（拖拽滚动条）
    const handleScroll = () => {
      const totalSections = allSections.length;
      const currentActiveIndex = activeIndexRef.current;
      const inNavZone = checkNavZone();
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const scrollDelta = currentScrollY - lastScrollY;
      const timeDelta = currentTime - lastScrollTime;
      
      // 计算滚动速度（像素/毫秒）
      const scrollSpeed = Math.abs(scrollDelta) / (timeDelta || 1);
      
      // 如果滚动速度过快（超过1像素/毫秒），忽略这次滚动
      if (scrollSpeed > 1) {
        lastScrollY = currentScrollY;
        lastScrollTime = currentTime;
        return;
      }
      
      if (!inNavZone) {
        if (isLocked) {
          isLocked = false;
          setIsInHijackMode(false);
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
        lastScrollY = currentScrollY;
        lastScrollTime = currentTime;
        scrollAccumulator = 0;
        exitAccumulator = 0;
        return;
      }
      
      if (!isLocked) {
        isLocked = true;
        lockedPosition = currentScrollY;
        setIsInHijackMode(true);
        scrollAccumulator = 0;
        exitAccumulator = 0;
        startLockLoop();
      }
      
      const isScrollingDown = scrollDelta > 0;
      const isScrollingUp = scrollDelta < 0;
      const isAtLastSection = currentActiveIndex >= totalSections - 1;
      const isAtFirstSection = currentActiveIndex <= 0;
      
      if (isAtLastSection && isScrollingDown) {
        exitAccumulator += Math.abs(scrollDelta);
        
        if (exitAccumulator >= exitThreshold) {
          isLocked = false;
          setIsInHijackMode(false);
          scrollAccumulator = 0;
          exitAccumulator = 0;
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
          lastScrollY = currentScrollY;
          lastScrollTime = currentTime;
          return;
        }
        lastScrollY = currentScrollY;
        lastScrollTime = currentTime;
        return;
      }
      
      if (isAtFirstSection && isScrollingUp) {
        exitAccumulator += Math.abs(scrollDelta);
        
        if (exitAccumulator >= exitThreshold) {
          isLocked = false;
          setIsInHijackMode(false);
          scrollAccumulator = 0;
          exitAccumulator = 0;
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
          lastScrollY = currentScrollY;
          lastScrollTime = currentTime;
          return;
        }
        lastScrollY = currentScrollY;
        lastScrollTime = currentTime;
        return;
      }
      
      exitAccumulator = 0;
      scrollAccumulator += Math.abs(scrollDelta);
      
      if (scrollAccumulator >= scrollThreshold && canSwitch) {
        if (isScrollingDown && currentActiveIndex < totalSections - 1) {
          setActiveIndex(prev => Math.min(totalSections - 1, prev + 1));
          canSwitch = false;
          scrollAccumulator = 0;
          if (switchTimeout) clearTimeout(switchTimeout);
          switchTimeout = window.setTimeout(() => {
            canSwitch = true;
          }, 600);
        } else if (isScrollingUp && currentActiveIndex > 0) {
          setActiveIndex(prev => Math.max(0, prev - 1));
          canSwitch = false;
          scrollAccumulator = 0;
          if (switchTimeout) clearTimeout(switchTimeout);
          switchTimeout = window.setTimeout(() => {
            canSwitch = true;
          }, 600);
        }
      }
      
      lastScrollY = currentScrollY;
      lastScrollTime = currentTime;
    };

    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('wheel', handleWheel, { capture: true } as EventListenerOptions);
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (switchTimeout) {
        clearTimeout(switchTimeout);
      }
    };
  }, [allSections]);



  return (
    <div
      id="navigation-bar-container"
      className={`w-full px-6`}
    >
      <div className="max-w-[1600px] mx-auto">
        <div className="desktop:flex justify-between items-start mb-6">
          {/* 左上角标题 */}
          <h2
            className={`text-[48px] flex-shrink-0 font-normal ${
              theme === "light" ? "text-[#353639]" : "text-[#C8D0DD]"
            }`}
            style={{ fontFamily: "DotGothic16, sans-serif" }}
          >
            <AnimatedTitle title={architecture.title} />
          </h2>

          {/* 右上角描述文字 */}
          <p
            className={`text-[18px] leading-relaxed desktop:text-right desktop:max-w-[528px] ${
              theme === "light" ? "text-[#5A5D64]" : "text-[#BAC3D4]"
            }`}
          >
            {architecture.description}
          </p>
        </div>
        {/* 点阵 - 全宽 */}
        <div className="flex overflow-hidden gap-2">
          {Array.from({ length: 200 }).map((_, i) => (
            <DotIcon key={i} className="flex-shrink-0" />
          ))}
        </div>
      </div>
      {/* PC端布局 - 高度约880px */}
      <div className="hidden desktop:block relative z-10 h-full w-full">
        <div className="py-20 max-w-[1600px] mx-auto">
          <div className="flex justify-between gap-5 h-full">
            {/* 左侧内容 */}
            <div className="w-[460px] xl:h-[520px]">
              {/* 导航卡片列表 */}
              <div className="flex flex-col">
                {sections.map((item, idx) => {
                  const isActive = activeIndex === idx;
                  return (
                    <div
                      key={item.id}
                      className={`cursor-pointer relative transition-all duration-300 ease-in-out ${idx !== 0 ? "mt-[-1px]" : ""}`}
                      onClick={() => {
                        setActiveIndex(idx);
                      }}
                    >
                      {/* 四个角 */}
                      <div
                        className="absolute left-0 top-0 w-2 h-2 transition-all duration-300 ease-in-out"
                        style={{
                          borderLeft: `1px solid ${isActive ? highlightColor : theme === "light" ? "#868C97" : "#A6AFBF"}`,
                          borderTop: `1px solid ${isActive ? highlightColor : theme === "light" ? "#868C97" : "#A6AFBF"}`,
                        }}
                      />
                      <div
                        className="absolute right-0 top-0 w-2 h-2 transition-all duration-300 ease-in-out"
                        style={{
                          borderRight: `1px solid ${isActive ? highlightColor : theme === "light" ? "#868C97" : "#A6AFBF"}`,
                          borderTop: `1px solid ${isActive ? highlightColor : theme === "light" ? "#868C97" : "#A6AFBF"}`,
                        }}
                      />
                      <div
                        className="absolute left-0 bottom-0 w-2 h-2 transition-all duration-300 ease-in-out"
                        style={{
                          borderLeft: `1px solid ${isActive ? highlightColor : theme === "light" ? "#868C97" : "#A6AFBF"}`,
                          borderBottom: `1px solid ${isActive ? highlightColor : theme === "light" ? "#868C97" : "#A6AFBF"}`,
                        }}
                      />
                      <div
                        className="absolute right-0 bottom-0 w-2 h-2 transition-all duration-300 ease-in-out"
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
                            className={`flex items-end transition-all duration-300 ease-in-out ${
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
                            className={`text-xl transition-all duration-300 ease-in-out ${
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
                            style={{
                              animation: 'slideUpFadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                            }}
                          />
                        ) : null}
                      </div>
                      {/* 展开的详情 */}
                      {isActive ? (
                        <div className="px-4 pb-5 transition-all duration-300 ease-in-out">
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
                    ? bgImages[activeIndex]
                    : bgBlackImages[activeIndex] || bgBlackImages[0]
                }
                className="absolute inset-0 pointer-events-none transition-all duration-500 ease-in-out"
                style={{
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <img
                key={activeIndex}
                src={
                  theme === "light"
                    ? `/newImg/content-${activeIndex + 1}.png`
                    : `/newImg/content-black-${activeIndex + 1}.png`
                }
                alt={sections[activeIndex]?.title || "Section"}
                className="2xl:h-[540px] h-auto z-10"
                style={{
                  animation: 'slideUpFadeIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}
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
