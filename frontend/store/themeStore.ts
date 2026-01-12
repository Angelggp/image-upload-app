"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type Theme = "light" | "dark"

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const getSystemTheme = (): Theme => {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",

      toggleTheme: () => {
        const newTheme: Theme = get().theme === "light" ? "dark" : "light"
        set({ theme: newTheme })
        
        // Aplicar inmediatamente al DOM
        document.documentElement.classList.toggle("dark", newTheme === "dark")
      },

      setTheme: (theme: Theme) => {
        set({ theme })
        document.documentElement.classList.toggle("dark", theme === "dark")
      },
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)