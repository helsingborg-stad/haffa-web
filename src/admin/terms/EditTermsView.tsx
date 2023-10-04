import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { FC, useContext } from 'react'
import { TermsContext } from 'terms'
import { EditTermsForm } from './EditTermsForm'

export const EditTermsView: FC = () => {
    const { getTerms, updateTerms } = useContext(TermsContext)

    const inspect = useAsync(getTerms)

    return inspect({
        resolved: (terms, _, update) => (
            <EditTermsForm
                terms={terms}
                onUpdate={(t) => update(updateTerms(t))}
            />
        ),
        rejected: (error) => <ErrorView error={error} />,
        pending: () => null,
    })
}
