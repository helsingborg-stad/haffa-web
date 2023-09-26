import { ApiKeysContext } from 'api-keys'
import useAsync from 'hooks/use-async'
import { FC, useContext } from 'react'
import { ErrorView } from 'errors'
import { ApiKeysForm } from './ApiKeysForm'

export const EditApiKeysView: FC<{ title?: string }> = ({ title }) => {
    const { getApiKeys, updateApiKeys } = useContext(ApiKeysContext)

    const view = useAsync(getApiKeys)

    return view({
        rejected: (error) => <ErrorView error={error} />,
        pending: () => <span />,
        resolved: (apiKeys, _, update) => (
            <ApiKeysForm
                apiKeys={apiKeys}
                title={title}
                onSave={(apiKeys) => update(updateApiKeys(apiKeys))}
            />
        ),
    })
}
