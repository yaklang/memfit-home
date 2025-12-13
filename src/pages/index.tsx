import type {ReactNode} from 'react';
import {useEffect, useRef} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
// Removed HomepageFeatures import as requested
// import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import HeroDownload from '@site/src/components/HeroDownload';

import styles from './index.module.css';

const SLOGANS = {
  en: 'A Persistent Knowledge Base, and an Execution Engine That Gets Things Done',
  'zh-Hans': '记得住的知识库，跑得动的执行力',
};

function HomepageHeader() {
  const {siteConfig, i18n} = useDocusaurusContext();
  const locale = i18n.currentLocale as 'en' | 'zh-Hans';
  const slogan = SLOGANS[locale] || SLOGANS.en;
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = header.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      header.style.setProperty('--mouse-x', `${x}px`);
      header.style.setProperty('--mouse-y', `${y}px`);
    };

    header.addEventListener('mousemove', handleMouseMove);
    return () => header.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <header ref={headerRef} className={styles.heroBanner}>
      <div className={styles.heroBackground} />
      <div className={styles.heroGrid} />
      <div className={styles.heroOverlay} />
      
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <Heading as="h1" className={styles.heroTitle}>
            {siteConfig.title}
          </Heading>
          <p className={styles.heroSubtitle}>{slogan}</p>
          <HeroDownload />
        </div>
        {/* Right side is intentionally empty to show the background image */}
        <div /> 
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        {/* Removed HomepageFeatures as requested */}
      </main>
    </Layout>
  );
}
