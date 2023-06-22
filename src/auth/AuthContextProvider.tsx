import { FC, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { Authentication } from './types'
import { createAuthProvider } from './auth-provider'
import useLocalStorage from '../hooks/use-local-storage'

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
	const [ authentication, setAuthentication ] = useLocalStorage<Authentication>(
		'haffa-auth-v1',
		{
			token: '',
		})
	const signout = useCallback(async () => setAuthentication({ token: '' }), [setAuthentication])
	const { token } = authentication
	const authProvider = createAuthProvider()
	useEffect(() => {
		token && authProvider.verifyToken(authentication.token)
			.then(token => {
				if (!token) {
					setAuthentication({ token: '' })
				}
			})
		return () => void 0
	}, [token])
	return (
		<AuthContext.Provider value={{
			isAuthenticated: !!authentication.token,
			token: authentication.token,
			setAuthentication,
			signout,
		}}>
			{children}
		</AuthContext.Provider>
	)
}