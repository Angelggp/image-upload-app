export interface ImageData {
  id: string
  file_url: string
  filename: string
  size: number
  created_at: string
}

export interface UploadState {
  isUploading: boolean
  progress: number
  error: string | null
  imageData: ImageData | null
}

export type Theme = 'light' | 'dark'

export interface FileValidationResult {
  valid: boolean
  error?: string
}