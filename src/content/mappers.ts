import { ContentModule, ViewComposition } from './types'

export const createEmptyModule = (): ContentModule => ({
    title: '',
    body: '',
    image: '',
    categories: '',
    tags: '',
})

export const normalizeComposition = (
    composition?: ViewComposition
): ViewComposition => ({
    rows: (composition?.rows ?? []).map((row) => ({
        columns: (row.columns ?? []).map((column) => ({
            module: {
                ...createEmptyModule(),
                ...column.module,
            },
        })),
    })),
})
