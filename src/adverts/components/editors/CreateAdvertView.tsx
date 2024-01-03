import { FC, useCallback, useContext } from 'react'
import { Profile } from 'profile'
import { Terms } from 'terms/types'
import { AdvertFieldConfig } from 'advert-field-config/types'
import { setAdvertDefaults } from 'advert-field-config/repository/mappers'
import { AdvertInput, AdvertLocation } from '../../types'
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
