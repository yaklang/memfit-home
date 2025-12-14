import type {ReactNode} from 'react';
import {useEffect, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
// Removed HomepageFeatures import as requested
// import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import HeroDownload from '@site/src/components/HeroDownload';

import styles from './index.module.css';

const SLOGANS = {
  en: 'Persistent Knowledge, Visible Action',
  'zh-Hans': '记得住的知识库，看得见的行动力',
};

const VERSION_LABELS = {
  en: 'Version',
  'zh-Hans': '版本号',
};

const OSS_BASE_URL = 'https://oss-qn.yaklang.com';
const VERSION_URL = `${OSS_BASE_URL}/memfit/latest/yakit-version.txt`;

function HomepageHeader() {
  const {siteConfig, i18n} = useDocusaurusContext();
  const locale = i18n.currentLocale as 'en' | 'zh-Hans';
  const slogan = SLOGANS[locale] || SLOGANS.en;
  const versionLabel = VERSION_LABELS[locale] || VERSION_LABELS.en;
  const headerRef = useRef<HTMLElement>(null);
  const [version, setVersion] = useState<string>('Loading...');

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = header.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate normalized coordinates (-1 to 1) for easier parallax math
      const xNorm = (x / rect.width) * 2 - 1;
      const yNorm = (y / rect.height) * 2 - 1;

      header.style.setProperty('--mouse-x', `${x}px`);
      header.style.setProperty('--mouse-y', `${y}px`);
      header.style.setProperty('--mouse-x-norm', xNorm.toFixed(4));
      header.style.setProperty('--mouse-y-norm', yNorm.toFixed(4));
    };

    header.addEventListener('mousemove', handleMouseMove);
    return () => header.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const response = await fetch(VERSION_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch version: ${response.status}`);
        }
        const versionText = await response.text();
        const trimmedVersion = versionText.trim();
        // If the version text is empty or invalid, fallback to loading/error state
        if (!trimmedVersion) {
             setVersion('Loading...');
        } else {
             setVersion(trimmedVersion);
        }
      } catch (err) {
        console.error('Failed to fetch version:', err);
        // If fetch fails, keep showing Loading... as requested
        setVersion('Loading...');
      }
    };

    fetchVersion();
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
          {version && (
            <div className={styles.versionContainer}>
              <span className={styles.versionLabel}>{versionLabel}:</span>
              <span className={styles.versionValue}>{version}</span>
            </div>
          )}
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
