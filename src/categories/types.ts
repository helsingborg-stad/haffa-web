export interface Category {
    id: string
    label: string
    co2kg: number
    valueByUnit: number
    categories: Category[]
    advertCount?: number
    unarchivedAdvertCount?: number
    accumulatedAdvertCount?: number
}

export interface CategoryFlat {
    id: string
    parentId: string
    label: string
    co2kg: number
    valueByUnit: number
    advertCount?: number
    unarchivedAdvertCount?: number
}

export interface CategoriesRepository {
    getCategories: () => Promise<Category[]>
    updateCategories: (
        categories: Omit<Category[], 'advertCount'>
    ) => Promise<Category[]>
}
