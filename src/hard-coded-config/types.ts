import { AdvertSorting } from 'adverts'

export interface AdvertFilterSortableFieldDescriptor {
    label: string
    ascending: boolean
    key: string
    sorting: AdvertSorting
}
