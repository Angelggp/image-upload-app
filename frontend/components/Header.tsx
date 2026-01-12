'use client'

import { Moon, Sun, Image as ImageIcon } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'

export function Header() {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  return (
    <header className="border-b border-light-border dark:border-dark-text bg-light-white dark:bg-dark-card transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-lg font-semibold text-dark-bg dark:text-light-white">
              ImageUpload
            </h1>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg hover:bg-light-bg dark:hover:bg-dark-bg transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}