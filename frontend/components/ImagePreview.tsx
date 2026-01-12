'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Copy, Download, Check } from 'lucide-react'
import { ImageData } from '@/types'
import { toast } from 'sonner'

interface ImagePreviewProps {
  imageData: ImageData
  onDownload: () => void
}

export function ImagePreview({ imageData, onDownload }: ImagePreviewProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(imageData.file_url)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  return (
    <div className="card space-y-6 animate-fade-in">
      {/* Image Display */}
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Image
          src={imageData.file_url}
          alt={imageData.filename}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Image Info */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {imageData.filename}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Uploaded successfully
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleCopyLink}
          className="flex-1 btn btn-primary flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Share
            </>
          )}
        </button>

        <button
          onClick={onDownload}
          className="flex-1 btn bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  )
}