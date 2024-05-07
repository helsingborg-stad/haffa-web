import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { OptionsContext } from 'options/OptionsContext'
import { FC, useCallback, useContext } from 'react'
import { TermsContext } from 'terms'
import { AdminEditorialPanel } from 'components/AdminEditorialPanel'
import type { Option } from '../../options/types'
import { EditTagDescriptionsForm } from './EditTagDescriptionsForm'

const sanitizeTagDescriptions = (tagDescriptions: Option[]): Option[] =>
    tagDescriptions.filter((o) => o.key.trim()).filter((o) => o.value.trim())

export const EditTagDescriptionsView: FC = () => {
    const { getTerms } = useContext(TermsContext)
    const { getTagDescriptionOptions, updateTagDescriptionOptions } =
        useContext(OptionsContext)

    const getModel = useCallback(
        () =>
            Promise.all([getTagDescriptionOptions(), getTerms()]).then(
                ([tagDescriptions, terms]) => ({ terms, tagDescriptions })
            ),
        [getTerms, getTagDescriptionOptions]
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
                    options={tagDescriptions}
                    tags={terms.tags}
                    onUpdate={(tagDescriptions) =>
                        update(
                            updateTagDescriptionOptions(
                                sanitizeTagDescriptions(tagDescriptions)
                            ).then(() => getModel())
                        )
                    }
                />
            </>
        ),
        rejected: (error) => <ErrorView error={error} />,
        pending: () => null,
    })
}
