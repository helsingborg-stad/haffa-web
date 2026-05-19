import type { Notifications } from 'notifications/types'
import type { PhraseContextType } from 'phrases'
import type { ProfileRepository } from 'profile'

export const createNotifyingProfileRepository = (
    notifications: Notifications,
    phrase: PhraseContextType['phrase'],
    inner: ProfileRepository
): ProfileRepository => ({
    getProfile: () => inner.getProfile(),
    updateProfile: (...args) =>
        inner.updateProfile(...args).then((result) => {
            notifications.info({
                message: phrase(
                    'NOTIFICATIONS_PROFILE_WAS_UPDATED',
                    'Din profil är uppdaterad'
                ),
            })
            return result
        }),
    removeProfile: (...args) =>
        inner.removeProfile(...args).then((result) => {
            notifications.info({
                message: phrase(
                    'NOTIFICATIONS_PROFILE_WAS_REMOVED',
                    'Din profil är borttagen'
                ),
            })
            return result
        }),
})
