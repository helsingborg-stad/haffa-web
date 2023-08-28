import { Category } from 'categories/types'

export interface SettingsRepository {
    getLoginPolicies: () => Promise<LoginPolicy[]>
    updateLoginPolicies: (policies: LoginPolicy[]) => Promise<LoginPolicy[]>
    getCategories: () => Promise<Category[]>
    updateCategories: (categories: Category[]) => Promise<Category[]>
}

export interface LoginPolicy {
    emailPattern: string
    roles: string[]
    deny: boolean
}
