import { Notifications } from 'notifications/types'
import { PhraseContextType } from 'phrases/PhraseContext'
import { LoginPoliciesRepository } from './types'

export const createNotifyingLoginPoliciesRepository = (
    notifications: Notifications,
    phrase: PhraseContextType['phrase'],
    inner: LoginPoliciesRepository
): LoginPoliciesRepository => ({
    getLoginPolicies: () => inner.getLoginPolicies(),
    updateLoginPolicies: (...args) =>
        inner.updateLoginPolicies(...args).then((result) => {
            notifications.info({
                message: phrase('', 'Inställningarna är sparade'),
            })
            return result
        }),
})
