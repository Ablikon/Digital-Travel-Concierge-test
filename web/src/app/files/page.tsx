'use client';

import { useState, useRef } from 'react';
import {
  Upload,
  Download,
  Trash2,
  File,
  Image as ImageIcon,
  FileText,
  FolderOpen,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useFileOperations } from '@/features/file-operations/lib';

const SAMPLE_DOWNLOADS = [
  {
    name: 'sample-image.jpg',
    url: 'https://picsum.photos/800/600',
    type: 'image',
  },
  {
    name: 'sample-document.json',
    url: 'https://jsonplaceholder.typicode.com/posts',
    type: 'document',
  },
  {
    name: 'sample-data.json',
    url: 'https://jsonplaceholder.typicode.com/users',
    type: 'document',
  },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string) {
  if (type.startsWith('image')) return ImageIcon;
  if (type.includes('pdf') || type.includes('document')) return FileText;
  return File;
}

export default function FilesPage() {
  const {
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
  } = useFileOperations();

  const [downloadUrl, setDownloadUrl] = useState('');
  const [downloadName, setDownloadName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i]);
    }
    e.target.value = '';
  };

  const handleCustomDownload = async () => {
    if (!downloadUrl) return;
    const name = downloadName || downloadUrl.split('/').pop() || 'download';
    await downloadFile(downloadUrl, name);
    setDownloadUrl('');
    setDownloadName('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">File Manager</h1>
        <p className="mt-2 text-muted-foreground">
          Upload files from your device or download files from the web.
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <p className="flex-1 text-sm text-red-700">{error}</p>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={clearError}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              Upload Files
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/20 p-8 transition-colors hover:border-blue-400 hover:bg-blue-50/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Click to select files</p>
                <p className="text-xs text-muted-foreground">
                  Images, documents, or any file type
                </p>
              </div>
            </div>

            {isUploading && uploadProgress && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress.percent}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${uploadProgress.percent}%` }}
                  />
                </div>
              </div>
            )}

            {uploadedFiles.length > 0 && (
              <>
                <Separator />
                <h4 className="text-sm font-medium text-muted-foreground">
                  Uploaded ({uploadedFiles.length})
                </h4>
                <div className="space-y-2">
                  {uploadedFiles.map((file) => {
                    const Icon = getFileIcon(file.type);
                    return (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => removeFile(file.id, 'uploaded')}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Download Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-green-600" />
              Download Files
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
              <h4 className="text-sm font-medium">Custom Download</h4>
              <Input
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                placeholder="https://example.com/file.pdf"
              />
              <Input
                value={downloadName}
                onChange={(e) => setDownloadName(e.target.value)}
                placeholder="File name (optional)"
              />
              <Button
                onClick={handleCustomDownload}
                disabled={!downloadUrl || isDownloading}
                className="w-full gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>

            {isDownloading && downloadProgress && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Downloading...</span>
                  <span>{downloadProgress.percent}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-green-600 transition-all duration-300"
                    style={{ width: `${downloadProgress.percent}%` }}
                  />
                </div>
              </div>
            )}

            <Separator />

            <h4 className="text-sm font-medium text-muted-foreground">Quick Download</h4>
            <div className="space-y-2">
              {SAMPLE_DOWNLOADS.map((sample) => (
                <div
                  key={sample.name}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    {sample.type === 'image' ? (
                      <ImageIcon className="h-5 w-5 text-purple-500" />
                    ) : (
                      <FileText className="h-5 w-5 text-orange-500" />
                    )}
                    <span className="text-sm font-medium">{sample.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isDownloading}
                    onClick={() => downloadFile(sample.url, sample.name)}
                    className="gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                </div>
              ))}
            </div>

            {downloadedFiles.length > 0 && (
              <>
                <Separator />
                <h4 className="text-sm font-medium text-muted-foreground">
                  Downloaded ({downloadedFiles.length})
                </h4>
                <div className="space-y-2">
                  {downloadedFiles.map((file) => {
                    const Icon = getFileIcon(file.type);
                    return (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <Icon className="h-5 w-5 shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Done
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => removeFile(file.id, 'downloaded')}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {uploadedFiles.length === 0 && downloadedFiles.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-8">
                <FolderOpen className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No files yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
