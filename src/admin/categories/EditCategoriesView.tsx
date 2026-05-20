import { CategoriesContext } from 'categories'
import type { Category } from 'categories/types'
import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { type FC, useContext } from 'react'
import { CategoriesForm } from './components/CategoriesForm'
import type { TreeHookViewState } from './components/use-tree'

export const EditCategoriesView: FC = () => {
    const { getCategories, updateCategories } = useContext(CategoriesContext)
    const inspect = useAsync<Category[], TreeHookViewState>(getCategories)

    return inspect({
        resolved: (categories, viewState, update) => (
            <CategoriesForm
                categories={categories}
                viewState={viewState}
                onSave={(categories, vs) =>
                    update(updateCategories(categories), vs)
                }
            />
        ),
        rejected: (error) => <ErrorView error={error} />,
        pending: () => null,
    })
}
