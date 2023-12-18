import { FC, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Terms } from 'terms/types'
import { AdvertFieldConfig } from 'advert-field-config/types'
import { AdvertInput, AdvertLocation, AdvertMutationResult } from '../../types'
import { sanitizeAdvertInput } from '../../repository/mappers'
import { AdvertForm } from './form'
import { Category } from '../../../categories/types'

export const AdvertEditor: FC<{
    title: string
    onUpdate: (advert: AdvertInput) => Promise<AdvertMutationResult>
    advert: AdvertInput
    terms: Terms
    categories: Category[]
    fields: AdvertFieldConfig
    locations: AdvertLocation[]
}> = ({
    title,
    onUpdate,
    advert: inputAdvert,
    terms,
    categories,
    fields,
    locations,
}) => {
    const [advert, setAdvert] = useState<AdvertInput>(
        sanitizeAdvertInput(inputAdvert)
    )
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(false)
    const navigate = useNavigate()

    const save = useCallback(
        async (a: AdvertInput) => {
            setSaving(true)
            setAdvert(a)
            try {
                const result = await onUpdate(a)
                setSaving(false)
                setError(!!result.status)
                if (result.status) {
                    setAdvert(sanitizeAdvertInput(result.advert || advert))
                } else if (result.advert) {
                    navigate(`/advert/${result.advert.id}`)
                }
            } catch (error) {
                console.log(error)
                setError(true)
                setSaving(false)
            }
        },
        [advert]
    )
    return (
        <AdvertForm
            title={title}
            error={error}
            advert={advert}
            terms={terms}
            categories={categories}
            fields={fields}
            locations={locations}
            disabled={saving}
            onSave={save}
        />
    )
}
