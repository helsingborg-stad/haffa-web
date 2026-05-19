import { CategoriesContext } from 'categories'
import { ContentContext } from 'content'
import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { useContext } from 'react'
import { StatisticsContext } from 'statistics'
import { TermsContext } from 'terms'
import { EditContentForm } from './EditContentForm'

export const EditContentView = () => {
    const { getComposition, updateComposition } = useContext(ContentContext)
    const { getTerms } = useContext(TermsContext)
    const { getCategories } = useContext(CategoriesContext)
    const { getSummaries } = useContext(StatisticsContext)

    const inspect = useAsync(() =>
        Promise.all([
            getComposition(),
            getTerms(),
            getCategories(),
            getSummaries(),
        ])
    )

    return inspect({
        resolved: ([page, terms, categories, summaries]) => (
            <EditContentForm
                terms={terms}
                categories={categories}
                page={page}
                summaries={summaries}
                update={updateComposition}
            />
        ),
        rejected: (error) => <ErrorView error={error} />,
        pending: () => null,
    })
}
