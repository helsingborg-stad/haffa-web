import { AuthProvider } from './types'

export const createAuthProvider = (): AuthProvider => {
	const request = (url: string, body: any) => fetch(url, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})
		.then(response => response.json())
	return {
		verifyToken: token => request(
			'/api/v1/haffa/auth/verify-token',
			{ token })
			.then(({ token }) => (token || '').toString()),
		requestPincode: email => request(
			'/api/v1/haffa/auth/request-pincode',
			{ email })
			.then(({ status }) => {
				switch (status) {
					case 'accepted': return 'accepted'
					case 'denied': return 'denied'
					default: return 'invalid'
				}
			} ),
		authenticate: (email, pincode) => request(
			'/api/v1/haffa/auth/login',
			{ email, pincode })
			.then(({ token }) => (token || '').toString()),
	}
}