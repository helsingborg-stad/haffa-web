export interface Category {
    id: string
    label: string
    co2kg: number
    categories: Category[]
    advertCount?: number
}

export interface CategoryFlat {
    id: string
    parentId: string
    label: string
    co2kg: number
    advertCount?: number
}

export interface CategoriesRepository {
    getCategories: () => Promise<Category[]>
    updateCategories: (
        categories: Omit<Category[], 'advertCount'>
    ) => Promise<Category[]>
}
