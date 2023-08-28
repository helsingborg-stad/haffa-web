import { FC, useContext } from 'react'
import { SettingsContext } from 'settings'
import useAsync from 'hooks/use-async'
import { ErrorView } from 'errors'
import { CategoriesForm } from './components/CategoriesForm'
/*
const cat = (label: string, ...categories: Category[]): Category => ({
    id: nanoid(),
    label,
    categories,
})

const range = (count: number) => [...Array(count)]
*/
export const EditCategoriesView: FC = () => {
    const { getCategories, updateCategories } = useContext(SettingsContext)
    const inspect = useAsync(getCategories)

    return inspect({
        resolved: (categories, _, update) => (
            <CategoriesForm
                categories={categories}
                onSave={(categories) => update(updateCategories(categories))}
            />
        ),
        rejected: (error) => <ErrorView error={error} />,
        pending: () => null,
    })
    /*
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
*/
}
