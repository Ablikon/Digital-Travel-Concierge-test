import { useState, useCallback } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import type { FileItem } from '@/shared/types';

interface DownloadProgress {
  totalBytesWritten: number;
  totalBytesExpectedToWrite: number;
}

export function useFileOperations() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const pickImage = useCallback(async (): Promise<FileItem | null> => {
    try {
      setIsUploading(true);
      setError(null);

      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError('Permission to access media library is required');
        setIsUploading(false);
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled || !result.assets[0]) {
        setIsUploading(false);
        return null;
      }

      const asset = result.assets[0];
      let fileSize = 0;
      try {
        const fileInfo = await FileSystem.getInfoAsync(asset.uri);
        if (fileInfo.exists && 'size' in fileInfo) {
          fileSize = (fileInfo as any).size || 0;
        }
      } catch {
        // getInfoAsync can fail on some URIs in Expo Go
      }

      const fileItem: FileItem = {
        id: Date.now().toString(),
        name: asset.fileName || `image_${Date.now()}.jpg`,
        uri: asset.uri,
        type: asset.mimeType || 'image/jpeg',
        size: asset.fileSize || fileSize,
        uploadedAt: new Date().toISOString(),
      };

      setFiles((prev) => [fileItem, ...prev]);
      setIsUploading(false);
      return fileItem;
    } catch {
      setError('Failed to pick image');
      setIsUploading(false);
      return null;
    }
  }, []);

  const pickDocument = useCallback(async (): Promise<FileItem | null> => {
    try {
      setIsUploading(true);
      setError(null);

      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets[0]) {
        setIsUploading(false);
        return null;
      }

      const asset = result.assets[0];

      const fileItem: FileItem = {
        id: Date.now().toString(),
        name: asset.name,
        uri: asset.uri,
        type: asset.mimeType || 'application/octet-stream',
        size: asset.size || 0,
        uploadedAt: new Date().toISOString(),
      };

      setFiles((prev) => [fileItem, ...prev]);
      setIsUploading(false);
      return fileItem;
    } catch {
      setError('Failed to pick document');
      setIsUploading(false);
      return null;
    }
  }, []);

  const downloadFile = useCallback(
    async (url: string, filename: string): Promise<FileItem | null> => {
      try {
        setIsDownloading(true);
        setDownloadProgress(0);
        setError(null);

        const baseDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;
        if (!baseDir) {
          throw new Error('File system not available');
        }

        const fileUri = `${baseDir}${filename}`;

        const downloadResult = await FileSystem.downloadAsync(url, fileUri);

        if (!downloadResult || downloadResult.status !== 200) {
          throw new Error(`Download failed with status ${downloadResult?.status}`);
        }

        setDownloadProgress(100);

        let fileSize = 0;
        try {
          const fileInfo = await FileSystem.getInfoAsync(downloadResult.uri);
          if (fileInfo.exists && 'size' in fileInfo) {
            fileSize = (fileInfo as any).size || 0;
          }
        } catch {
          // size check optional
        }

        const fileItem: FileItem = {
          id: Date.now().toString(),
          name: filename,
          uri: downloadResult.uri,
          type: downloadResult.headers['content-type'] || 'application/octet-stream',
          size: fileSize,
          downloadedAt: new Date().toISOString(),
        };

        setFiles((prev) => [fileItem, ...prev]);
        setIsDownloading(false);
        setDownloadProgress(0);
        return fileItem;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        setError(`Download failed: ${msg}`);
        setIsDownloading(false);
        setDownloadProgress(0);
        return null;
      }
    },
    []
  );

  const shareFile = useCallback(async (uri: string) => {
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        setError('Sharing is not available on this device');
        return;
      }
      await Sharing.shareAsync(uri);
    } catch {
      setError('Failed to share file');
    }
  }, []);

  const deleteFile = useCallback(
    async (fileId: string) => {
      const file = files.find((f) => f.id === fileId);
      if (file) {
        try {
          await FileSystem.deleteAsync(file.uri, { idempotent: true });
        } catch {
          // File might already be deleted
        }
      }
      setFiles((prev) => prev.filter((f) => f.id !== fileId));
    },
    [files]
  );

  function clearError() {
    setError(null);
  }

  return {
    files,
    isUploading,
    isDownloading,
    downloadProgress,
    error,
    pickImage,
    pickDocument,
    downloadFile,
    shareFile,
    deleteFile,
    clearError,
  };
}
