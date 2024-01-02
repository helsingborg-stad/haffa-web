import useAsync from 'hooks/use-async'
import { FC, useContext } from 'react'
import { ErrorView } from 'errors'
import { OptionsContext } from 'options/OptionsContext'
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
