export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const FILE_CONSTRAINTS = {
  MAX_SIZE: 2 * 1024 * 1024, // 2MB in bytes
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif'],
}

export const MESSAGES = {
  UPLOAD_SUCCESS: 'Image uploaded successfully!',
  UPLOAD_ERROR: 'Failed to upload image. Please try again.',
  INVALID_TYPE: 'Invalid file type. Only JPG, PNG, and GIF are allowed.',
  FILE_TOO_LARGE: 'File size exceeds 2MB limit.',
  COPY_SUCCESS: 'Link copied to clipboard!',
  COPY_ERROR: 'Failed to copy link.',
  DOWNLOAD_ERROR: 'Failed to download image.',
}