import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { FC, useContext } from 'react'
import { LoginPoliciesContext } from 'login-policies'
import { LoginPoliciesForm } from './LoginPoliciesForm'

export const EditLoginPoliciesView: FC<{ title?: string }> = ({ title }) => {
    const { getLoginPolicies, updateLoginPolicies } =
        useContext(LoginPoliciesContext)

    const view = useAsync(getLoginPolicies)

    return view({
        rejected: (error) => <ErrorView error={error} />,
        pending: () => <span />,
        resolved: (policies, _, update) => (
            <LoginPoliciesForm
                loginPolicies={policies}
                title={title}
                onSave={(policies) => update(updateLoginPolicies(policies))}
            />
        ),
    })
}
