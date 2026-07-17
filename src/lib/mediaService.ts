import { supabase } from './supabase';
import { logger } from './logger';

export type MediaCategory = 'Clinic' | 'Doctor' | 'Treatment' | 'Gallery' | 'Website' | 'Documents' | 'Patient Files' | 'X-rays';

export interface MediaFolder {
  id: string;
  name: string;
  parent_id?: string;
  created_at: string;
}

export interface MediaFile {
  id: string;
  folder_id?: string;
  category: MediaCategory;
  name: string;
  original_filename?: string;
  storage_bucket: string;
  storage_path: string;
  webp_path?: string;
  thumbnail_path?: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  alt_text?: string;
  public_url: string;
  checksum?: string;
  version: number;
  is_public: boolean;
  uploaded_by?: string;
  created_by?: string;
  created_at: string;
}

/**
 * Image compressor using HTML5 canvas.
 */
async function processImage(file: File, maxWidth?: number, quality: number = 0.8): Promise<Blob | null> {
  if (typeof window === 'undefined' || !file.type.startsWith('image/')) return null;
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (maxWidth && width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => resolve(blob), 'image/webp', quality);
        } catch (e) {
          logger.error('Canvas processing error:', e);
          resolve(null);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * SHA-256 Web Crypto API hash generator.
 */
async function getFileChecksum(file: File): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    return 'chk-' + Date.now();
  }
  try {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return 'chk-' + Date.now();
  }
}

/**
 * MediaRepository handles storage and metadata mapping transactions.
 */
export const MediaRepository = {
  async getFolders(): Promise<MediaFolder[]> {
    const { data, error } = await supabase
      .from('media_folders')
      .select('*')
      .order('name', { ascending: true });
    if (error) {
      logger.error('Error fetching folders:', error);
      throw error;
    }
    return data || [];
  },

  async createFolder(name: string, parentId?: string): Promise<MediaFolder> {
    const { data, error } = await supabase
      .from('media_folders')
      .insert({ name, parent_id: parentId || null })
      .select()
      .single();
    if (error) {
      logger.error('Error creating folder:', error);
      throw error;
    }
    return data;
  },

  async deleteFolder(folderId: string): Promise<void> {
    const { error } = await supabase
      .from('media_folders')
      .delete()
      .eq('id', folderId);
    if (error) {
      logger.error(`Error deleting folder ${folderId}:`, error);
      throw error;
    }
  },

  async getFiles(folderId?: string | null, category?: MediaCategory): Promise<MediaFile[]> {
    let query = supabase.from('media_files').select('*');
    if (folderId !== undefined) {
      if (folderId === null) {
        query = query.is('folder_id', null);
      } else {
        query = query.eq('folder_id', folderId);
      }
    }
    if (category) {
      query = query.eq('category', category);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      logger.error('Error fetching files:', error);
      throw error;
    }
    return data || [];
  },

  async uploadStorageObject(bucket: string, path: string, blob: Blob | File): Promise<string> {
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, blob, {
        cacheControl: '31536000',
        upsert: true
      });
    if (error) {
      logger.error(`Error uploading storage object to ${path}:`, error);
      throw error;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  async deleteStorageObject(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) {
      logger.error(`Error removing storage object ${path}:`, error);
    }
  },

  async saveFileMetadata(metadata: Partial<MediaFile>): Promise<MediaFile> {
    const { data, error } = await supabase
      .from('media_files')
      .insert(metadata)
      .select()
      .single();
    if (error) {
      logger.error('Error inserting file metadata record:', error);
      throw error;
    }
    return data;
  },

  async deleteFileRecord(fileId: string): Promise<void> {
    const { error } = await supabase
      .from('media_files')
      .delete()
      .eq('id', fileId);
    if (error) {
      logger.error(`Error deleting file record ${fileId}:`, error);
      throw error;
    }
  }
};

/**
 * MediaService provides optimized dynamic upload flow.
 */
export const MediaService = {
  async getFolders(): Promise<MediaFolder[]> {
    try {
      return await MediaRepository.getFolders();
    } catch {
      return [];
    }
  },

  async createFolder(name: string, parentId?: string): Promise<MediaFolder | null> {
    try {
      return await MediaRepository.createFolder(name, parentId);
    } catch {
      return null;
    }
  },

  async getFiles(folderId?: string | null, category?: MediaCategory): Promise<MediaFile[]> {
    try {
      return await MediaRepository.getFiles(folderId, category);
    } catch {
      return [];
    }
  },

  async uploadFile(
    file: File,
    folderId?: string | null,
    category: MediaCategory = 'Website',
    userId?: string
  ): Promise<MediaFile | null> {
    try {
      const checksum = await getFileChecksum(file);
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const uniqueBase = `${timestamp}_${sanitizedName}`;

      // 1. Upload original unmodified file
      const originalPath = `uploads/originals/${uniqueBase}`;
      const originalPublicUrl = await MediaRepository.uploadStorageObject('media-library', originalPath, file);

      let webpPath: string | undefined = undefined;
      let thumbnailPath: string | undefined = undefined;

      // 2. Perform client-side WebP transcode and upload if file is an image
      if (file.type.startsWith('image/')) {
        const webpBlob = await processImage(file, 1600, 0.85); // Optimized WebP image
        if (webpBlob) {
          const path = `uploads/webp/${timestamp}_${uniqueBase.split('.')[0]}.webp`;
          await MediaRepository.uploadStorageObject('media-library', path, webpBlob);
          webpPath = path;
        }

        const thumbBlob = await processImage(file, 200, 0.7); // Micro thumbnail
        if (thumbBlob) {
          const path = `uploads/thumbnails/${timestamp}_${uniqueBase.split('.')[0]}_thumb.webp`;
          await MediaRepository.uploadStorageObject('media-library', path, thumbBlob);
          thumbnailPath = path;
        }
      }

      // 3. Save database metadata
      const record = await MediaRepository.saveFileMetadata({
        folder_id: folderId || undefined,
        category,
        name: file.name,
        original_filename: file.name,
        storage_bucket: 'media-library',
        storage_path: originalPath,
        webp_path: webpPath,
        thumbnail_path: thumbnailPath,
        file_size: file.size,
        mime_type: file.type,
        public_url: originalPublicUrl,
        checksum,
        version: 1,
        is_public: true,
        uploaded_by: userId,
        created_by: userId
      });

      return record;
    } catch (err) {
      logger.error('Error during media upload orchestration:', err);
      return null;
    }
  },

  async deleteFile(fileId: string, originalPath: string, webpPath?: string, thumbnailPath?: string): Promise<boolean> {
    try {
      // 1. Remove storage objects from bucket
      await MediaRepository.deleteStorageObject('media-library', originalPath);
      if (webpPath) {
        await MediaRepository.deleteStorageObject('media-library', webpPath);
      }
      if (thumbnailPath) {
        await MediaRepository.deleteStorageObject('media-library', thumbnailPath);
      }

      // 2. Delete database record
      await MediaRepository.deleteFileRecord(fileId);
      return true;
    } catch (err) {
      logger.error(`Error deleting file ${fileId}:`, err);
      return false;
    }
  }
};
