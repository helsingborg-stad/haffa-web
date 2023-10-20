import { FormControl, TextField } from '@mui/material'
import { AuthContext, EffectivePermissions } from 'auth'
import { ErrorView } from 'errors'
import { AsyncEnqueue, useLiveSearch } from 'hooks/use-live-search'
import { FC, useContext, useState } from 'react'
import { PhraseContext } from 'phrases'
import { rolesArrayToRoles } from 'auth/mappers'
import { SelectUserRoles } from './SelectUserRoles'

export const EffectivePermissionsPanel: FC = () => {
    const { phrase } = useContext(PhraseContext)
    const [email, setEmail] = useState('')
    const { getEffectivePermissions } = useContext(AuthContext)
    const inpect = useLiveSearch(() => getEffectivePermissions(email))

    const renderResult = (
        data: EffectivePermissions | null,
        enqueue: AsyncEnqueue<EffectivePermissions>
    ) => (
        <>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    error={data && data.email ? !data.canLogin : false}
                    value={email}
                    label={phrase('LOGINS_EFFECTIVE_EMAIL', 'Email')}
                    placeholder={phrase('LOGINS_EFFECTIVE_EMAIL', 'Email')}
                    onChange={(e) => {
                        setEmail(e.currentTarget.value)
                        enqueue(() =>
                            getEffectivePermissions(e.currentTarget.value)
                        )
                    }}
                />
            </FormControl>
            {data && data.roles && data.canLogin && (
                <SelectUserRoles
                    userRoles={rolesArrayToRoles(data.roles)}
                    onChange={() => {}}
                    readOnly
                />
            )}
        </>
    )

    return inpect({
        pending: renderResult,
        resolved: renderResult,
        rejected: (e) => <ErrorView error={e} />,
    })
}
