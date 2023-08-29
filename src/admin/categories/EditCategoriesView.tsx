import { FC, useContext } from 'react'
import { SettingsContext } from 'settings'
import useAsync from 'hooks/use-async'
import { ErrorView } from 'errors'
import { Category } from 'categories/types'
import { CategoriesForm } from './components/CategoriesForm'
import { TreeHookViewState } from './components/use-tree'

export const EditCategoriesView: FC = () => {
    const { getCategories, updateCategories } = useContext(SettingsContext)
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
