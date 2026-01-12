'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import { FILE_CONSTRAINTS } from '@/config/constants'
import { validateFile } from '@/lib/validators'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  onError: (error: string) => void
  disabled?: boolean
}

export function UploadZone({ onFileSelect, onError, disabled }: UploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]
      const validation = validateFile(file)

      if (!validation.valid) {
        onError(validation.error || 'Invalid file')
        return
      }

      onFileSelect(file)
    },
    [onFileSelect, onError]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    },
    maxSize: FILE_CONSTRAINTS.MAX_SIZE,
    multiple: false,
    disabled,
  })

  return (
    <div
      {...getRootProps()}
      className={`
        upload-zone
        ${isDragActive ? 'upload-zone-active' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="icon-container mb-6">
        <Upload className="w-6 h-6 text-[#3662E3]" strokeWidth={2.5} />
      </div>

      <div className="text-center">
        <p className="text-gray-900 dark:text-white mb-2">
          Drag & drop a file or{' '}
          <span className="text-[#3662E3] font-medium cursor-pointer hover:underline">
            browse files
          </span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          JPG, PNG or GIF - Max file size 2MB
        </p>
      </div>
    </div>
  )
}