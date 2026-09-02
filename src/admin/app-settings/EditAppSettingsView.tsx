import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { OptionsContext } from 'options/OptionsContext'
import { type FC, useContext } from 'react'
import { EditAppSettingsForm } from './EditAppSettingsForm'

export const EditAppSettingsView: FC = () => {
    const { getAppSettingsOptions, updateAppSettingsOptions } =
        useContext(OptionsContext)
    const inspect = useAsync(getAppSettingsOptions)

    return inspect({
        rejected: (error) => <ErrorView error={error} />,
        pending: () => <span />,
        resolved: (options) => (
            <EditAppSettingsForm
                options={options}
                onUpdate={updateAppSettingsOptions}
            />
        ),
    })
}
