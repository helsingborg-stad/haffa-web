import { FC, PropsWithChildren, useCallback, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import { AuthProvider, Authentication } from './types'
import useLocalStorage from '../hooks/use-local-storage'

export const AuthContextProvider: FC<
    { authProvider: AuthProvider } & PropsWithChildren
> = ({ authProvider, children }) => {
    const [authentication, setAuthentication] = useLocalStorage<Authentication>(
        'haffa-auth-v5',
        {
            token: '',
            roles: {},
            guest: true,
        }
    )
    const signout = useCallback(async () => {
        await authProvider.signOut()
        setAuthentication({ token: '', roles: {}, guest: true })
    }, [authProvider, setAuthentication])
    const { token } = authentication

    const getAuthenticationSignature = (a: Authentication) => JSON.stringify(a)
    const areEquivalent = (a: Authentication, b: Authentication) =>
        getAuthenticationSignature(a) === getAuthenticationSignature(b)
    useEffect(() => {
        // token &&
        authProvider.verifyToken(token).then((a) => {
            if (!token || !areEquivalent(a, authentication)) {
                setAuthentication(a)
            }
        })
        return () => void 0
    }, [token])
    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!authentication.token,
                isGuest: authentication.guest,
                token: authentication.token,
                roles: authentication.roles,
                authProvider,
                setAuthentication,
                signout,
                getEffectivePermissions: (email) =>
                    authProvider.getEffectivePermissions(
                        authentication.token,
                        email
                    ),
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
