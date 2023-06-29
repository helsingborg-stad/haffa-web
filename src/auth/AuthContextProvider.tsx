import { FC, PropsWithChildren, useCallback, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import { AuthProvider, Authentication } from './types'
import useLocalStorage from '../hooks/use-local-storage'

export const AuthContextProvider: FC<
    { authProvider: AuthProvider } & PropsWithChildren
> = ({ authProvider, children }) => {
    const [authentication, setAuthentication] = useLocalStorage<Authentication>(
        'haffa-auth-v1',
        {
            token: '',
        }
    )
    const signout = useCallback(
        async () => setAuthentication({ token: '' }),
        [setAuthentication]
    )
    const { token } = authentication
    useEffect(() => {
        token &&
            authProvider.verifyToken(token).then((token) => {
                if (!token) {
                    setAuthentication({ token: '' })
                }
            })
        return () => void 0
    }, [token])
    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!authentication.token,
                token: authentication.token,
                authProvider,
                setAuthentication,
                signout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
