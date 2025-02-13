import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { FC, useCallback, useContext } from 'react'
import { TermsContext } from 'terms'
import { AdminEditorialPanel } from 'components/AdminEditorialPanel'
import { TagsContext } from 'tags'
import { EditTagDescriptionsForm } from './EditTagDescriptionsForm'

export const EditTagDescriptionsView: FC = () => {
    const { getTerms } = useContext(TermsContext)
    const { getTagDescriptions, updateTagDescriptions } =
        useContext(TagsContext)

    const getModel = useCallback(
        () =>
            Promise.all([getTagDescriptions(), getTerms()]).then(
                ([tagDescriptions, terms]) => ({ terms, tagDescriptions })
            ),
        [getTerms, getTagDescriptions]
    )

    const inspect = useAsync(getModel)

    return inspect({
        resolved: ({ terms, tagDescriptions }, _, update) => (
            <>
                <AdminEditorialPanel
                    headline="ADMIN_TAG_DESCRIPTIONS_HEADLINE"
                    body="ADMIN_TAG_DESCRIPTIONS_BODY"
                />
                <EditTagDescriptionsForm
                    tagDescriptions={tagDescriptions}
                    tags={terms.tags}
                    onUpdate={(tagDescriptions) =>
                        update(
                            updateTagDescriptions(tagDescriptions).then(() =>
                                getModel()
                            )
                        )
                    }
                />
            </>
        ),
        rejected: (error) => <ErrorView error={error} />,
        pending: () => null,
    })
}
