import { useState, useCallback } from 'react';
import {
  documentDirectory,
  getInfoAsync,
  deleteAsync,
  createDownloadResumable,
} from 'expo-file-system/legacy';
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
      const fileInfo = await getInfoAsync(asset.uri);

      const fileItem: FileItem = {
        id: Date.now().toString(),
        name: asset.fileName || `image_${Date.now()}.jpg`,
        uri: asset.uri,
        type: asset.mimeType || 'image/jpeg',
        size: fileInfo.exists ? (fileInfo as any).size || 0 : 0,
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

        const fileUri = `${documentDirectory}${filename}`;

        const downloadResumable = createDownloadResumable(
          url,
          fileUri,
          {},
          (progress: DownloadProgress) => {
            const pct = progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
            setDownloadProgress(Math.round(pct * 100));
          }
        );

        const result = await downloadResumable.downloadAsync();
        if (!result) {
          throw new Error('Download failed');
        }

        const fileInfo = await getInfoAsync(result.uri);

        const fileItem: FileItem = {
          id: Date.now().toString(),
          name: filename,
          uri: result.uri,
          type: result.headers['content-type'] || 'application/octet-stream',
          size: fileInfo.exists ? (fileInfo as any).size || 0 : 0,
          downloadedAt: new Date().toISOString(),
        };

        setFiles((prev) => [fileItem, ...prev]);
        setIsDownloading(false);
        setDownloadProgress(0);
        return fileItem;
      } catch {
        setError('Failed to download file. Please check the URL and try again.');
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
          await deleteAsync(file.uri, { idempotent: true });
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
