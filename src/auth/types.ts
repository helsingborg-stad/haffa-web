export interface Authentication {
	token: string
}
export interface AuthContextType {
	readonly isAuthenticated: boolean
	readonly token: string
	readonly authProvider: AuthProvider
	setAuthentication: (Authentication: Authentication) => void
	signout: () => Promise<void>
}

export interface AuthProvider {
	verifyToken: (token: string) => Promise<string>
	requestPincode: (email: string) => Promise<'accepted'|'denied'|'invalid'>
	authenticate(email: string, pincode: string): Promise<string>
}