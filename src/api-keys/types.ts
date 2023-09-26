export interface ApiKeysRepository {
    getApiKeys: () => Promise<ApiKey[]>
    updateApiKeys: (
        categories: Omit<ApiKey[], 'advertCount'>
    ) => Promise<ApiKey[]>
}

export interface ApiKey {
    secret: string
    expires: string
    email: string
}
