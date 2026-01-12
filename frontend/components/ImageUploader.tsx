'use client'

import { toast } from 'sonner'
import { UploadZone } from './UploadZone'
import { Loader } from './Loader'
import { ImagePreview } from './ImagePreview'
import { useImageUpload } from '@/hooks/useImageUpload'

export function ImageUploader() {
  const { isUploading, progress, imageData, uploadImage, downloadImage, reset } = useImageUpload()

  const handleFileSelect = async (file: File) => {
    try {
      await uploadImage(file)
    } catch (error) {
      console.error('Upload error:', error)
    }
  }

  const handleError = (error: string) => {
    toast.error(error)
  }

  const handleDownload = async () => {
    if (imageData) {
      try {
        await downloadImage(imageData.filename)
      } catch (error) {
        console.error('Download error:', error)
      }
    }
  }

  const handleNewUpload = () => {
    reset()
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {isUploading ? (
        <Loader progress={progress} />
      ) : imageData ? (
        <div className="space-y-4">
          <ImagePreview imageData={imageData} onDownload={handleDownload} />
          <button
            onClick={handleNewUpload}
            className="w-full btn bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Upload Another Image
          </button>
        </div>
      ) : (
        <UploadZone onFileSelect={handleFileSelect} onError={handleError} />
      )}
    </div>
  )
}