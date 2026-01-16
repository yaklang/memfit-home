import { useEffect, useMemo, useState, useRef } from "react";

interface AnimatedTitleProps {
  title: string;
  highlightPattern?: RegExp;
  highlightColor?: string;
}

/**
 * 带滚动触发动画的标题组件：每个字符按随机顺序出现
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

  return (
    <div ref={ref} style={{ display: "inline" }}>
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
    </div>
  );
};
