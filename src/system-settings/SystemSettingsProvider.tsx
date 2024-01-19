import { FC, PropsWithChildren } from 'react'
import { toMap } from 'lib/to-map'
import { SystemSettingsContext } from './SystemSettingsContext'
import { SystemSettings, SystemSettingsRepository } from './types'

const mapOptionsToSystemSettings = (
    options: { key: string; value: string }[]
): SystemSettings => {
    const { allowGuestUsers, allowEmailUsers, allowPhoneUsers } = toMap(
        options,
        ({ key }) => key,
        ({ value }) => value === 'true'
    )
    return {
        allowGuestUsers: !!allowGuestUsers,
        allowEmailUsers: !!allowEmailUsers,
        allowPhoneUsers: !!allowPhoneUsers,
    }
}

const createRepository = (): SystemSettingsRepository => ({
    getSystemSettings: () =>
        fetch('/api/v1/haffa/system-settings', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((options) => (Array.isArray(options) ? options : []))
            .then((options) =>
                options.filter(
                    ({ key, value }) =>
                        typeof key === 'string' && typeof value === 'string'
                )
            )
            .then(mapOptionsToSystemSettings),
})

export const SystemSettingsProvider: FC<PropsWithChildren> = ({ children }) => (
    <SystemSettingsContext.Provider value={createRepository()}>
        {children}
    </SystemSettingsContext.Provider>
)
