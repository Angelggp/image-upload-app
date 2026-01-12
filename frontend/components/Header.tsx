'use client'

import { Moon, Sun, Image as ImageIcon } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'

export function Header() {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  return (
    <header className="header-nav border-b transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="icon-primary w-8 h-8 rounded-md flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-lg font-semibold header-title">
              ImageUpload
            </h1>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg transition-colors theme-toggle-btn"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 moon-icon" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}