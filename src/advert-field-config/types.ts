import type {
    AdvertContact,
    AdvertInput,
    AdvertLocation,
} from '../adverts/types'

export type FieldName = keyof (Omit<
    AdvertInput,
    'images' | 'externalId' | 'location' | 'contact'
> &
    AdvertContact &
    AdvertLocation & {
        picked: boolean
    })

export const ConfigurableFields: Array<FieldName> = [
    'title',
    'description',
    'quantity',
    'lendingPeriod',
    'co2kg',
    'valueByUnit',
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
    'notes',
    'tags',
    'organization',
    'name',
    'adress',
    'zipCode',
    'city',
    'email',
    'phone',
    'country',
    'place',
]

export const FieldLabels: Record<FieldName, string> = {
    title: 'Titel',
    description: 'Beskrivning',
    quantity: 'Antal',
    unit: 'Enhet',
    lendingPeriod: 'Utlåningsperiod',
    co2kg: 'CO₂ besparing',
    valueByUnit: 'Kostnadsvärdering',
    width: 'Bredd',
    height: 'Höjd',
    depth: 'Djup',
    weight: 'Vikt',
    size: 'Storlek',
    material: 'Material',
    condition: 'Skick',
    usage: 'Användningsområde',
    category: 'Kategori',
    reference: 'Egen referens',
    notes: 'Egna noteringar',
    tags: 'Taggar',
    organization: 'Organisation',
    name: 'Namn',
    adress: 'Adress',
    zipCode: 'Postnummer',
    city: 'Stad',
    email: 'Email',
    phone: 'Telefon',
    country: 'Land',
    picked: 'Plockad',
    place: 'Plats',
}

export interface FieldConfig {
    name: FieldName
    label: string
    visible: boolean
    mandatory: boolean
    initial: string
    adornment: string
}
export type AdvertFieldConfig = FieldConfig[]

export interface AdvertFieldRepository {
    getFieldConfig: () => Promise<AdvertFieldConfig>
    updateFieldConfig: (
        fieldConfig: AdvertFieldConfig
    ) => Promise<AdvertFieldConfig>
}
