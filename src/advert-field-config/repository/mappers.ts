import {
    AdvertFieldConfig,
    ConfigurableFields,
    FieldConfig,
} from 'advert-field-config/types'

export const createEmptyConfiguration = (): AdvertFieldConfig =>
    ConfigurableFields.map((name) => ({
        name,
        visible: true,
        mandatory: false,
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
