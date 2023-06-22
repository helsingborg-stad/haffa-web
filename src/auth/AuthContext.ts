import { createContext } from 'react'
import { AuthContextType } from './types'

const notProvided = (method: string) => () => {
	throw new Error(`AuthContext::${method} is not provided`)
}

export const AuthContext = createContext<AuthContextType>({
	get isAuthenticated() { return notProvided('isAuthenticated'), false },
	get token() { return notProvided('token'), '' },
	setAuthentication: notProvided('setAuthentication'),
	signout: notProvided('signout'),
})