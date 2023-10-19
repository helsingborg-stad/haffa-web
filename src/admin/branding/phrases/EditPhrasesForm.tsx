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
import type { Option } from '../../../options/types'

export const EditPhrasesForm: FC<{
    options: Option[]
    onUpdate: (options: Option[]) => void
}> = ({ options, onUpdate }) => {
    const { phrase, getConfig } = useContext(PhraseContext)
    const [model, setModel] = useState(() => {
        const actuals = toMap(
            options,
            ({ key }) => key,
            ({ value }) => value
        )
        return (
            getConfig()
                // eslint-disable-next-line no-nested-ternary
                .sort(({ key: a }, { key: b }) => (a > b ? 1 : a < b ? -1 : 0))
                .map((d) => ({ ...d, actual: actuals[d.key] || '' }))
        )
    })
    const mutateActualFor = useCallback(
        (index: number, actual: string) => {
            setModel([
                ...model.slice(0, index),
                { ...model[index], actual },
                ...model.slice(index + 1),
            ])
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
                            model
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
        <Card sx={{ width: '100%', overflow: 'hidden' }}>
            <CardActions>{renderButtons()}</CardActions>
            <CardContent>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader>
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
                        </TableHead>
                        <TableBody>
                            {model.map((m, index) => (
                                <TableRow key={m.key}>
                                    <TableCell>
                                        <TextField
                                            fullWidth
                                            value={m.actual}
                                            placeholder={m.template}
                                            onChange={(e) =>
                                                mutateActualFor(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>{m.template}</TableCell>
                                    <TableCell>{m.key}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
            <CardActions>{renderButtons()}</CardActions>
        </Card>
    )
}
