export interface LoginPoliciesRepository {
    getLoginPolicies: () => Promise<LoginPolicy[]>
    updateLoginPolicies: (policies: LoginPolicy[]) => Promise<LoginPolicy[]>

    getUserMappingConfiguration: () => Promise<UserMappingConfiguration>
    updateUserMappingConfiguration: (
        patch: Partial<UserMappingConfiguration>
    ) => Promise<UserMappingConfiguration>
}

export interface LoginPolicy {
    emailPattern: string
    roles: string[]
    deny: boolean
}

export interface UserMappingConfiguration {
    allowGuestUsers: boolean
    phone: {
        sender: string
        country: string
        roles: string[]
    }
}
