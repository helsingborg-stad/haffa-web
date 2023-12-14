import { FC, useCallback, useContext } from 'react'
import { Terms } from 'terms/types'
import { AdvertFieldConfig } from 'advert-field-config/types'
import { Advert, AdvertInput } from '../../types'
import { AdvertsContext } from '../../AdvertsContext'
import { PhraseContext } from '../../../phrases/PhraseContext'
import { AdvertEditor } from './AdvertEditor'
import { Category } from '../../../categories/types'

export const EditAdvertView: FC<{
    advert: Advert
    terms: Terms
    categories: Category[]
    fields: AdvertFieldConfig
}> = ({ advert, terms, categories, fields }) => {
    const { updateAdvert } = useContext(AdvertsContext)
    const { ADVERT_EDIT } = useContext(PhraseContext)

    const onUpdate = useCallback(
        async (a: AdvertInput) => updateAdvert(advert.id, a),
        [updateAdvert, advert]
    )

    return (
        <AdvertEditor
            title={ADVERT_EDIT}
            advert={advert}
            terms={terms}
            categories={categories}
            fields={fields}
            onUpdate={onUpdate}
        />
    )
}
