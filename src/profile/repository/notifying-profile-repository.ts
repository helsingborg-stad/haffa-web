import { Notifications } from 'notifications/types'
import { PhraseContextType } from 'phrases/PhraseContext'
import { ProfileRepository } from 'profile'

export const createNotifyingProfileRepository = (
    notifications: Notifications,
    phrase: PhraseContextType['phrase'],
    inner: ProfileRepository
): ProfileRepository => ({
    getProfile: () => inner.getProfile(),
    updateProfile: (...args) =>
        inner.updateProfile(...args).then((result) => {
            notifications.info({
                message: phrase('', 'Din profil är uppdaterad'),
            })
            return result
        }),
})
