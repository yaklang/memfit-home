import { useState, useEffect, useRef, type CSSProperties } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  loading?: 'lazy' | 'eager';
  placeholder?: string;
  onLoad?: () => void;
  priority?: boolean; // 标记为优先加载的图片
}

/**
 * 懒加载图片组件
 * - 使用 Intersection Observer API 实现懒加载
 * - 支持占位图片显示
 * - 支持优先加载模式（首屏关键图片）
 */
export const LazyImage = ({
  src,
  alt,
  className = '',
  style = {},
  loading = 'lazy',
  placeholder,
  onLoad,
  priority = false,
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // 优先加载的图片直接设为可见
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // 如果是优先加载，跳过 Intersection Observer
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px', // 提前100px开始加载
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div className={`relative ${className}`} style={style}>
      {/* 占位图或背景 */}
      {!isLoaded && (
        <div
          className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse"
          style={{
            backgroundImage: placeholder ? `url(${placeholder})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      
      {/* 实际图片 */}
      <img
        ref={imgRef}
        src={isInView ? src : undefined}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={style}
        loading={loading}
        onLoad={handleLoad}
        decoding="async"
      />
    </div>
  );
};

interface LazyBackgroundImageProps {
  imageUrl: string;
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
  priority?: boolean;
}

/**
 * 懒加载背景图片组件
 * - 用于 background-image 的懒加载
 * - 支持优先加载模式
 */
export const LazyBackgroundImage = ({
  imageUrl,
  className = '',
  style = {},
  children,
  priority = false,
}: LazyBackgroundImageProps) => {
  const [isInView, setIsInView] = useState(priority);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.01,
      }
    );

    if (divRef.current) {
      observer.observe(divRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  return (
    <div
      ref={divRef}
      className={className}
      style={{
        ...style,
        backgroundImage: isInView ? `url(${imageUrl})` : undefined,
      }}
    >
      {children}
    </div>
  );
};

export default LazyImage;
