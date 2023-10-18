import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { FC, useContext } from 'react'
import { OptionsContext } from 'options/OptionsContext'
import { EditBrandingForm } from './EditBrandingForm'

export const EditBrandingView: FC = () => {
    const { getOptions, updateOptions } = useContext(OptionsContext)

    const inspect = useAsync(getOptions)

    return inspect({
        resolved: (options, _, update) => (
            <EditBrandingForm
                options={options}
                onUpdate={(t) => update(updateOptions(t))}
            />
        ),
        rejected: (error) => <ErrorView error={error} />,
        pending: () => null,
    })
}
