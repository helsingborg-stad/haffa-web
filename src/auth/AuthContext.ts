import { createContext } from 'react'
import { AuthContextType, AuthProvider } from './types'

const notProvided = (method: string) => () => {
    throw new Error(`AuthContext::${method} is not provided`)
}

export const AuthContext = createContext<AuthContextType>({
    get isAuthenticated() {
        return notProvided('isAuthenticated'), false
    },
    get token() {
        return notProvided('token'), ''
    },
    get roles() {
        return notProvided('roles'), {}
    },
    get authProvider() {
        return notProvided('authProvider'), null as any as AuthProvider
    },
    setAuthentication: notProvided('setAuthentication'),
    signout: notProvided('signout'),
})
