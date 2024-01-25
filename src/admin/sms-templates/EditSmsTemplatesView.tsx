import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { FC, useContext } from 'react'
import { SmsTemplateContext } from 'sms-templates'
import { EditSmsTemplatesForm } from './EditSmsTemplatesForm'

export const EditSmsTemplatesView: FC = () => {
    const { getSmsTemplates, updateSmsTemplates } =
        useContext(SmsTemplateContext)
    const inspect = useAsync(getSmsTemplates)
    return inspect({
        resolved: (templates, _, update) => (
            <EditSmsTemplatesForm
                templates={templates}
                onUpdate={(templates) => update(updateSmsTemplates(templates))}
            />
        ),
        rejected: (error) => <ErrorView error={error} />,
        pending: () => null,
    })
}
