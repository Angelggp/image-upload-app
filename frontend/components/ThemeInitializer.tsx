"use client"

import { useEffect } from "react"
import { useThemeStore } from "@/store/themeStore"

const getSystemTheme = (): "light" | "dark" => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  // Inicializar tema al montar
  useEffect(() => {
    const stored = localStorage.getItem("theme-storage")
    let themeToApply: "light" | "dark" = "light"
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        themeToApply = parsed.state?.theme || getSystemTheme()
      } catch {
        themeToApply = getSystemTheme()
      }
    } else {
      themeToApply = getSystemTheme()
    }
    
    // Aplicar tema y marcar como listo
    document.documentElement.classList.toggle("dark", themeToApply === "dark")
    document.documentElement.classList.add("theme-ready")
    
    if (themeToApply !== theme) {
      setTheme(themeToApply)
    }
  }, [])

  // Sincronizar cambios posteriores
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  return <>{children}</>
}