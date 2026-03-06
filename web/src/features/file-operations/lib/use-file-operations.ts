'use client';

import { useState, useCallback } from 'react';
import type { FileItem } from '@/shared/types';

interface UploadProgress {
  loaded: number;
  total: number;
  percent: number;
}

export function useFileOperations() {
  const [uploadedFiles, setUploadedFiles] = useState<FileItem[]>([]);
  const [downloadedFiles, setDownloadedFiles] = useState<FileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File) => {
    setIsUploading(true);
    setError(null);
    setUploadProgress({ loaded: 0, total: file.size, percent: 0 });

    try {
      // Simulated upload with progress
      const totalSteps = 10;
      for (let i = 1; i <= totalSteps; i++) {
        await new Promise((r) => setTimeout(r, 200));
        setUploadProgress({
          loaded: Math.floor((file.size * i) / totalSteps),
          total: file.size,
          percent: Math.floor((i / totalSteps) * 100),
        });
      }

      const newFile: FileItem = {
        id: `upload_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };

      setUploadedFiles((prev) => [newFile, ...prev]);
      return newFile;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setError(msg);
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  }, []);

  const downloadFile = useCallback(async (url: string, filename: string) => {
    setIsDownloading(true);
    setError(null);
    setDownloadProgress({ loaded: 0, total: 100, percent: 0 });

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);

      const contentLength = Number(response.headers.get('content-length')) || 0;
      const reader = response.body?.getReader();

      if (!reader) throw new Error('Cannot read response stream');

      const chunks: BlobPart[] = [];
      let loaded = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        const total = contentLength || loaded;
        setDownloadProgress({
          loaded,
          total,
          percent: contentLength ? Math.floor((loaded / total) * 100) : 50,
        });
      }

      const blob = new Blob(chunks);
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadProgress({ loaded, total: loaded, percent: 100 });

      const newFile: FileItem = {
        id: `download_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        name: filename,
        url: blobUrl,
        type: blob.type,
        size: blob.size,
        downloadedAt: new Date().toISOString(),
      };

      setDownloadedFiles((prev) => [newFile, ...prev]);
      return newFile;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Download failed';
      setError(msg);
      return null;
    } finally {
      setIsDownloading(false);
      setTimeout(() => setDownloadProgress(null), 1500);
    }
  }, []);

  const removeFile = useCallback((id: string, type: 'uploaded' | 'downloaded') => {
    if (type === 'uploaded') {
      setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
    } else {
      setDownloadedFiles((prev) => prev.filter((f) => f.id !== id));
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    uploadedFiles,
    downloadedFiles,
    isUploading,
    isDownloading,
    uploadProgress,
    downloadProgress,
    error,
    uploadFile,
    downloadFile,
    removeFile,
    clearError,
  };
}
