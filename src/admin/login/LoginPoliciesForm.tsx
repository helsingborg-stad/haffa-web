import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Checkbox,
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
import { LoginPolicy } from 'settings/types'
import AddIcon from '@mui/icons-material/Add'
import SaveIcon from '@mui/icons-material/Save'
import { nanoid } from 'nanoid'
import { Editorial } from 'editorials'
import * as types from 'admin/types'
import { SelectUserRoles } from './SelectUserRoles'

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
        roles: types.HaffaUserRoles
    }

    const [policies, setPolicies] = useState<EditablePolicy[]>(
        loginPolicies.map(({ emailPattern, roles, deny }) => ({
            id: nanoid(),
            email: emailPattern,
            roles,
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
        <Card>
            {title && <CardHeader title={title} />}
            <CardContent>
                <Editorial severity="info">
                    {`
                    Här anges vilka användare som ges eller nekas tillträde till
                    sajten. Användare matchas mot email
                    
                    - *.@exempel.se matchar alla som tillhör emaildomänen @exempel.se
                    - test@exempel.se matchar användare exakt

                    Regler utan email tas automatiskt bort.
                    `}
                </Editorial>
            </CardContent>
            <CardContent>
                <TableContainer component={Paper}>
                    <Table aria-label={phrase('', 'Loginregler')}>
                        <TableHead>
                            <TableRow>
                                <TableCell>{phrase('', 'Email')}</TableCell>
                                <TableCell>
                                    {phrase('', 'Behörigheter')}
                                </TableCell>
                                <TableCell>{phrase('', 'Neka')}</TableCell>
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
                                            <TextField
                                                fullWidth
                                                value={email}
                                                onChange={(e) =>
                                                    mutateRowField(
                                                        index,
                                                        'email',
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
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
            <CardActions>
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
                    {phrase('', 'Lägg till regel')}
                </Button>
                <Box flex={1} />
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() =>
                        onSave(
                            policies.map(({ email, roles, deny }) => ({
                                emailPattern: email,
                                roles,
                                deny,
                            }))
                        )
                    }
                >
                    {phrase('', 'Spara')}
                </Button>
            </CardActions>
        </Card>
    )
}
