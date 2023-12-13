import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    FormControl,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useCallback, useContext, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { nanoid } from 'nanoid'
import { Editorial } from 'editorials'
import { LoginPolicy } from 'login-policies/types'
import { rolesArrayToRoles, rolesToRolesArray } from 'auth/mappers'
import { HaffaUserRoles } from 'auth'
import { AdminActionPanel } from 'components/AdminActionPanel'
import { AdminEditorialPanel } from 'components/AdminEditorialPanel'
import { SelectUserRoles } from './SelectUserRoles'
import { EffectivePermissionsPanel } from './EffectivePermissionsPanel'

export const LoginPoliciesForm: FC<{
    title?: string
    onSave: (policies: LoginPolicy[]) => void
    loginPolicies: LoginPolicy[]
}> = ({ title, loginPolicies, onSave }) => {
    const { phrase } = useContext(PhraseContext)

    interface EditablePolicy {
        id: string
        email: string
        deny: boolean
        roles: HaffaUserRoles
    }

    const [policies, setPolicies] = useState<EditablePolicy[]>(
        loginPolicies.map(({ emailPattern, roles, deny }) => ({
            id: nanoid(),
            email: emailPattern,
            roles: rolesArrayToRoles(roles),
            deny,
        }))
    )

    const mutateRow = useCallback(
        (index: number, fn: (policy: EditablePolicy) => EditablePolicy) =>
            setPolicies([
                ...policies.slice(0, index),
                fn(policies[index]),
                ...policies.slice(index + 1),
            ]),
        [policies, setPolicies]
    )
    const mutateRowField = useCallback(
        (index: number, field: keyof EditablePolicy, value: any) => {
            mutateRow(index, (p) => ({ ...p, [field]: value }))
        },
        [mutateRow]
    )

    return (
        <>
            <AdminEditorialPanel
                headline="ADMIN_LOGINS_HEADLINE"
                body="ADMIN_LOGINS_BODY"
            />

            <Card>
                {title && <CardHeader title={title} />}
                <CardContent>
                    <Editorial phraseKey="LOGINS_EDITORIAL">
                        {`
                    Här anges vilka användare som ges eller nekas tillträde till
                    sajten. Användare matchas mot email
                    
                    - *@exempel.se matchar alla som tillhör emaildomänen @exempel.se
                    - test@exempel.se matchar användare exakt

                    Regler utan email tas automatiskt bort.
                    `}
                    </Editorial>
                </CardContent>
                <CardContent>
                    <TableContainer component={Paper}>
                        <Table
                            aria-label={phrase(
                                'ADMIN_LOGINS_TITLE',
                                'Användare & behörigheter'
                            )}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        {phrase(
                                            'LOGINS_FIELD_PERMISSIONS',
                                            'Email & behörigheter'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {phrase('LOGINS_DENY', 'Neka')}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {policies.map(
                                    (
                                        { id, email, deny, roles: userRoles },
                                        index
                                    ) => (
                                        <TableRow key={id}>
                                            <TableCell>
                                                <FormControl
                                                    fullWidth
                                                    sx={{ mb: 2 }}
                                                >
                                                    <TextField
                                                        fullWidth
                                                        value={email}
                                                        label={phrase(
                                                            'LOGINS_FIELD_EMAIL',
                                                            'Email'
                                                        )}
                                                        placeholder={phrase(
                                                            'LOGINS_FIELD_EMAIL',
                                                            'Email'
                                                        )}
                                                        onChange={(e) =>
                                                            mutateRowField(
                                                                index,
                                                                'email',
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <SelectUserRoles
                                                    userRoles={userRoles}
                                                    onChange={(roles) =>
                                                        mutateRowField(
                                                            index,
                                                            'roles',
                                                            roles
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    checked={deny}
                                                    onChange={(e) =>
                                                        mutateRowField(
                                                            index,
                                                            'deny',
                                                            e.target.checked
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
                <AdminActionPanel
                    onSave={() =>
                        onSave(
                            policies.map(({ email, roles, deny }) => ({
                                emailPattern: email,
                                roles: rolesToRolesArray(roles),
                                deny,
                            }))
                        )
                    }
                >
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() =>
                            setPolicies(
                                policies.concat({
                                    id: nanoid(),
                                    email: '',
                                    roles: {
                                        canEditOwnAdverts: true,
                                        canArchiveOwnAdverts: true,
                                        canRemoveOwnAdverts: true,
                                        canReserveAdverts: true,
                                        canCollectAdverts: true,
                                    },
                                    deny: false,
                                })
                            )
                        }
                    >
                        {phrase('LOGINS_ADD_RULE', 'Lägg till regel')}
                    </Button>
                </AdminActionPanel>
            </Card>
            <Card sx={{ mt: 2 }}>
                <CardHeader
                    title={phrase(
                        'LOGINS_EFECTIVE_PERMISSIONS',
                        'Effektiva behörigheter'
                    )}
                />
                <CardContent>
                    <EffectivePermissionsPanel />
                </CardContent>
            </Card>
        </>
    )
}
