import useAsync from 'hooks/use-async'
import { FC, useContext } from 'react'
import { ErrorView } from 'errors'
import { OptionsContext } from 'options/OptionsContext'
import { EditLabelsForm } from './EditLabelsForm'

export const EditLabelsView: FC = () => {
    const { getLabelOptions, updateLabelOptions } = useContext(OptionsContext)
    const inspect = useAsync(getLabelOptions)

    return inspect({
        rejected: (error) => <ErrorView error={error} />,
        pending: () => <span />,
        resolved: (options) => (
            <EditLabelsForm options={options} onUpdate={updateLabelOptions} />
        ),
    })
}
