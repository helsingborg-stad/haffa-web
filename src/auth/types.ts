export interface HaffaUserRoles {
    canEditOwnAdverts?: boolean
    canArchiveOwnAdverts?: boolean
    canRemoveOwnAdverts?: boolean
    canReserveAdverts?: boolean
    canCollectAdverts?: boolean
    canManageOwnAdvertsHistory?: boolean
    canManageAllAdverts?: boolean
    canEditSystemCategories?: boolean
    canEditSystemLoginPolicies?: boolean
    canEditApiKeys?: boolean
    canEditTerms?: boolean
    canRunSystemJobs?: boolean
}

export interface Authentication {
    token: string
    roles: HaffaUserRoles
}

export interface EffectivePermissions {
    email: string
    roles: string[]
    canLogin: boolean
}
export interface AuthContextType {
    readonly isAuthenticated: boolean
    readonly token: string
    readonly roles: HaffaUserRoles
    readonly authProvider: AuthProvider
    setAuthentication: (Authentication: Authentication) => void
    signout: () => Promise<void>
    getEffectivePermissions: (email: string) => Promise<EffectivePermissions>
}

export interface AuthProvider {
    verifyToken: (token: string) => Promise<Authentication>
    requestPincode: (
        email: string
    ) => Promise<'accepted' | 'denied' | 'invalid'>
    authenticate: (email: string, pincode: string) => Promise<Authentication>
    signOut: () => Promise<void>
    getEffectivePermissions: (
        token: string,
        email: string
    ) => Promise<EffectivePermissions>
}
