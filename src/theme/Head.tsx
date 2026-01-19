import React from 'react';
import Head from '@docusaurus/Head';

/**
 * 自定义 Head 组件
 * 用于添加关键资源的预加载、预连接等性能优化配置
 */
export default function CustomHead() {
  return (
    <Head>
      {/* 预加载首屏关键字体 - DotGothic16 */}
      <link
        rel="preload"
        href="/fonts/DotGothic16-Regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />

      {/* 预加载首屏背景图 - Hero Section */}
      <link
        rel="preload"
        href="/newImg/header-bg.png"
        as="image"
      />

      {/* DNS 预解析和预连接 - 如果使用 CDN */}
      {/* <link rel="dns-prefetch" href="https://your-cdn.com" /> */}
      {/* <link rel="preconnect" href="https://your-cdn.com" crossOrigin="anonymous" /> */}

      {/* 添加性能相关的 meta 标签 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      
      {/* 提示浏览器进行资源优先级处理 */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
    </Head>
  );
}
