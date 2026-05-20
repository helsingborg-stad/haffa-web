import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { OptionsContext } from 'options/OptionsContext'
import { type FC, useContext } from 'react'
import { EditThemeForm } from './EditThemeForm'

export const EditThemeView: FC = () => {
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
