import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  const init = () => {
    // 1. 处理所有 img 标签，添加原生懒加载
    document.querySelectorAll('img:not([loading])').forEach((img: HTMLImageElement) => {
      img.loading = 'lazy';
      img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
    });

    // 2. 处理背景图片懒加载
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const bg = el.getAttribute('data-lazy-bg');
            if (bg) {
              el.style.backgroundImage = `url(${bg})`;
              el.removeAttribute('data-lazy-bg');
              observer.unobserve(el);
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    document.querySelectorAll('[data-lazy-bg]').forEach((el) => observer.observe(el));
  };

  // 初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 监听路由变化
  let lastPath = location.pathname;
  new MutationObserver(() => {
    if (location.pathname !== lastPath) {
      lastPath = location.pathname;
      setTimeout(init, 100);
    }
  }).observe(document.body, { childList: true, subtree: true });
}
