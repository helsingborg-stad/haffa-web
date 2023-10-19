import { Notifications } from 'notifications/types'
import { PhraseContextType } from 'phrases'
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
                message: phrase(
                    'NOTIFICATIONS_LOGINS_WAS_UPDATED',
                    'Inställningarna är sparade'
                ),
            })
            return result
        }),
})
