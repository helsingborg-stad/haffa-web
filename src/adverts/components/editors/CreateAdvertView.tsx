import { setAdvertDefaults } from 'advert-field-config/repository/mappers'
import type { AdvertFieldConfig } from 'advert-field-config/types'
import type { Profile } from 'profile'
import { type FC, useCallback, useContext } from 'react'
import type { Terms } from 'terms/types'
import type { Category } from '../../../categories/types'
import { PhraseContext } from '../../../phrases/PhraseContext'
import { AdvertsContext } from '../../AdvertsContext'
import {
    createEmptyAdvertInput,
    sanitizeAdvertContact,
    sanitizeAdvertLocation,
} from '../../repository/mappers'
import type { AdvertInput, AdvertLocation } from '../../types'
import { AdvertEditor } from './AdvertEditor'

export const CreateAdvertView: FC<{
    terms: Terms
    profile: Profile
    categories: Category[]
    fields: AdvertFieldConfig
    locations: AdvertLocation[]
}> = ({ terms, profile, categories, fields, locations }) => {
    const { createAdvert } = useContext(AdvertsContext)
    const { ADVERT_CREATE: CREATE_ADVERT } = useContext(PhraseContext)

    const onCreate = useCallback(
        async (a: AdvertInput) => createAdvert(a),
        [createAdvert]
    )
    const advert = {
        ...createEmptyAdvertInput(),
        location: sanitizeAdvertLocation(profile),
        contact: sanitizeAdvertContact(profile),
    }
    return (
        <AdvertEditor
            title={CREATE_ADVERT}
            advert={setAdvertDefaults(advert, fields)}
            terms={terms}
            categories={categories}
            fields={fields}
            locations={locations}
            onUpdate={onCreate}
        />
    )
}
