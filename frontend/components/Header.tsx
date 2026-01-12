'use client'

import { Moon, Sun, Image as ImageIcon } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import Image from 'next/image'
import Logo from '@/public/resources/logo-small.svg'

export function Header() {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  return (
    <header className="header-nav border-b transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Image
                src={Logo}
                alt="Logo"
                width={25}
                className="object-contain"
              />
              <h1 className="hidden sm:block text-lg font-semibold header-title">
    ImageUpload
  </h1>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg transition-colors theme-toggle-btn "
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5 moon-icon" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}