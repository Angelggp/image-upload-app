'use client'

import { Loader2 } from 'lucide-react'

interface LoaderProps {
  progress?: number
}

export function Loader({ progress }: LoaderProps) {
  return (
    <div className="card flex flex-col items-center justify-center p-12">
      <div className="relative mb-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin" strokeWidth={2.5} />
      </div>
      
      <p className="text-dark-bg dark:text-light-white font-medium mb-2">
        Uploading...
      </p>
      
      {progress !== undefined && (
        <div className="w-full max-w-xs">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-dark-text dark:text-light-border">
              Progress
            </span>
            <span className="text-sm font-medium text-primary">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-light-border dark:bg-dark-text rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}