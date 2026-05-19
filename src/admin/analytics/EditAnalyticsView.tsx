import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { OptionsContext } from 'options/OptionsContext'
import { type FC, useContext } from 'react'
import { EditAnalyticsForm } from './EditAnalyticsForm'

export const EditAnalyticsView: FC = () => {
    const { getAnalyticsOptions, updateAnalyticsOptions } =
        useContext(OptionsContext)
    const inspect = useAsync(getAnalyticsOptions)

    return inspect({
        rejected: (error) => <ErrorView error={error} />,
        pending: () => <span />,
        resolved: (options) => (
            <EditAnalyticsForm
                options={options}
                onUpdate={updateAnalyticsOptions}
            />
        ),
    })
}
