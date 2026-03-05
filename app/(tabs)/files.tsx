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

function getFileIcon(type: string): { icon: React.ReactNode; bg: string } {
  if (type.startsWith('image/')) {
    return {
      icon: <Ionicons name="image" size={20} color="#4F46E5" />,
      bg: '#EEF2FF',
    };
  }
  if (type.includes('pdf')) {
    return {
      icon: <AntDesign name="file-pdf" size={20} color="#EF4444" />,
      bg: '#FEF2F2',
    };
  }
  return {
    icon: <MaterialCommunityIcons name="file-document-outline" size={20} color="#64748B" />,
    bg: '#F1F5F9',
  };
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

  const sampleFiles = [
    { url: 'https://picsum.photos/800/600.jpg', name: 'sample-image.jpg' },
    { url: 'https://httpbin.org/image/jpeg', name: 'sample-photo.jpg' },
  ];

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
    const { icon, bg } = getFileIcon(item.type);

    return (
      <View
        className="mb-3 flex-row items-center rounded-2xl bg-white p-4"
        style={{
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <View
          className="mr-3.5 h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: bg }}
        >
          {icon}
        </View>

        <View className="flex-1">
          <Text className="text-[13px] font-semibold text-neutral-800" numberOfLines={1}>
            {item.name}
          </Text>
          <View className="mt-1 flex-row items-center">
            <Text className="text-[11px] text-neutral-400">{formatFileSize(item.size)}</Text>
            {dateValue && (
              <>
                <Text className="mx-1.5 text-neutral-200">|</Text>
                <Text className="text-[11px] text-neutral-400">{dateLabel}</Text>
              </>
            )}
          </View>
        </View>

        <View className="flex-row">
          <Pressable
            onPress={() => shareFile(item.uri)}
            className="mr-1 h-8 w-8 items-center justify-center rounded-lg bg-neutral-50 active:bg-neutral-100"
          >
            <Ionicons name="share-outline" size={16} color="#64748B" />
          </Pressable>
          <Pressable
            onPress={() => handleDeleteFile(item)}
            className="h-8 w-8 items-center justify-center rounded-lg bg-red-50 active:bg-red-100"
          >
            <AntDesign name="delete" size={14} color="#EF4444" />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50" edges={['top']}>
      <View className="bg-white px-5 pb-4 pt-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-[26px] font-extrabold tracking-tight text-neutral-900">
              Files
            </Text>
            <Text className="mt-0.5 text-[13px] text-neutral-400">
              Upload and manage files
            </Text>
          </View>
          {files.length > 0 && (
            <View className="rounded-full bg-primary-50 px-3 py-1.5">
              <Text className="text-[11px] font-bold text-primary-600">
                {files.length} files
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.04)' }} />

      <View className="flex-row px-4 py-4">
        <Pressable
          onPress={handleUploadPress}
          disabled={isUploading}
          className="mr-3 flex-1 flex-row items-center justify-center rounded-2xl bg-primary-600 py-3.5 active:bg-primary-700"
          style={{
            shadowColor: '#4F46E5',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          {isUploading ? (
            <Spinner size="small" color="#FFFFFF" />
          ) : (
            <>
              <AntDesign name="upload" size={16} color="#FFFFFF" />
              <Text className="ml-2 text-[14px] font-semibold text-white">Upload</Text>
            </>
          )}
        </Pressable>

        <Pressable
          onPress={() => setShowDownloadModal(true)}
          disabled={isDownloading}
          className="flex-1 flex-row items-center justify-center rounded-2xl border border-primary-100 bg-primary-50 py-3.5 active:bg-primary-100"
        >
          {isDownloading ? (
            <View className="flex-row items-center">
              <Spinner size="small" color="#4F46E5" />
              <Text className="ml-2 text-[14px] font-semibold text-primary-600">
                {downloadProgress}%
              </Text>
            </View>
          ) : (
            <>
              <AntDesign name="download" size={16} color="#4F46E5" />
              <Text className="ml-2 text-[14px] font-semibold text-primary-600">Download</Text>
            </>
          )}
        </Pressable>
      </View>

      {error && (
        <Pressable
          onPress={clearError}
          className="mx-4 mb-3 flex-row items-center rounded-xl bg-red-50 px-4 py-3"
        >
          <AntDesign name="exclamation-circle" size={14} color="#EF4444" />
          <Text className="ml-2 flex-1 text-[12px] text-red-600">{error}</Text>
          <AntDesign name="close" size={14} color="#EF4444" />
        </Pressable>
      )}

      {files.length === 0 ? (
        <View className="flex-1">
          <View className="mx-4 mb-4 rounded-2xl bg-white p-4" style={{ shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
            <Text className="mb-3 text-[12px] font-bold uppercase tracking-wider text-neutral-400">
              Quick Download
            </Text>
            {sampleFiles.map((sample) => (
              <Pressable
                key={sample.name}
                onPress={async () => {
                  const result = await downloadFile(sample.url, sample.name);
                  if (result) {
                    sendLocalNotification('Download Complete', `${result.name} has been downloaded`);
                  }
                }}
                disabled={isDownloading}
                className="mb-2 flex-row items-center rounded-xl bg-neutral-50 px-4 py-3 active:bg-neutral-100"
              >
                <Ionicons name="cloud-download-outline" size={18} color="#4F46E5" />
                <View className="ml-3 flex-1">
                  <Text className="text-[13px] font-semibold text-neutral-700">{sample.name}</Text>
                  <Text className="text-[11px] text-neutral-400" numberOfLines={1}>{sample.url}</Text>
                </View>
                <AntDesign name="download" size={14} color="#94A3B8" />
              </Pressable>
            ))}
          </View>
          <EmptyState
            icon="folder-open"
            title="No files yet"
            description="Upload photos, documents, or download files from the web"
          />
        </View>
      ) : (
        <FlatList
          data={files}
          renderItem={renderFileItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={showDownloadModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDownloadModal(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-3xl bg-white px-5 pb-10 pt-6">
            <View className="mb-1 items-center">
              <View className="h-1 w-10 rounded-full bg-neutral-200" />
            </View>
            <View className="mb-6 mt-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-neutral-800">Download File</Text>
              <Pressable
                onPress={() => setShowDownloadModal(false)}
                className="h-8 w-8 items-center justify-center rounded-full bg-neutral-100"
              >
                <AntDesign name="close" size={14} color="#64748B" />
              </Pressable>
            </View>

            <Text className="mb-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              File URL
            </Text>
            <TextInput
              value={downloadUrl}
              onChangeText={setDownloadUrl}
              placeholder="https://example.com/file.pdf"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              className="mb-4 rounded-2xl bg-neutral-100 px-4 py-3.5 text-[14px] text-neutral-800"
            />

            <Text className="mb-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Filename (optional)
            </Text>
            <TextInput
              value={downloadFilename}
              onChangeText={setDownloadFilename}
              placeholder="my-file.pdf"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              className="mb-6 rounded-2xl bg-neutral-100 px-4 py-3.5 text-[14px] text-neutral-800"
            />

            <Pressable
              onPress={handleDownload}
              className="flex-row items-center justify-center rounded-2xl bg-primary-600 py-4 active:bg-primary-700"
              style={{
                shadowColor: '#4F46E5',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <AntDesign name="download" size={16} color="#FFFFFF" />
              <Text className="ml-2 text-[15px] font-semibold text-white">Download</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
