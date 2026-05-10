// 下载辅助工具

const OSS_BASE_URL = 'https://oss-qn.yaklang.com';
const VERSION_URL = `${OSS_BASE_URL}/memfit/latest/yakit-version.txt`;

export type OSType = 'darwin' | 'linux' | 'windows' | 'unknown';
export type DownloadArch = 'arm64' | 'amd64' | 'x64';

export interface DownloadItem {
  platform: OSType;
  arch: DownloadArch;
  extension: string;
  label: {
    en: string;
    'zh-Hans': string;
  };
}

export interface DownloadOption extends DownloadItem {
  url: string;
}

export const DOWNLOAD_ITEMS: DownloadItem[] = [
  {
    platform: 'darwin',
    arch: 'arm64',
    extension: 'dmg',
    label: { en: 'Apple Silicon', 'zh-Hans': '苹果芯片' },
  },
  {
    platform: 'darwin',
    arch: 'x64',
    extension: 'dmg',
    label: { en: 'Intel', 'zh-Hans': 'Intel' },
  },
  {
    platform: 'linux',
    arch: 'amd64',
    extension: 'AppImage',
    label: { en: 'AMD64', 'zh-Hans': 'AMD64' },
  },
  {
    platform: 'linux',
    arch: 'arm64',
    extension: 'AppImage',
    label: { en: 'ARM64', 'zh-Hans': 'ARM64' },
  },
  {
    platform: 'windows',
    arch: 'amd64',
    extension: 'exe',
    label: { en: 'AMD64', 'zh-Hans': 'AMD64' },
  },
];

/**
 * 检测当前操作系统
 */
export function detectOS(): OSType {
  if (typeof window === 'undefined') return 'unknown';
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform?.toLowerCase() || '';
  
  // 检测 macOS
  if (platform.includes('mac') || userAgent.includes('mac')) {
    return 'darwin';
  }
  
  // 检测 Windows
  if (platform.includes('win') || userAgent.includes('win')) {
    return 'windows';
  }
  
  // 检测 Linux
  if (platform.includes('linux') || userAgent.includes('linux')) {
    return 'linux';
  }
  
  return 'unknown';
}

/**
 * 检测 CPU 架构
 */
export function detectArch(): DownloadArch {
  if (typeof window === 'undefined') return 'amd64';
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  
  // 检测 Apple Silicon
  if (userAgent.includes('mac') && (userAgent.includes('arm') || userAgent.includes('aarch64'))) {
    return 'arm64';
  }
  
  // 检测 ARM Linux
  if (userAgent.includes('linux') && (userAgent.includes('arm') || userAgent.includes('aarch64'))) {
    return 'arm64';
  }
  
  // macOS Intel 使用 x64
  if (userAgent.includes('mac')) {
    return 'x64';
  }
  
  // Windows 和 Linux 默认使用 amd64
  return 'amd64';
}

/**
 * 获取文件扩展名
 */
export function getExtension(os: OSType): string {
  switch (os) {
    case 'darwin':
      return 'dmg';
    case 'linux':
      return 'AppImage';
    case 'windows':
      return 'exe';
    default:
      return '';
  }
}

/**
 * 获取平台标识
 */
export function getPlatform(os: OSType): string {
  // 默认使用非 legacy 版本
  return os;
}

/**
 * 生成下载链接
 * @param version 版本号
 * @param os 操作系统类型
 * @param arch CPU 架构
 */
export function generateDownloadUrl(version: string, os: OSType, arch?: string): string {
  if (!version || os === 'unknown') return '/downloads';
  
  const finalArch = arch || detectArch();
  const platform = getPlatform(os);
  const extension = getExtension(os);
  
  return `${OSS_BASE_URL}/memfit/${version}/MemfitAI-${version}-${platform}-${finalArch}.${extension}`;
}

export function generateDownloadItemUrl(version: string, item: DownloadItem): string {
  if (!version || item.platform === 'unknown') return '/downloads';

  return `${OSS_BASE_URL}/memfit/${version}/MemfitAI-${version}-${item.platform}-${item.arch}.${item.extension}`;
}

export function getDownloadItemsForOS(os: OSType): DownloadItem[] {
  if (os === 'unknown') return [];

  return DOWNLOAD_ITEMS.filter((item) => item.platform === os);
}

/**
 * 获取当前系统的下载链接
 */
export async function getCurrentSystemDownloadUrl(): Promise<string> {
  try {
    const timestamp = Date.now();
    const response = await fetch(`${VERSION_URL}?t=${timestamp}`, { cache: 'no-store' });
    if (!response.ok) {
      return '/downloads';
    }
    const version = (await response.text()).trim();
    const os = detectOS();
    const arch = detectArch();
    
    return generateDownloadUrl(version, os, arch);
  } catch (error) {
    console.error('Failed to get download URL:', error);
    return '/downloads';
  }
}

/**
 * 获取当前系统的全部架构下载链接
 */
export async function getCurrentSystemDownloadOptions(): Promise<DownloadOption[]> {
  try {
    const timestamp = Date.now();
    const response = await fetch(`${VERSION_URL}?t=${timestamp}`, { cache: 'no-store' });
    if (!response.ok) {
      return [];
    }
    const version = (await response.text()).trim();
    const os = detectOS();

    return getDownloadItemsForOS(os).map((item) => ({
      ...item,
      url: generateDownloadItemUrl(version, item),
    }));
  } catch (error) {
    console.error('Failed to get download options:', error);
    return [];
  }
}

/**
 * 触发文件下载
 */
export async function triggerDownload() {
  const url = await getCurrentSystemDownloadUrl();
  
  // 如果无法生成下载链接，跳转到下载页面
  if (url === '/downloads') {
    window.location.href = '/downloads';
    return;
  }
  
  // 创建隐藏的 a 标签触发下载
  const link = document.createElement('a');
  link.href = url;
  link.download = '';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
