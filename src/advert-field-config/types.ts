import { AdvertContact, AdvertInput, AdvertLocation } from 'adverts'

type Fields = keyof (Omit<
    AdvertInput,
    'images' | 'externalId' | 'location' | 'contact'
> &
    AdvertContact &
    AdvertLocation)

export const ConfigurableFields: Array<Fields> = [
    'title',
    'description',
    'quantity',
    'unit',
    'width',
    'height',
    'depth',
    'weight',
    'size',
    'material',
    'condition',
    'usage',
    'category',
    'reference',
    'tags',
    'organization',
    'name',
    'adress',
    'zipCode',
    'city',
    'email',
    'phone',
]

export interface FieldConfig {
    name: Fields
    visible: boolean
    mandatory: boolean
}
export type AdvertFieldConfig = FieldConfig[]

export interface AdvertFieldRepository {
    getFieldConfig: () => Promise<AdvertFieldConfig>
    updateFieldConfig: (
        fieldConfig: AdvertFieldConfig
    ) => Promise<AdvertFieldConfig>
}
