import { FC, useContext } from 'react'
import { OptionsContext } from 'options/OptionsContext'
import useAsync from 'hooks/use-async'
import { ErrorView } from 'errors'
import { EditThemeForm } from './EditThemeForm'

export const EditThemePanel: FC = () => {
    const { getThemeOptions, updateThemeOptions } = useContext(OptionsContext)
    const inspectTheme = useAsync(getThemeOptions)
    return inspectTheme({
        resolved: (options, _, update) => (
            <EditThemeForm
                options={options}
                onUpdate={(t) => update(updateThemeOptions(t))}
            />
        ),
        rejected: (error) => <ErrorView error={error} />,
        pending: () => null,
    })
}
