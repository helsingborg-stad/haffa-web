import { FC, useCallback, useContext, useState } from 'react'
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material'
import { PhraseContext } from 'phrases'
import { toMap } from 'lib/to-map'
import { PhraseDefinition } from 'phrases/types'
import type { Option } from '../../../options/types'

export const EditPhrasesForm: FC<{
    options: Option[]
    onUpdate: (options: Option[]) => void
}> = ({ options, onUpdate }) => {
    const { phrase, getConfig } = useContext(PhraseContext)

    interface PhraseModel extends PhraseDefinition {
        visible: boolean
    }
    interface Model {
        search: string
        phrases: PhraseModel[]
    }
    const [model, setModel] = useState<Model>(() => {
        const actuals = toMap(
            options,
            ({ key }) => key,
            ({ value }) => value
        )
        return {
            search: '',
            phrases: getConfig()
                // eslint-disable-next-line no-nested-ternary
                .sort(({ key: a }, { key: b }) => (a > b ? 1 : a < b ? -1 : 0))
                .map((d) => ({
                    ...d,
                    actual: actuals[d.key] || '',
                    visible: true,
                })),
        }
    })

    const mutatePhrase = useCallback(
        (m: PhraseModel, patch: Partial<PhraseModel>) => {
            const index = model.phrases.indexOf(m)
            setModel({
                ...model,
                phrases: [
                    ...model.phrases.slice(0, index),
                    { ...model.phrases[index], ...patch },
                    ...model.phrases.slice(index + 1),
                ],
            })
        },
        [model, setModel]
    )

    const updateSearch = useCallback(
        (search: string) => {
            const test = search.trim().toLowerCase()
            setModel({
                search,
                phrases: model.phrases.map((m) => ({
                    ...m,
                    visible: test
                        ? [m.key, m.template, m.actual]
                              .map((s) => s.toLowerCase())
                              .some((v) => v.includes(test))
                        : true,
                })),
            })
        },
        [model, setModel]
    )
    const renderButtons = () => (
        <Grid container>
            <Grid item flex={1} />
            <Grid item>
                <Button
                    variant="contained"
                    onClick={() =>
                        onUpdate(
                            model.phrases
                                .map(({ key, actual }) => ({
                                    key,
                                    value: actual.trim(),
                                }))
                                .filter(({ value }) => value)
                        )
                    }
                >
                    Spara
                </Button>
            </Grid>
        </Grid>
    )

    return (
        <Card>
            <CardActions>{renderButtons()}</CardActions>
            <CardContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: '100%' }}>
                                    {phrase('PHRASES_FIELD_VALUE', 'Värde')}
                                </TableCell>
                                <TableCell>
                                    {phrase(
                                        'PHRASES_FIELD_DEFAULT',
                                        'Fabriksinställning'
                                    )}
                                </TableCell>
                                <TableCell>
                                    {phrase('PHRASES_FIELD_KEY', 'ID')}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={3}>
                                    <TextField
                                        fullWidth
                                        value={model.search}
                                        onChange={(e) =>
                                            updateSearch(e.target.value)
                                        }
                                        label={phrase(
                                            'APP_GENERIC_SEARCH',
                                            'Sök...'
                                        )}
                                        placeholder={phrase(
                                            'APP_GENERIC_SEARCH',
                                            'Sök...'
                                        )}
                                    />
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {model.phrases.map(
                                (m) =>
                                    m.visible && (
                                        <TableRow key={m.key}>
                                            <TableCell>
                                                <TextField
                                                    fullWidth
                                                    value={m.actual}
                                                    placeholder={m.template}
                                                    onChange={(e) =>
                                                        mutatePhrase(m, {
                                                            actual: e.target
                                                                .value,
                                                        })
                                                    }
                                                    sx={{ minWidth: '20em' }}
                                                />
                                            </TableCell>
                                            <TableCell>{m.template}</TableCell>
                                            <TableCell>{m.key}</TableCell>
                                        </TableRow>
                                    )
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
            <CardActions>{renderButtons()}</CardActions>
        </Card>
    )
}
