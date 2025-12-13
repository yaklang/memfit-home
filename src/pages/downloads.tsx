import React, {useEffect, useState, type ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import DownloadIcon from '@site/src/components/DownloadIcon';
import styles from './downloads.module.css';

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
    title: 'Download Memfit AI',
    currentVersion: 'Current version',
    platform: 'Platform',
    architecture: 'Architecture',
    download: 'Download',
    loading: 'Loading version information...',
    error: 'Failed to load version information',
  },
  'zh-Hans': {
    title: '下载 Memfit AI',
    currentVersion: '当前版本',
    platform: '平台',
    architecture: '架构',
    download: '下载',
    loading: '正在加载版本信息...',
    error: '加载版本信息失败',
  },
};

export default function DownloadsPage(): ReactNode {
  const {i18n, siteConfig} = useDocusaurusContext();
  const locale = i18n.currentLocale as 'en' | 'zh-Hans';
  const t = TRANSLATIONS[locale] || TRANSLATIONS.en;
  
  const [version, setVersion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

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
        setError('');
      } catch (err) {
        console.error('Failed to fetch version:', err);
        setError(t.error);
        // Fallback to a default version if fetch fails
        setVersion('1.0.0-1212');
      } finally {
        setLoading(false);
      }
    };

    fetchVersion();
  }, [t.error]);

  const getDownloadUrl = (item: DownloadItem): string => {
    if (!version) return '#';
    return `${OSS_BASE_URL}/memfit/${version}/MemfitAI-${version}-${item.platform}-${item.arch}.${item.extension}`;
  };

  return (
    <Layout
      title={`${t.title} - ${siteConfig.title}`}
      description={`${t.title} - ${siteConfig.tagline}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Heading as="h1" className={styles.title}>
            {t.title}
          </Heading>
          {loading ? (
            <p className={styles.loading}>{t.loading}</p>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : version ? (
            <p className={styles.version}>
              {t.currentVersion}: <strong>{version}</strong>
            </p>
          ) : null}
        </div>

        {version && (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t.platform}</th>
                  <th>{t.architecture}</th>
                  <th>{t.download}</th>
                </tr>
              </thead>
              <tbody>
                {DOWNLOAD_ITEMS.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name[locale] || item.name.en}</td>
                    <td>
                      <code className={styles.code}>
                        {item.platform}-{item.arch}
                      </code>
                    </td>
                    <td>
                      <a
                        href={getDownloadUrl(item)}
                        className={styles.downloadLink}
                        download
                      >
                        <span className={styles.downloadText}>{t.download}</span>
                        <DownloadIcon className={styles.downloadIcon} width={16} height={16} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

