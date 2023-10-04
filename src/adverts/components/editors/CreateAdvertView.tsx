import { FC, useCallback, useContext } from 'react'
import { Profile } from 'profile'
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
    const { CREATE_ADVERT } = useContext(PhraseContext)

    const onCreateAdvert = useCallback(
        (input: AdvertInput) => createAdvert(input),
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
            onUpdateAdvert={onCreateAdvert}
        />
    )
}
