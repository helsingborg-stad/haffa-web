import {
    Box,
    Button,
    Card,
    CardActions,
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
import SaveIcon from '@mui/icons-material/Save'
import { nanoid } from 'nanoid'
import { ApiKey } from 'api-keys/types'
import { Editorial } from 'editorials'

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
        <Card>
            {title && <CardHeader title={title} />}
            <CardContent>
                <Editorial>
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
                    <Table aria-label={phrase('', 'API nycklar')}>
                        <TableHead>
                            <TableRow>
                                <TableCell>{phrase('', 'Nyckel')}</TableCell>
                                <TableCell>{phrase('', 'Email')}</TableCell>
                                <TableCell>
                                    {phrase('', 'Giltig till')}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {model.map(({ email, secret, expires }, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <TextField
                                                fullWidth
                                                type="email"
                                                value={email}
                                                label={phrase('', 'Email')}
                                                placeholder={phrase(
                                                    '',
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
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <TextField
                                                fullWidth
                                                value={secret}
                                                label={phrase('', 'Nyckel')}
                                                placeholder={phrase(
                                                    '',
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
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <TextField
                                                fullWidth
                                                type="date"
                                                value={expires}
                                                label={phrase(
                                                    '',
                                                    'Giltig till'
                                                )}
                                                placeholder={phrase(
                                                    '',
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
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
            <CardActions>
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
                    {phrase('', 'Lägg till nyckel')}
                </Button>
                <Box flex={1} />
                <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() =>
                        onSave(
                            model.map(({ email, secret, expires }) => ({
                                email,
                                secret,
                                expires,
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
