import { HaffaUserRoles } from 'admin/types'

export interface LoginPoliciesRepository {
    getLoginPolicies: () => Promise<LoginPolicy[]>
    updateLoginPolicies: (policies: LoginPolicy[]) => Promise<LoginPolicy[]>
}

export interface LoginPolicy {
    emailPattern: string
    roles: HaffaUserRoles
    deny: boolean
}
