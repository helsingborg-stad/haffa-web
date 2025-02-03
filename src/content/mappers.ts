import { ContentModule, ViewComposition } from './types'

export const createEmptyModule = (): ContentModule => ({
    title: '',
    size: 'h6',
    body: '',
    align: 'left',
    border: 'true',
    background: '',
    image: '',
    alt: '',
    position: 'top',
    width: '100%',
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
