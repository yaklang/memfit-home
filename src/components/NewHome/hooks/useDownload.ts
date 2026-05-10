import { useState, useEffect } from "react";
import {
  detectOS,
  getCurrentSystemDownloadOptions,
  type DownloadOption,
  type OSType,
} from "../utils/downloadHelper";
import { CONTENT, type Locale } from "../locales";

/**
 * 自定义 Hook - 处理下载相关逻辑
 */
export function useDownload(locale: Locale) {
  const [os, setOs] = useState<OSType>('unknown');
  const [downloadUrl, setDownloadUrl] = useState<string>('/downloads');
  const [downloadOptions, setDownloadOptions] = useState<DownloadOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const content = CONTENT[locale];

  useEffect(() => {
    const initDownload = async () => {
      try {
        // 检测操作系统
        const detectedOS = detectOS();
        setOs(detectedOS);
        
        // 获取当前系统下的全部架构下载链接
        const options = await getCurrentSystemDownloadOptions();
        setDownloadOptions(options);
        setDownloadUrl(options[0]?.url || '/downloads');
      } catch (error) {
        console.error('Failed to initialize download:', error);
        setDownloadUrl('/downloads');
        setDownloadOptions([]);
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
    downloadOptions,
    isLoading,
    buttonText: getDownloadButtonText(),
  };
}
