import type { AdvertFieldConfig } from 'advert-field-config/types'
import { type FC, useCallback, useContext } from 'react'
import type { Terms } from 'terms/types'
import type { Category } from '../../../categories/types'
import { PhraseContext } from '../../../phrases/PhraseContext'
import { AdvertsContext } from '../../AdvertsContext'
import type { Advert, AdvertInput, AdvertLocation } from '../../types'
import { AdvertEditor } from './AdvertEditor'

export const EditAdvertView: FC<{
    advert: Advert
    terms: Terms
    categories: Category[]
    fields: AdvertFieldConfig
    locations: AdvertLocation[]
}> = ({ advert, terms, categories, fields, locations }) => {
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
            locations={locations}
            onUpdate={onUpdate}
        />
    )
}
