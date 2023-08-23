export interface Authentication {
    token: string
    roles: string[]
}
export interface AuthContextType {
    readonly isAuthenticated: boolean
    readonly token: string
    readonly roles: string[]
    readonly authProvider: AuthProvider
    isInRoles: (...roles: string[]) => boolean
    setAuthentication: (Authentication: Authentication) => void
    signout: () => Promise<void>
}

export interface AuthProvider {
    verifyToken: (token: string) => Promise<Authentication>
    requestPincode: (
        email: string
    ) => Promise<'accepted' | 'denied' | 'invalid'>
    authenticate(email: string, pincode: string): Promise<Authentication>
}
