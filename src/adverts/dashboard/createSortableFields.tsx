import { Advert } from 'adverts/types'
import { AdvertFilterSortableFieldDescriptor } from 'hard-coded-config/types'

export const SORTABLE_FIELDS: (keyof Advert)[] = [
    'title',
    'reference',
    'notes',
    'lendingPeriod',
]

export const createSortableFields =
    (): AdvertFilterSortableFieldDescriptor[] => [
        ...SORTABLE_FIELDS.map((field) => ({
            label: field,
            ascending: true,
            key: `${field}.a`,
            sorting: { field, ascending: true },
        })),
        ...SORTABLE_FIELDS.map((field) => ({
            label: field,
            ascending: false,
            key: `${field}.d`,
            sorting: { field, ascending: false },
        })),
    ]
