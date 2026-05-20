import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { OptionsContext } from 'options/OptionsContext'
import { type FC, useContext } from 'react'
import { EditHtmlForm } from './EditHtmlForm'

export const EditHtmlView: FC = () => {
    const { getHtmlOptions, updateHtmlOptions } = useContext(OptionsContext)
    const inspect = useAsync(getHtmlOptions)

    return inspect({
        rejected: (error) => <ErrorView error={error} />,
        pending: () => <span />,
        resolved: (options) => (
            <EditHtmlForm options={options} onUpdate={updateHtmlOptions} />
        ),
    })
}
