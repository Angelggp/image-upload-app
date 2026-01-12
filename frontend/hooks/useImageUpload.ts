import { useState } from 'react'
import { toast } from 'sonner'
import { imageApi } from '@/lib/api'
import { UploadState } from '@/types'

export function useImageUpload() {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    imageData: null,
  })

  const uploadImage = async (file: File) => {
    setState({
      isUploading: true,
      progress: 0,
      error: null,
      imageData: null,
    })

    try {
      const imageData = await imageApi.upload(file, (progress) => {
        setState((prev) => ({ ...prev, progress }))
      })

      setState({
        isUploading: false,
        progress: 100,
        error: null,
        imageData,
      })

      toast.success('Image uploaded successfully!')
      return imageData
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      
      setState({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        imageData: null,
      })

      toast.error(errorMessage)
      throw error
    }
  }

  // ✅ MÉTODO ACTUALIZADO: Ahora recibe imageId en lugar de filename
  const downloadImage = async (imageId: string) => {
    try {
      const { blob, filename } = await imageApi.download(imageId);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // Usar el filename original del servidor
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download image');
      throw error;
    }
  }

  const reset = () => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      imageData: null,
    })
  }

  return {
    ...state,
    uploadImage,
    downloadImage,
    reset,
  }
}