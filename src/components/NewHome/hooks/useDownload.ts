import { useState, useEffect } from "react";
import { detectOS, getCurrentSystemDownloadUrl, type OSType } from "../utils/downloadHelper";
import { CONTENT, type Locale } from "../locales";

/**
 * 自定义 Hook - 处理下载相关逻辑
 */
export function useDownload(locale: Locale) {
  const [os, setOs] = useState<OSType>('unknown');
  const [downloadUrl, setDownloadUrl] = useState<string>('/downloads');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const content = CONTENT[locale];

  useEffect(() => {
    const initDownload = async () => {
      try {
        // 检测操作系统
        const detectedOS = detectOS();
        setOs(detectedOS);
        
        // 获取下载链接
        const url = await getCurrentSystemDownloadUrl();
        setDownloadUrl(url);
      } catch (error) {
        console.error('Failed to initialize download:', error);
        setDownloadUrl('/downloads');
      } finally {
        setIsLoading(false);
      }
    };

    initDownload();
  }, []);

  // 根据操作系统获取按钮文本
  const getDownloadButtonText = () => {
    switch (os) {
      case 'darwin':
        return content.buttons.downloadMac;
      case 'linux':
        return content.buttons.downloadLinux;
      case 'windows':
        return content.buttons.downloadWindows;
      default:
        return content.buttons.downloadMac;
    }
  };

  return {
    os,
    downloadUrl,
    isLoading,
    buttonText: getDownloadButtonText(),
  };
}
