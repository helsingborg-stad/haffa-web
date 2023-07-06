import { FC, useCallback, useContext } from 'react'
import { Typography } from '@mui/material'
import { AdvertTerms, AdvertInput } from '../../types'
import { AdvertsContext } from '../../AdvertsContext'
import { PhraseContext } from '../../../phrases/PhraseContext'
import { createEmptyCreateAdvertInput } from '../../repository/mappers'
import { AdvertEditor } from './AdvertEditor'

export const CreateAdvertView: FC<{ terms: AdvertTerms }> = ({ terms }) => {
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
                advert={createEmptyCreateAdvertInput()}
                terms={terms}
                onUpdateAdvert={onCreateAdvert}
            />
        </>
    )
}
