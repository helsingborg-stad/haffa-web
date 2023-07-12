import { FC, useCallback, useContext } from 'react'
import { Profile } from 'profile'
import { AdvertTerms, AdvertInput } from '../../types'
import { AdvertsContext } from '../../AdvertsContext'
import { PhraseContext } from '../../../phrases/PhraseContext'
import {
    createEmptyAdvertInput,
    sanitizeAdvertContact,
    sanitizeAdvertLocation,
} from '../../repository/mappers'
import { AdvertEditor } from './AdvertEditor'

export const CreateAdvertView: FC<{ terms: AdvertTerms; profile: Profile }> = ({
    terms,
    profile,
}) => {
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
            onUpdateAdvert={onCreateAdvert}
        />
    )
}
