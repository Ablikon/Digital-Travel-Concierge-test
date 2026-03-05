import { useState } from 'react';
import { View, Text, Pressable, FlatList, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFileOperations } from '@/features/file-operations';
import { useNotifications } from '@/features/notifications';
import { Spinner, EmptyState } from '@/shared/ui';
import type { FileItem } from '@/shared/types';

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

function getFileIcon(type: string): React.ReactNode {
  if (type.startsWith('image/')) {
    return <Ionicons name="image-outline" size={24} color="#4F46E5" />;
  }
  if (type.includes('pdf')) {
    return <AntDesign name="file-pdf" size={24} color="#EF4444" />;
  }
  return <MaterialCommunityIcons name="file-document-outline" size={24} color="#64748B" />;
}

export default function FilesScreen() {
  const {
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
  } = useFileOperations();

  const { sendLocalNotification } = useNotifications();
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [downloadFilename, setDownloadFilename] = useState('');

  function handleUploadPress() {
    Alert.alert('Upload File', 'Choose a source', [
      {
        text: 'Photo Library',
        onPress: async () => {
          const result = await pickImage();
          if (result) {
            sendLocalNotification('File Uploaded', `${result.name} uploaded successfully`);
          }
        },
      },
      {
        text: 'Document',
        onPress: async () => {
          const result = await pickDocument();
          if (result) {
            sendLocalNotification('File Uploaded', `${result.name} uploaded successfully`);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  async function handleDownload() {
    if (!downloadUrl.trim()) {
      Alert.alert('Error', 'Please enter a valid URL');
      return;
    }

    const filename = downloadFilename.trim() || `download_${Date.now()}`;
    setShowDownloadModal(false);

    const result = await downloadFile(downloadUrl.trim(), filename);
    if (result) {
      sendLocalNotification('Download Complete', `${result.name} has been downloaded`);
    }

    setDownloadUrl('');
    setDownloadFilename('');
  }

  function handleDeleteFile(file: FileItem) {
    Alert.alert('Delete File', `Delete "${file.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteFile(file.id) },
    ]);
  }

  function renderFileItem({ item }: { item: FileItem }) {
    const dateLabel = item.uploadedAt ? 'Uploaded' : 'Downloaded';
    const dateValue = item.uploadedAt || item.downloadedAt || '';

    return (
      <View
        className="mb-3 flex-row items-center rounded-xl bg-white p-4"
        style={{
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View className="mr-3.5 h-12 w-12 items-center justify-center rounded-xl bg-neutral-50">
          {getFileIcon(item.type)}
        </View>

        <View className="flex-1">
          <Text className="text-sm font-semibold text-neutral-800" numberOfLines={1}>
            {item.name}
          </Text>
          <View className="mt-1 flex-row items-center">
            <Text className="text-xs text-neutral-400">{formatFileSize(item.size)}</Text>
            {dateValue && (
              <>
                <Text className="mx-1.5 text-neutral-300">·</Text>
                <Text className="text-xs text-neutral-400">{dateLabel}</Text>
              </>
            )}
          </View>
        </View>

        <View className="flex-row">
          <Pressable
            onPress={() => shareFile(item.uri)}
            className="mr-1 h-9 w-9 items-center justify-center rounded-full active:bg-neutral-100"
          >
            <Ionicons name="share-outline" size={18} color="#64748B" />
          </Pressable>
          <Pressable
            onPress={() => handleDeleteFile(item)}
            className="h-9 w-9 items-center justify-center rounded-full active:bg-neutral-100"
          >
            <AntDesign name="delete" size={16} color="#EF4444" />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-secondary" edges={['top']}>
      {/* Header */}
      <View className="border-b border-neutral-100 bg-white px-5 py-5">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-neutral-800">Files</Text>
            <Text className="mt-0.5 text-xs text-neutral-400">Upload and manage files</Text>
          </View>
          {files.length > 0 && (
            <View className="rounded-full bg-primary-50 px-3 py-1.5">
              <Text className="text-xs font-bold text-primary-600">{files.length} files</Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row px-4 py-4">
        <Pressable
          onPress={handleUploadPress}
          disabled={isUploading}
          className="mr-3 flex-1 flex-row items-center justify-center rounded-xl bg-primary-600 py-3.5 active:bg-primary-700"
        >
          {isUploading ? (
            <Spinner size="small" color="#FFFFFF" />
          ) : (
            <>
              <AntDesign name="upload" size={16} color="#FFFFFF" />
              <Text className="ml-2 text-sm font-semibold text-white">Upload</Text>
            </>
          )}
        </Pressable>

        <Pressable
          onPress={() => setShowDownloadModal(true)}
          disabled={isDownloading}
          className="flex-1 flex-row items-center justify-center rounded-xl border border-primary-200 bg-primary-50 py-3.5 active:bg-primary-100"
        >
          {isDownloading ? (
            <View className="flex-row items-center">
              <Spinner size="small" color="#4F46E5" />
              <Text className="ml-2 text-sm font-semibold text-primary-600">
                {downloadProgress}%
              </Text>
            </View>
          ) : (
            <>
              <AntDesign name="download" size={16} color="#4F46E5" />
              <Text className="ml-2 text-sm font-semibold text-primary-600">Download</Text>
            </>
          )}
        </Pressable>
      </View>

      {/* Error Banner */}
      {error && (
        <Pressable
          onPress={clearError}
          className="mx-4 mb-3 flex-row items-center rounded-xl bg-red-50 px-4 py-3"
        >
          <AntDesign name="exclamation-circle" size={16} color="#EF4444" />
          <Text className="ml-2 flex-1 text-xs text-red-600">{error}</Text>
          <AntDesign name="close" size={14} color="#EF4444" />
        </Pressable>
      )}

      {/* File List */}
      {files.length === 0 ? (
        <EmptyState
          icon="folder-open"
          title="No files yet"
          description="Upload photos, documents, or download files from the web"
        />
      ) : (
        <FlatList
          data={files}
          renderItem={renderFileItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Download Modal */}
      <Modal
        visible={showDownloadModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDownloadModal(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-3xl bg-white px-5 pb-10 pt-6">
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-neutral-800">Download File</Text>
              <Pressable onPress={() => setShowDownloadModal(false)}>
                <AntDesign name="close" size={20} color="#64748B" />
              </Pressable>
            </View>

            <Text className="mb-2 text-xs font-semibold text-neutral-500">File URL</Text>
            <TextInput
              value={downloadUrl}
              onChangeText={setDownloadUrl}
              placeholder="https://example.com/file.pdf"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              className="mb-4 rounded-xl border border-neutral-200 px-4 py-3.5 text-sm text-neutral-800"
            />

            <Text className="mb-2 text-xs font-semibold text-neutral-500">
              Filename (optional)
            </Text>
            <TextInput
              value={downloadFilename}
              onChangeText={setDownloadFilename}
              placeholder="my-file.pdf"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              className="mb-6 rounded-xl border border-neutral-200 px-4 py-3.5 text-sm text-neutral-800"
            />

            <Pressable
              onPress={handleDownload}
              className="flex-row items-center justify-center rounded-xl bg-primary-600 py-4 active:bg-primary-700"
            >
              <AntDesign name="download" size={16} color="#FFFFFF" />
              <Text className="ml-2 text-base font-semibold text-white">Download</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
