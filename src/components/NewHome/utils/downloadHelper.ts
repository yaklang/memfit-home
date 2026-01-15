// 下载辅助工具

const OSS_BASE_URL = 'https://oss-qn.yaklang.com';
const VERSION_URL = `${OSS_BASE_URL}/memfit/latest/yakit-version.txt`;

export type OSType = 'darwin' | 'linux' | 'windows' | 'unknown';

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
export function detectArch(): 'arm64' | 'amd64' | 'x64' {
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

/**
 * 获取当前系统的下载链接
 */
export async function getCurrentSystemDownloadUrl(): Promise<string> {
  try {
    const response = await fetch(VERSION_URL);
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
