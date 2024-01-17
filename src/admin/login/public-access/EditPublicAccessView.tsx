import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { LoginPoliciesContext } from 'login-policies'
import { FC, useContext } from 'react'
import { UserMappingConfigurationForm } from './UserMappingConfigurationForm'

export const EditPublicAccessView: FC = () => {
    const { getUserMappingConfiguration, updateUserMappingConfiguration } =
        useContext(LoginPoliciesContext)
    const view = useAsync(getUserMappingConfiguration)

    return view({
        rejected: (error) => <ErrorView error={error} />,
        pending: () => <span />,
        resolved: (c, _, update) => (
            <UserMappingConfigurationForm
                userMappingConfiguration={c}
                onSave={(c) => update(updateUserMappingConfiguration(c))}
            />
        ),
    })
}
