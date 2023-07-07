import { FC, useCallback, useContext } from 'react'
import { Typography } from '@mui/material'
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
        <>
            <Typography variant="h3">{CREATE_ADVERT}</Typography>
            <AdvertEditor
                advert={{
                    ...createEmptyAdvertInput(),
                    location: sanitizeAdvertLocation(profile),
                    contact: sanitizeAdvertContact(profile),
                }}
                terms={terms}
                onUpdateAdvert={onCreateAdvert}
            />
        </>
    )
}
