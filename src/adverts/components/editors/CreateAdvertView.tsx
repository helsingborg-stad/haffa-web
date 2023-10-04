import { FC, useCallback, useContext } from 'react'
import { Profile, ProfileContext, ProfileInput } from 'profile'
import { Terms } from 'terms/types'
import { AdvertInput } from '../../types'
import { AdvertsContext } from '../../AdvertsContext'
import { PhraseContext } from '../../../phrases/PhraseContext'
import {
    createEmptyAdvertInput,
    sanitizeAdvertContact,
    sanitizeAdvertLocation,
} from '../../repository/mappers'
import { AdvertEditor } from './AdvertEditor'
import { Category } from '../../../categories/types'

export const CreateAdvertView: FC<{
    terms: Terms
    profile: Profile
    categories: Category[]
}> = ({ terms, profile, categories }) => {
    const { createAdvert } = useContext(AdvertsContext)
    const { updateProfile } = useContext(ProfileContext)
    const { CREATE_ADVERT } = useContext(PhraseContext)

    const onCreate = useCallback(
        async (a: AdvertInput, p: ProfileInput | null) => {
            const result = await createAdvert(a)
            if (p) {
                await updateProfile(p)
            }
            return result
        },
        [createAdvert]
    )

    return (
        <AdvertEditor
            title={CREATE_ADVERT}
            advert={{
                ...createEmptyAdvertInput(),
                location: sanitizeAdvertLocation(profile),
                contact: sanitizeAdvertContact(profile),
            }}
            terms={terms}
            categories={categories}
            onUpdate={onCreate}
        />
    )
}
