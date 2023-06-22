import { AuthProvider } from './types'

export const createAuthProvider = (): AuthProvider => {
	return {
		verifyToken: token => fetch('/api/v1/haffa/auth/verify-token', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ token }),

		})
			.then(response => response.json())
			.then(({ token }) => (token || '').toString()),
		requestPincode: email => fetch('/api/v1/haffa/auth/request-pincode', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email }),
		})
			.then(response => response.json())
			.then(({ status }) => {
				switch (status) {
					case 'accepted': return 'accepted'
					case 'denied': return 'denied'
					default: return 'invalid'
				}
			} ),
		authenticate: (email, pincode) => fetch('/api/v1/haffa/auth/authenticate', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, pincode }),
		}).then(response => response.json())
			.then(({ token }) => (token || '').toString()),
	}
}