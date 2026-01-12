'use client'

import { ReactNode } from 'react'
import { Header } from './Header'
import { Toaster } from 'sonner'

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">

      <Header />
      {children}
      <Toaster 
        position="top-right"
        richColors
        closeButton
      />
    </div>
  )
}