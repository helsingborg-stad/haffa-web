import { createContext, useContext } from 'react'

export type DarkModeContextType = {
    darkMode: boolean
    setDarkMode: (darkMode: boolean) => void
    darkModeAllowed: boolean
}

export const DarkModeContext = createContext<DarkModeContextType>({
    darkMode: false,
    setDarkMode: () => {},
    darkModeAllowed: true,
})

export const useDarkMode = () => useContext(DarkModeContext)
