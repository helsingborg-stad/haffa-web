import { Category } from 'categories/types'
import { LoginPolicy } from 'login-policies/types'

export interface SettingsRepository {
    getLoginPolicies: () => Promise<LoginPolicy[]>
    updateLoginPolicies: (policies: LoginPolicy[]) => Promise<LoginPolicy[]>
    getCategories: () => Promise<Category[]>
    updateCategories: (categories: Category[]) => Promise<Category[]>
}
