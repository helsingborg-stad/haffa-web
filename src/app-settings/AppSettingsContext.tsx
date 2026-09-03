import { createContext, useContext } from 'react'
import type { AppSettingsOptions } from '../options/types'

export const defaultAppSettings: AppSettingsOptions = {
    warnOnReservingOwnAdvert: true,
    showCo2eInAdvertList: true,
}
export const AppSettingsContext =
    createContext<AppSettingsOptions>(defaultAppSettings)

export const useAppSettings = () => useContext(AppSettingsContext)
