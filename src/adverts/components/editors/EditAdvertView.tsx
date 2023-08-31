import { FC, useCallback, useContext } from 'react'
import { Advert, AdvertTerms, AdvertInput } from '../../types'
import { AdvertsContext } from '../../AdvertsContext'
import { PhraseContext } from '../../../phrases/PhraseContext'
import { AdvertEditor } from './AdvertEditor'
import { Category } from '../../../categories/types'

export const EditAdvertView: FC<{
    advert: Advert
    terms: AdvertTerms
    categories: Category[]
}> = ({ advert, terms, categories }) => {
    const { updateAdvert } = useContext(AdvertsContext)
    const { EDIT_ADVERT } = useContext(PhraseContext)

    const onUpdateAdvert = useCallback(
        (input: AdvertInput) => updateAdvert(advert.id, input),
        [updateAdvert, advert]
    )

    return (
        <AdvertEditor
            title={EDIT_ADVERT}
            advert={advert}
            terms={terms}
            categories={categories}
            onUpdateAdvert={onUpdateAdvert}
        />
    )
}
