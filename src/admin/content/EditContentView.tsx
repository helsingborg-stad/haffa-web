import { ContentContext } from 'content'
import { useContext } from 'react'
import useAsync from 'hooks/use-async'
import { ErrorView } from 'errors'
import { TermsContext } from 'terms'
import { CategoriesContext } from 'categories'
import { EditContentForm } from './EditContentForm'

export const EditContentView = () => {
    const { getComposition, updateComposition } = useContext(ContentContext)
    const { getTerms } = useContext(TermsContext)
    const { getCategories } = useContext(CategoriesContext)

    const inspect = useAsync(() =>
        Promise.all([getComposition(), getTerms(), getCategories()])
    )

    return inspect({
        resolved: ([page, terms, categories]) => (
            <EditContentForm
                terms={terms}
                categories={categories}
                page={page}
                update={updateComposition}
            />
        ),
        rejected: (error) => <ErrorView error={error} />,
        pending: () => null,
    })
}
