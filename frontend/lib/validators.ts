import { FILE_CONSTRAINTS } from '@/config/constants'
import { FileValidationResult } from '@/types'

export function validateFile(file: File): FileValidationResult {
  // Validar tipo de archivo
  if (!FILE_CONSTRAINTS.ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPG, PNG, and GIF are allowed.',
    }
  }

  // Validar tamaño
  if (file.size > FILE_CONSTRAINTS.MAX_SIZE) {
    const maxSizeMB = FILE_CONSTRAINTS.MAX_SIZE / (1024 * 1024)
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit.`,
    }
  }

  return { valid: true }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`
}