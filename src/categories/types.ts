export interface Category {
    id: string
    label: string
    co2kg: number
    categories: Category[]
}

export interface CategoryFlat {
    id: string
    parentId: string
    label: string
    co2kg: number
}
