import { useEffect, useMemo, useState, useRef } from "react";

interface AnimatedTitleProps {
  title: string;
  highlightPattern?: RegExp;
  highlightColor?: string;
}

/**
 * 带滚动触发动画的标题组件：每个字符按随机顺序出现
 * GEO：SSR 只输出一份纯文本；逐字动画 span 在客户端挂载后才渲染，
 * 避免爬虫从同一标题提取到两份文本（sr-only 副本 + 逐字 span 副本）
 * @param title - 标题文本
 * @param highlightPattern - 可选的高亮匹配正则（如 /(memfit|Memfit|MEMFIT)/gi）
 * @param highlightColor - 高亮颜色，默认使用 CSS 变量 --highlight-color
 */
export const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
  title,
  highlightPattern,
  highlightColor = "var(--highlight-color)",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  // 动画 span 仅在客户端挂载后渲染；SSR/未执行 JS 时标题就是一份纯文本
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 计算需要高亮的字符范围
  const chars = useMemo(() => {
    const ranges: Array<[number, number]> = [];
    
    if (highlightPattern) {
      let m: RegExpExecArray | null;
      while ((m = highlightPattern.exec(title)) !== null) {
        ranges.push([m.index, m.index + m[0].length]);
      }
    }
    
    return title.split("").map((ch, i) => ({
      ch,
      highlighted: ranges.some(([s, e]) => i >= s && i < e),
    }));
  }, [title, highlightPattern]);

  // 生成随机顺序
  const shuffled = useMemo(() => {
    const len = chars.length;
    const a = Array.from({ length: len }, (_, i) => i);
    for (let i = a.length - 1; i > 0; i--) {
      const r = Math.floor(Math.random() * (i + 1));
      [a[i], a[r]] = [a[r], a[i]];
    }
    return a;
  }, [chars.length]);

  const posMap = useMemo(() => {
    const m: number[] = new Array(chars.length);
    shuffled.forEach((origIdx, seq) => {
      m[origIdx] = seq;
    });
    return m;
  }, [shuffled, chars.length]);

  // 使用 IntersectionObserver 监听元素进入视口
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const baseDelay = 50; // ms 每个字符间隔

  // \u6302\u8F7D\u524D\uFF08SSR / \u672A\u6267\u884C JS\uFF09\uFF1A\u5355\u4E00\u7EAF\u6587\u672C\u526F\u672C\uFF0C\u8BED\u4E49\u4E0E\u63D0\u53D6\u90FD\u662F\u5E72\u51C0\u7684
  if (!mounted) {
    return <span ref={ref}>{title}</span>;
  }

  return (
    <span ref={ref} style={{ display: "inline" }}>
      {/* \u6302\u8F7D\u540E\uFF1Asr-only \u7EAF\u6587\u672C\u4F9B\u5C4F\u5E55\u9605\u8BFB\u5668\uFF0C\u9010\u5B57 span \u4EC5\u505A\u89C6\u89C9\u52A8\u753B\uFF08aria-hidden\uFF09 */}
      <span className="sr-only">{title}</span>
      <span aria-hidden="true" style={{ display: "inline" }}>
        {chars.map(({ ch, highlighted }, i) => {
          const seq = posMap[i] ?? 0;
          const delay = seq * baseDelay + Math.floor(Math.random() * 30);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 400ms ease, transform 400ms ease",
                transitionDelay: `${delay}ms`,
                color: highlighted ? highlightColor : undefined,
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          );
        })}
      </span>
    </span>
  );
};
