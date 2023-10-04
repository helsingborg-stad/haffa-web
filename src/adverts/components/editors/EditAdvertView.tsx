import { FC, useCallback, useContext } from 'react'
import { Terms } from 'terms/types'
import { ProfileContext, ProfileInput } from 'profile'
import { Advert, AdvertInput } from '../../types'
import { AdvertsContext } from '../../AdvertsContext'
import { PhraseContext } from '../../../phrases/PhraseContext'
import { AdvertEditor } from './AdvertEditor'
import { Category } from '../../../categories/types'

export const EditAdvertView: FC<{
    advert: Advert
    terms: Terms
    categories: Category[]
}> = ({ advert, terms, categories }) => {
    const { updateAdvert } = useContext(AdvertsContext)
    const { updateProfile } = useContext(ProfileContext)
    const { EDIT_ADVERT } = useContext(PhraseContext)

    const onUpdate = useCallback(
        async (a: AdvertInput, p: ProfileInput | null) => {
            const result = await updateAdvert(advert.id, a)
            if (p) {
                await updateProfile(p)
            }
            return result
        },
        [updateAdvert, advert]
    )

    return (
        <AdvertEditor
            title={EDIT_ADVERT}
            advert={advert}
            terms={terms}
            categories={categories}
            onUpdate={onUpdate}
        />
    )
}
