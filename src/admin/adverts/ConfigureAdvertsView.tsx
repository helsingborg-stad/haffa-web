import { FC, useContext } from 'react'
import { AdvertFieldsContext } from 'advert-field-config'
import useAsync from 'hooks/use-async'
import { ErrorView } from 'errors'
import { ConfigureAdvertsForm } from './ConfigureAdvertsForm'

export const ConfigureAdvertsView: FC = () => {
    const { getFieldConfig, updateFieldConfig } =
        useContext(AdvertFieldsContext)

    const inspect = useAsync(getFieldConfig)

    return inspect({
        resolved: (fieldConfig, _) => (
            <ConfigureAdvertsForm
                config={fieldConfig}
                update={updateFieldConfig}
            />
        ),
        rejected: (error) => <ErrorView error={error} />,
        pending: () => null,
    })
}
