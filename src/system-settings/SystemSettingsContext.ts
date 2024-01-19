import { createContext } from 'react'
import { SystemSettingsRepository } from './types'

export const SystemSettingsContext = createContext<SystemSettingsRepository>({
    getSystemSettings: async () => ({
        allowGuestUsers: false,
        allowEmailUsers: false,
        allowPhoneUsers: false,
    }),
})
