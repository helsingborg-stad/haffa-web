import {
    Button,
    Card,
    CardContent,
    CardHeader,
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
import { ApiKey } from 'api-keys/types'
import { Editorial } from 'editorials'
import { AdminActionPanel } from 'components/AdminActionPanel'
import { AdminEditorialPanel } from 'components/AdminEditorialPanel'

export const ApiKeysForm: FC<{
    title?: string
    onSave: (apiKeys: ApiKey[]) => void
    apiKeys: ApiKey[]
}> = ({ title, apiKeys, onSave }) => {
    const { phrase } = useContext(PhraseContext)

    const [model, setModel] = useState<ApiKey[]>(
        apiKeys.map(({ email, secret, expires }) => ({
            email,
            secret,
            expires,
        }))
    )

    const mutateRow = useCallback(
        (index: number, fn: (policy: ApiKey) => ApiKey) =>
            setModel([
                ...model.slice(0, index),
                fn(model[index]),
                ...model.slice(index + 1),
            ]),
        [model, setModel]
    )
    const mutateRowField = useCallback(
        (index: number, field: keyof ApiKey, value: any) => {
            mutateRow(index, (p) => ({ ...p, [field]: value }))
        },
        [mutateRow]
    )

    return (
        <>
            <AdminEditorialPanel
                headline="ADMIN_APIKEYS_HEADLINE"
                body="ADMIN_APIKEYS_BODY"
            />

            <Card>
                {title && <CardHeader title={title} />}
                <CardContent>
                    <Editorial phraseKey="APIKEYS_EDITORIAL">
                        {`
API nycklar används för icke-interaktiva integrationer och möjliggör externa tjänster att autentisera (via nyckel) 
och auktorisera (via email) gentemot tjänster i Haffa.

Givet api nyckel i autkoriseringsheader körs ett anrop som användaren angivet i email.

> curl -H "Authorization: api-key <nycklel>" https://<haffa>
                    `}
                    </Editorial>
                </CardContent>
                <CardContent>
                    <TableContainer component={Paper}>
                        <Table
                            aria-label={phrase(
                                'ADMIN_APIKEYS_TITLE',
                                'API nycklar'
                            )}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        {phrase('APIKEYS_FIELD_EMAIL', 'Email')}
                                    </TableCell>
                                    <TableCell>
                                        {phrase('APIKEYS_FIELD_KEY', 'Nyckel')}
                                    </TableCell>
                                    <TableCell>
                                        {phrase(
                                            'APIKEYS_FIELD_EXPIRES',
                                            'Giltig till'
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {model.map(
                                    ({ email, secret, expires }, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <FormControl
                                                    fullWidth
                                                    sx={{ mb: 2 }}
                                                >
                                                    <TextField
                                                        fullWidth
                                                        type="email"
                                                        value={email}
                                                        label={phrase(
                                                            'APIKEYS_FIELD_EMAIL',
                                                            'Email'
                                                        )}
                                                        placeholder={phrase(
                                                            'APIKEYS_FIELD_EMAIL',
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
                                            </TableCell>
                                            <TableCell>
                                                <FormControl
                                                    fullWidth
                                                    sx={{ mb: 2 }}
                                                >
                                                    <TextField
                                                        fullWidth
                                                        value={secret}
                                                        label={phrase(
                                                            'APIKEYS_FIELD_KEY',
                                                            'Nyckel'
                                                        )}
                                                        placeholder={phrase(
                                                            'APIKEYS_FIELD_KEY',
                                                            'Nyckel'
                                                        )}
                                                        onChange={(e) =>
                                                            mutateRowField(
                                                                index,
                                                                'secret',
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                            </TableCell>
                                            <TableCell>
                                                <FormControl
                                                    fullWidth
                                                    sx={{ mb: 2 }}
                                                >
                                                    <TextField
                                                        fullWidth
                                                        type="date"
                                                        value={expires}
                                                        label={phrase(
                                                            'APIKEYS_FIELD_EXPIRES',
                                                            'Giltig till'
                                                        )}
                                                        placeholder={phrase(
                                                            'APIKEYS_FIELD_EXPIRES',
                                                            'Giltig till'
                                                        )}
                                                        onChange={(e) =>
                                                            mutateRowField(
                                                                index,
                                                                'expires',
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </FormControl>
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
                            model.map(({ email, secret, expires }) => ({
                                email,
                                secret,
                                expires,
                            }))
                        )
                    }
                >
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() =>
                            setModel(
                                model.concat({
                                    email: '',
                                    secret: nanoid(),
                                    expires: '',
                                })
                            )
                        }
                    >
                        {phrase('APIKEYS_ADD', 'Lägg till nyckel')}
                    </Button>
                </AdminActionPanel>
            </Card>
        </>
    )
}
