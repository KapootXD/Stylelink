/**
 * Image compression utility
 * Compresses and resizes images before upload to reduce file size and upload time
 */

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeMB?: number;
}

/**
 * Compress an image file
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise with compressed File
 */
export const compressImage = async (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    maxSizeMB = 2
  } = options;

  return new Promise((resolve, reject) => {
    // Check if file is already small enough
    if (file.size <= maxSizeMB * 1024 * 1024) {
      // File is already small, return as-is
      resolve(file);
      return;
    }

    // Add timeout to prevent hanging (30 seconds)
    const timeout = setTimeout(() => {
      reject(new Error('Image compression timed out. Using original file.'));
    }, 30000);

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;

        // Resize if needed
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = width * ratio;
          height = height * ratio;
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            // Create new file with compressed blob
            const compressedFile = new File(
              [blob],
              file.name,
              {
                type: file.type,
                lastModified: Date.now()
              }
            );

            // If still too large, reduce quality further
            if (compressedFile.size > maxSizeMB * 1024 * 1024 && quality > 0.5) {
              // Recursively compress with lower quality
              compressImage(compressedFile, {
                ...options,
                quality: quality * 0.8
              }).then((result) => {
                clearTimeout(timeout);
                resolve(result);
              }).catch((err) => {
                clearTimeout(timeout);
                reject(err);
              });
            } else {
              clearTimeout(timeout);
              resolve(compressedFile);
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Failed to load image'));
      };

      if (e.target?.result) {
        img.src = e.target.result as string;
      } else {
        clearTimeout(timeout);
        reject(new Error('Failed to read file'));
      }
    };

    reader.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Compress multiple image files
 * @param files - Array of image files to compress
 * @param options - Compression options
 * @param onProgress - Optional progress callback
 * @returns Promise with array of compressed files
 */
export const compressImages = async (
  files: File[],
  options: CompressionOptions = {},
  onProgress?: (progress: number) => void
): Promise<File[]> => {
  const compressedFiles: File[] = [];
  
  for (let i = 0; i < files.length; i++) {
    try {
      const compressed = await compressImage(files[i], options);
      compressedFiles.push(compressed);
      
      if (onProgress) {
        const progress = ((i + 1) / files.length) * 100;
        onProgress(progress);
      }
    } catch (error) {
      console.error(`Error compressing image ${i + 1}:`, error);
      // If compression fails, use original file
      compressedFiles.push(files[i]);
    }
  }
  
  return compressedFiles;
};

/**
 * Get file size in human-readable format
 */
export const getFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate file size
 */
export const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

/**
 * Validate image file type
 */
export const validateImageType = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  return validTypes.includes(file.type);
};

