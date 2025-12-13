import React, {useEffect, useState, type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import DownloadIcon from '@site/src/components/DownloadIcon';
import styles from './styles.module.css';

const OSS_BASE_URL = 'https://oss-qn.yaklang.com';
const VERSION_URL = `${OSS_BASE_URL}/memfit/latest/yakit-version.txt`;

interface DownloadItem {
  name: {
    en: string;
    'zh-Hans': string;
  };
  platform: string;
  arch: string;
  extension: string;
}

const DOWNLOAD_ITEMS: DownloadItem[] = [
  {name: {en: 'macOS (Apple Silicon)', 'zh-Hans': 'macOS (Apple Silicon)'}, platform: 'darwin', arch: 'arm64', extension: 'dmg'},
  {name: {en: 'macOS (Intel)', 'zh-Hans': 'macOS (Intel)'}, platform: 'darwin', arch: 'x64', extension: 'dmg'},
  {name: {en: 'macOS (Legacy Apple Silicon)', 'zh-Hans': 'macOS (Legacy Apple Silicon)'}, platform: 'darwin-legacy', arch: 'arm64', extension: 'dmg'},
  {name: {en: 'macOS (Legacy Intel)', 'zh-Hans': 'macOS (Legacy Intel)'}, platform: 'darwin-legacy', arch: 'x64', extension: 'dmg'},
  {name: {en: 'Linux (AMD64)', 'zh-Hans': 'Linux (AMD64)'}, platform: 'linux', arch: 'amd64', extension: 'AppImage'},
  {name: {en: 'Linux (ARM64)', 'zh-Hans': 'Linux (ARM64)'}, platform: 'linux', arch: 'arm64', extension: 'AppImage'},
  {name: {en: 'Linux (Legacy AMD64)', 'zh-Hans': 'Linux (Legacy AMD64)'}, platform: 'linux-legacy', arch: 'amd64', extension: 'AppImage'},
  {name: {en: 'Linux (Legacy ARM64)', 'zh-Hans': 'Linux (Legacy ARM64)'}, platform: 'linux-legacy', arch: 'arm64', extension: 'AppImage'},
  {name: {en: 'Windows (AMD64)', 'zh-Hans': 'Windows (AMD64)'}, platform: 'windows', arch: 'amd64', extension: 'exe'},
  {name: {en: 'Windows (Legacy AMD64)', 'zh-Hans': 'Windows (Legacy AMD64)'}, platform: 'windows-legacy', arch: 'amd64', extension: 'exe'},
];

const TRANSLATIONS = {
  en: {
    download: 'Download',
    downloadMore: 'Download more versions',
  },
  'zh-Hans': {
    download: '下载',
    downloadMore: '下载更多版本',
  },
};

export default function HeroDownload(): ReactNode {
  const {i18n} = useDocusaurusContext();
  const locale = i18n.currentLocale as 'en' | 'zh-Hans';
  const t = TRANSLATIONS[locale] || TRANSLATIONS.en;
  
  const [version, setVersion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        setLoading(true);
        const response = await fetch(VERSION_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch version: ${response.status}`);
        }
        const versionText = await response.text();
        const trimmedVersion = versionText.trim();
        setVersion(trimmedVersion);
      } catch (err) {
        console.error('Failed to fetch version:', err);
        // Fallback to a default version if fetch fails
        setVersion('1.0.0-1212');
      } finally {
        setLoading(false);
      }
    };

    fetchVersion();
  }, []);

  useEffect(() => {
    // Auto-detect platform and set default selection
    if (typeof window === 'undefined' || DOWNLOAD_ITEMS.length === 0) return;
    
    const detectPlatform = (): DownloadItem | null => {
      const userAgent = navigator.userAgent.toLowerCase();
      const platform = navigator.platform.toLowerCase();
      
      // macOS detection
      if (platform.includes('mac') || userAgent.includes('mac')) {
        const isAppleSilicon = 
          userAgent.includes('arm') ||
          (navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 8) ||
          (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        
        if (isAppleSilicon) {
          return DOWNLOAD_ITEMS.find(item => item.platform === 'darwin' && item.arch === 'arm64') || null;
        }
        return DOWNLOAD_ITEMS.find(item => item.platform === 'darwin' && item.arch === 'x64') || null;
      }
      
      // Windows detection
      if (platform.includes('win') || userAgent.includes('windows')) {
        return DOWNLOAD_ITEMS.find(item => item.platform === 'windows' && item.arch === 'amd64') || null;
      }
      
      // Linux detection
      if (platform.includes('linux') || userAgent.includes('linux')) {
        return DOWNLOAD_ITEMS.find(item => item.platform === 'linux' && item.arch === 'amd64') || null;
      }
      
      return null;
    };

    const detected = detectPlatform();
    if (detected !== null) {
      const index = DOWNLOAD_ITEMS.findIndex(
        item => item.platform === detected.platform && item.arch === detected.arch
      );
      if (index >= 0) {
        setSelectedIndex(index);
      }
    }
  }, []);

  const getDownloadUrl = (item: DownloadItem): string => {
    if (!version) return '#';
    return `${OSS_BASE_URL}/memfit/${version}/MemfitAI-${version}-${item.platform}-${item.arch}.${item.extension}`;
  };

  const selectedItem = DOWNLOAD_ITEMS[selectedIndex];

  if (loading || !version) {
    return null;
  }

  return (
    <div className={styles.downloadContainer}>
      <div className={styles.downloadSelector}>
        <select
          className={styles.select}
          value={selectedIndex}
          onChange={(e) => setSelectedIndex(Number(e.target.value))}
        >
          {DOWNLOAD_ITEMS.map((item, index) => (
            <option key={index} value={index}>
              {item.name[locale] || item.name.en}
            </option>
          ))}
        </select>
        <a
          href={getDownloadUrl(selectedItem)}
          className={styles.downloadButton}
          download
        >
          <span className={styles.downloadText}>{t.download}</span>
          <DownloadIcon className={styles.downloadIcon} width={18} height={18} />
        </a>
      </div>
      <Link to="/downloads" className={styles.moreLink}>
        {t.downloadMore}
      </Link>
    </div>
  );
}

