export interface SystemSettingsRepository {
    getSystemSettings: () => Promise<SystemSettings>
}

export interface SystemSettings {
    allowGuestUsers: boolean
    allowEmailUsers: boolean
    allowPhoneUsers: boolean
}
