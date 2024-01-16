import {
    AdvertFieldConfig,
    ConfigurableFields,
    FieldConfig,
    FieldLabels,
    FieldName,
} from 'advert-field-config/types'
import { AdvertContact, AdvertInput, AdvertLocation } from 'adverts'
import { isString } from 'lib/string-utils'

export const createEmptyConfiguration = (): AdvertFieldConfig =>
    ConfigurableFields.map((name) => ({
        name,
        label: FieldLabels[name],
        visible: true,
        mandatory: false,
        initial: '',
        adornment: '',
    }))

export const normalizeFieldConfig = (fieldConfig: AdvertFieldConfig | null) => {
    const fieldList = [...createEmptyConfiguration(), ...(fieldConfig || [])]

    const filteredList = fieldList
        .reduce<Array<FieldConfig | null>>(
            (p, c) => [...p, ConfigurableFields.includes(c.name) ? c : null],
            []
        )
        .filter((v) => v) as AdvertFieldConfig

    const mapper = new Map<string, FieldConfig>()

    filteredList.forEach((f) => {
        mapper.set(f.name, {
            ...(mapper.get(f.name) || {}),
            ...f,
        })
    })
    return Array.from(mapper.values())
}

export const getField = (
    fieldConfig: AdvertFieldConfig,
    name: FieldName
): FieldConfig => ({
    name,
    label: name,
    visible: true,
    initial: '',
    mandatory: false,
    adornment: '',
    ...(fieldConfig.find((f) => f.name === name) || {}),
})

export const setAdvertDefaults = (
    advert: AdvertInput,
    fieldConfig: AdvertFieldConfig
) => {
    const contact: Partial<AdvertContact> = { ...advert.contact }
    const location: Partial<AdvertLocation> = { ...advert.location }
    const base: Partial<AdvertInput> = { ...advert }

    fieldConfig.forEach((field) => {
        if (isString(field.initial)) {
            switch (field.name) {
                case 'name':
                case 'adress':
                case 'zipCode':
                case 'city':
                case 'country':
                    location[field.name] = field.initial
                    break
                case 'phone':
                case 'email':
                case 'organization':
                    contact[field.name] = field.initial
                    break
                case 'tags':
                    base[field.name] = field.initial.split(',')
                    break
                case 'quantity':
                    base[field.name] = Number(field.initial)
                    break
                default:
                    base[field.name] = field.initial
                    break
            }
        }
    })
    return {
        ...base,
        location,
        contact,
    } as AdvertInput
}
