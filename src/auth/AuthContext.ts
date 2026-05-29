import { createContext } from 'react'
import type { AuthContextType, AuthProvider } from './types'

const notProvided = (method: string) => () => {
    throw new Error(`AuthContext::${method} is not provided`)
}

export const AuthContext = createContext<AuthContextType>({
    get isAuthenticated() {
        notProvided('isAuthenticated')()
        return false
    },
    get isGuest() {
        notProvided('isGuest')()
        return false
    },
    get token() {
        notProvided('token')()
        return ''
    },
    get roles() {
        notProvided('roles')()
        return {}
    },
    get authProvider() {
        notProvided('authProvider')()
        return null as unknown as AuthProvider
    },
    setAuthentication: notProvided('setAuthentication'),
    signout: notProvided('signout'),
    getEffectivePermissions: notProvided('getEffectivePermissions'),
})
