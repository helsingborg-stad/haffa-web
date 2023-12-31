export interface LoginPoliciesRepository {
    getLoginPolicies: () => Promise<LoginPolicy[]>
    updateLoginPolicies: (policies: LoginPolicy[]) => Promise<LoginPolicy[]>
}

export interface LoginPolicy {
    emailPattern: string
    roles: string[]
    deny: boolean
}
