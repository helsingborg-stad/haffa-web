import { FC } from 'react'
import { nanoid } from 'nanoid'
import { Category } from 'categories/types'
import { CategoriesForm } from './components/CategoriesForm'

const cat = (label: string, ...categories: Category[]): Category => ({
    id: nanoid(),
    label,
    categories,
})

const range = (count: number) => [...Array(count)]

export const EditCategoriesView: FC = () => {
    const categories = [
        cat(
            'Allt',
            cat('x', ...range(100).map((_, i) => cat(`${i}`))),
            cat(
                'Möbler',
                cat(
                    'Bord',
                    cat('Höj och sänkbara skrivbord'),
                    cat('Slaktbänkar')
                ),
                cat('Stolar')
            )
        ),
    ]
    return <CategoriesForm categories={categories} />
}
