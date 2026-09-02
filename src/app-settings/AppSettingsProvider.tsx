import useAsync from 'hooks/use-async'
import type { Option } from 'options/types'
import type { FC, PropsWithChildren } from 'react'
import { AppSettingsContext } from './AppSettingsContext'
import { mapOptionsToAppSettings } from './mappers'

const fetchAppSettingOptions = (): Promise<Option[]> =>
    fetch('/api/v1/haffa/options/app-settings', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((options) => (Array.isArray(options) ? options : []))
        .catch(() => [])

export const AppSettingsProvider: FC<PropsWithChildren> = ({ children }) => {
    const inspect = useAsync(() =>
        fetchAppSettingOptions().then(mapOptionsToAppSettings)
    )

    return inspect({
        pending: () => <div />,
        resolved: (appSettings) => (
            <AppSettingsContext.Provider value={appSettings}>
                {children}
            </AppSettingsContext.Provider>
        ),
        rejected: () => (
            <AppSettingsContext.Provider value={mapOptionsToAppSettings([])}>
                {children}
            </AppSettingsContext.Provider>
        ),
    })
}
