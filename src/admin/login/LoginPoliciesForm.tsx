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

export const LoginPoliciesForm: FC<{
    title?: string
    onSave: (policies: LoginPolicy[]) => void
    loginPolicies: LoginPolicy[]
}> = ({ title, loginPolicies, onSave }) => {
    const { phrase } = useContext(PhraseContext)

    interface EditablePolicy {
        id: string
        email: string
        roles: string
        deny: boolean
    }

    const [policies, setPolicies] = useState<EditablePolicy[]>(
        loginPolicies.map(({ emailPattern, roles, deny }) => ({
            id: nanoid(),
            email: emailPattern,
            roles: roles.join(','),
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
                <Editorial variant="info">
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
                                <TableCell>{phrase('', 'email')}</TableCell>
                                <TableCell>{phrase('', 'roller')}</TableCell>
                                <TableCell>{phrase('', 'neka')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {policies.map(
                                ({ id, email, roles, deny }, index) => (
                                    <TableRow key={id}>
                                        <TableCell>
                                            <TextField
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
                                            <TextField
                                                value={roles}
                                                onChange={(e) =>
                                                    mutateRowField(
                                                        index,
                                                        'roles',
                                                        e.target.value
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
                                roles: '',
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
                                roles: roles.split(','),
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
