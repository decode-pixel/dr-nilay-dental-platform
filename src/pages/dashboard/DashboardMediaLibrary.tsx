import React, { useState, useEffect, useRef } from 'react';
import { MediaService, MediaFolder, MediaFile, MediaCategory } from '../../lib/mediaService';
import { useToast } from '../../components/ToastNotification';
import { logger } from '../../lib/logger';
import {
  Folder,
  File,
  Plus,
  Trash2,
  Copy,
  Check,
  Upload,
  Filter,
  Eye,
  FolderOpen,
  Image as ImageIcon,
  BookOpen,
  Stethoscope,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES: MediaCategory[] = [
  'Clinic',
  'Doctor',
  'Treatment',
  'Gallery',
  'Website',
  'Documents',
  'Patient Files',
  'X-rays'
];

export default function DashboardMediaLibrary() {
  const { showToast } = useToast();
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter selections
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory | 'All'>('All');

  // Create folder states
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Uploading states
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Copied URL state tracker
  const [copiedFileId, setCopiedFileId] = useState<string | null>(null);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const [folderList, fileList] = await Promise.all([
        MediaService.getFolders(),
        MediaService.getFiles(selectedFolderId, selectedCategory === 'All' ? undefined : selectedCategory)
      ]);
      setFolders(folderList);
      setFiles(fileList);
    } catch (err) {
      logger.error('Error loading media assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [selectedFolderId, selectedCategory]);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const folder = await MediaService.createFolder(newFolderName.trim(), selectedFolderId || undefined);
    if (folder) {
      showToast(`Folder "${newFolderName}" created.`, 'success');
      setNewFolderName('');
      setShowNewFolderForm(false);
      loadMedia();
    } else {
      showToast('Failed to create folder.', 'error');
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    let successCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      // Default category fallback based on active filter
      const targetCategory: MediaCategory = selectedCategory === 'All' ? 'Website' : selectedCategory;
      
      const record = await MediaService.uploadFile(file, selectedFolderId, targetCategory);
      if (record) {
        successCount++;
      }
    }

    setIsUploading(false);
    if (successCount > 0) {
      showToast(`Successfully uploaded ${successCount} file(s).`, 'success');
      loadMedia();
    } else {
      showToast('File upload failed.', 'error');
    }
  };

  const handleDeleteFile = async (file: MediaFile) => {
    if (!confirm(`Are you sure you want to delete "${file.name}"?`)) return;
    const ok = await MediaService.deleteFile(file.id, file.storage_path, file.webp_path, file.thumbnail_path);
    if (ok) {
      showToast('File deleted successfully.', 'info');
      loadMedia();
    } else {
      showToast('Failed to delete file.', 'error');
    }
  };

  const handleCopyLink = (file: MediaFile) => {
    navigator.clipboard.writeText(file.public_url);
    setCopiedFileId(file.id);
    showToast('Public link copied to clipboard!', 'success');
    setTimeout(() => setCopiedFileId(null), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-160px)] gap-6 text-gray-200 font-sans">
      
      {/* LEFT COLUMN: Folders Tree */}
      <div className="w-full lg:w-64 bg-white/5 border border-white/10 rounded-3xl p-4 flex flex-col shrink-0">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <FolderOpen className="w-4 h-4 text-violet-400" />
            Media Directories
          </h3>
          <button
            onClick={() => setShowNewFolderForm(!showNewFolderForm)}
            className="p-1 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
            title="New Folder"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {showNewFolderForm && (
          <form onSubmit={handleCreateFolder} className="mb-4 space-y-2">
            <input
              type="text"
              required
              placeholder="Folder Name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
            />
            <div className="flex justify-end gap-1.5">
              <button
                type="button"
                onClick={() => setShowNewFolderForm(false)}
                className="px-2.5 py-1 rounded bg-white/5 text-gray-400 text-[10px] font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-2.5 py-1 rounded bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-bold"
              >
                Create
              </button>
            </div>
          </form>
        )}

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          <button
            onClick={() => setSelectedFolderId(null)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
              selectedFolderId === null
                ? 'bg-violet-600/10 border border-violet-500/30 text-white shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <FolderOpen className="w-4 h-4 shrink-0 text-violet-400" />
            Root Directory
          </button>

          {folders.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFolderId(f.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                selectedFolderId === f.id
                  ? 'bg-violet-600/10 border border-violet-500/30 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Folder className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="truncate">{f.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT WORKSPACE: Category Filter & Upload & Files Grid */}
      <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col overflow-hidden">
        
        {/* Top: Category Tabs Row */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-4 overflow-x-auto shrink-0 text-[10px] font-bold">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-full border transition-all ${
              selectedCategory === 'All'
                ? 'bg-white/10 text-white border-white/20'
                : 'bg-transparent text-gray-400 border-transparent hover:text-white'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full border transition-all ${
                selectedCategory === cat
                  ? 'bg-violet-500/10 text-violet-300 border-violet-500/30'
                  : 'bg-transparent text-gray-400 border-transparent hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Action controls row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">
              Category: <strong className="text-white">{selectedCategory}</strong>
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-xs text-gray-500">{files.length} assets found</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleUploadFile}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-violet-950/40"
            >
              <Upload className="w-4 h-4" />
              {isUploading ? 'Compressing & Uploading...' : 'Upload Media'}
            </button>
          </div>
        </div>

        {/* Files Grid Viewport */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-1">
          {loading ? (
            <div className="text-xs text-gray-500 text-center py-20">Loading assets list...</div>
          ) : files.length === 0 ? (
            <div className="border border-dashed border-white/10 rounded-2xl p-16 flex flex-col items-center justify-center text-center text-gray-500">
              <File className="w-12 h-12 text-gray-600 mb-4 animate-pulse" />
              <p className="text-sm font-bold text-gray-400">This directory is empty</p>
              <p className="text-xs text-gray-600 mt-1 max-w-sm">
                Upload images or files here. Image uploads will automatically generate optimized WebP copies and mobile thumbnails.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((file) => {
                const isImage = file.mime_type.startsWith('image/');
                const thumbUrl = file.thumbnail_path
                  ? supabase.storage.from('media-library').getPublicUrl(file.thumbnail_path).data.publicUrl
                  : file.public_url;

                return (
                  <div
                    key={file.id}
                    className="group bg-white/5 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden flex flex-col relative transition-all"
                  >
                    {/* Media card thumbnail top box */}
                    <div className="w-full aspect-video bg-black/40 relative overflow-hidden flex items-center justify-center border-b border-white/5">
                      {isImage ? (
                        <img
                          src={thumbUrl}
                          alt={file.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="p-4 rounded-full bg-white/5 text-gray-400">
                          <File className="w-8 h-8" />
                        </div>
                      )}
                      
                      {/* Hover action overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleCopyLink(file)}
                          className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 hover:scale-105 transition-all"
                          title="Copy Link URL"
                        >
                          {copiedFileId === file.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                        
                        <a
                          href={file.public_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 hover:scale-105 transition-all"
                          title="Open original file"
                        >
                          <Eye className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => handleDeleteFile(file)}
                          className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/20 hover:bg-red-600/30 hover:scale-105 transition-all"
                          title="Delete Asset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata text bottom box */}
                    <div className="p-3 space-y-1">
                      <p className="text-xs font-bold text-white truncate" title={file.name}>
                        {file.name}
                      </p>
                      <div className="flex items-center justify-between text-[9px] text-gray-500">
                        <span>{(file.file_size / 1024).toFixed(1)} KB</span>
                        <span className="px-1.5 py-0.5 rounded bg-violet-600/10 text-violet-400 font-bold">
                          {file.category}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
