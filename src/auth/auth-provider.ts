import { rolesArrayToRoles } from './mappers'
import { AuthProvider, Authentication } from './types'

const normalizeString = (s: any) => (typeof s === 'string' ? s.trim() : '')

const makeAuthentication = (
    token: any,
    roles: any,
    guest: any
): Authentication => ({
    token: normalizeString(token),
    roles: rolesArrayToRoles(roles),
    guest: !!guest,
})

export const createAuthProvider = (): AuthProvider => {
    const request = (url: string, body: any, headers?: any) =>
        fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(body),
        }).then((response) => response.json())
    return {
        verifyToken: (token) =>
            request('/api/v1/haffa/auth/verify-token', { token }).then(
                ({ token, roles, guest }) =>
                    makeAuthentication(token, roles, guest)
            ),
        requestPincode: (email) =>
            request('/api/v1/haffa/auth/request-pincode', { email }).then(
                ({ status }) => {
                    switch (status) {
                        case 'accepted':
                            return 'accepted'
                        case 'denied':
                            return 'denied'
                        default:
                            return 'invalid'
                    }
                }
            ),
        authenticate: (email, pincode) =>
            request('/api/v1/haffa/auth/login', { email, pincode }).then(
                ({ token, roles, guest }) =>
                    makeAuthentication(token, roles, guest)
            ),
        signOut: () => request('/api/v1/haffa/auth/signout', {}),
        getEffectivePermissions: (token, email) =>
            request(
                '/api/v1/haffa/auth/effective-permissions',
                { email },
                { Authorization: `Bearer ${token}` }
            ).then(({ email, roles, canLogin }) => ({
                email,
                roles,
                canLogin,
            })),
    }
}
