import { FC, PropsWithChildren, useCallback, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import { AuthProvider, Authentication } from './types'
import useLocalStorage from '../hooks/use-local-storage'

export const AuthContextProvider: FC<
    { authProvider: AuthProvider } & PropsWithChildren
> = ({ authProvider, children }) => {
    const [authentication, setAuthentication] = useLocalStorage<Authentication>(
        'haffa-auth-v2',
        {
            token: '',
            roles: [],
        }
    )
    const signout = useCallback(
        async () => setAuthentication({ token: '', roles: [] }),
        [setAuthentication]
    )
    const { token } = authentication

    const getAuthenticationSignature = (a: Authentication) =>
        [a.token, ...a.roles].sort().join('@')
    const areEquivalent = (a: Authentication, b: Authentication) =>
        getAuthenticationSignature(a) === getAuthenticationSignature(b)
    useEffect(() => {
        token &&
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
                isAdmin: authentication.roles.includes('admin'),
                token: authentication.token,
                roles: authentication.roles,
                authProvider,
                setAuthentication,
                signout,
                isInRoles: (...roles) =>
                    roles.some((r) => authentication.roles.includes(r)),
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
