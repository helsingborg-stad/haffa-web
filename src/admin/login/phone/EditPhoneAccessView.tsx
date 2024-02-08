import {
    Card,
    CardContent,
    FormControlLabel,
    FormGroup,
    Stack,
    Switch,
    TextField,
} from '@mui/material'
import { rolesArrayToRoles, rolesToRolesArray } from 'auth'
import { AdminActionPanel } from 'components/AdminActionPanel'
import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { LoginPoliciesContext } from 'login-policies'
import { UserMappingConfiguration } from 'login-policies/types'
import { FC, useContext, useRef, useState } from 'react'
import { PhraseContext } from 'phrases'
import { SelectUserRoles } from '../login-policies/SelectUserRoles'

const EditPhoneAccessForm: FC<{
    userMappingConfiguration: UserMappingConfiguration
    onSave: (c: Partial<UserMappingConfiguration>) => void
}> = ({ userMappingConfiguration, onSave }) => {
    const { phrase } = useContext(PhraseContext)
    const [allowPhoneUsers, setAllowPhoneUsers] = useState(
        userMappingConfiguration.phone.allowPhoneUsers
    )
    const [sender, setSender] = useState(userMappingConfiguration.phone.sender)
    const [country, setCountry] = useState(
        userMappingConfiguration.phone.country
    )
    const [roles, setRoles] = useState(
        rolesArrayToRoles(userMappingConfiguration.phone.roles)
    )
    const formRef = useRef<HTMLFormElement | null>(null)

    return (
        <form
            ref={formRef}
            onSubmit={(e) => {
                e.preventDefault()
                onSave({
                    phone: {
                        allowPhoneUsers,
                        sender,
                        country,
                        roles: rolesToRolesArray(roles),
                    },
                })
                return false
            }}
        >
            <Card>
                <CardContent>
                    <Stack direction="column" spacing={2}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={allowPhoneUsers}
                                        onChange={(e) =>
                                            setAllowPhoneUsers(e.target.checked)
                                        }
                                    />
                                }
                                label={phrase(
                                    'PHONE_ACCESS_ALLOW',
                                    'Tillåt inloggning med telefon/SMS'
                                )}
                            />
                        </FormGroup>
                        <TextField
                            fullWidth
                            value={sender}
                            onChange={(e) => setSender(e.target.value)}
                            inputProps={{ minLength: 5, maxLength: 11 }}
                            label={phrase(
                                'LOGINS_FIELD_PHONE_SENDER',
                                'Sändarnamn'
                            )}
                            placeholder={phrase(
                                'LOGINS_FIELD_PHONE_SENDER',
                                'Sändarnamn'
                            )}
                        />
                        <TextField
                            fullWidth
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            label={phrase(
                                'LOGINS_FIELD_PHONE_VALIDATION_COUNTRY',
                                'Landskod för validering av telefonnummer'
                            )}
                            placeholder={phrase(
                                'LOGINS_FIELD_PHONE_VALIDATION_COUNTRY',
                                'Landskod för validering av telefonnummer'
                            )}
                        />
                        <SelectUserRoles
                            userRoles={roles}
                            onChange={(roles) => setRoles(roles)}
                        />
                    </Stack>
                    <AdminActionPanel
                        onSave={() => formRef.current?.submit()}
                    />
                </CardContent>
            </Card>
        </form>
    )
}

export const EditPhoneAccessView: FC = () => {
    const { getUserMappingConfiguration, updateUserMappingConfiguration } =
        useContext(LoginPoliciesContext)
    const view = useAsync(getUserMappingConfiguration)

    return view({
        rejected: (error) => <ErrorView error={error} />,
        pending: () => <span />,
        resolved: (c, _, update) => (
            <EditPhoneAccessForm
                userMappingConfiguration={c}
                onSave={(c) => update(updateUserMappingConfiguration(c))}
            />
        ),
    })
}
