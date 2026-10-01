import { useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './ThemeContextDefinition'
import type { ReactNode } from 'react'
import type { Theme, ThemeContextValue } from './ThemeContextDefinition'

type ThemeProviderProps = {
  children: ReactNode
}

const themeKey = 'shopsphere.theme'

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(themeKey)
    return storedTheme === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(themeKey, theme)
  }, [theme])

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme: () => setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
