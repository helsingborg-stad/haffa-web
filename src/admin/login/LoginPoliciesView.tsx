import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { FC, useContext } from 'react'
import { SettingsContext } from 'settings'
import { PhraseContext } from 'phrases/PhraseContext'
import { LoginPoliciesForm } from './LoginPoliciesForm'

export const LoginPoliciesView: FC = () => {
    const { getLoginPolicies, updateLoginPolicies } =
        useContext(SettingsContext)
    const { phrase } = useContext(PhraseContext)

    const view = useAsync(getLoginPolicies)

    return view({
        rejected: (error) => <ErrorView error={error} />,
        pending: () => <span />,
        resolved: (policies, _, update) => (
            <LoginPoliciesForm
                loginPolicies={policies}
                title={phrase('', 'Användarpolicy')}
                onSave={(policies) => update(updateLoginPolicies(policies))}
            />
        ),
    })
}
