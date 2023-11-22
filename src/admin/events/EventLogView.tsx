import { useLiveSearch } from 'hooks/use-live-search'
import { FC, useCallback, useContext, useMemo, useState } from 'react'
import { StatisticsContext } from 'statistics'
import dayjs from 'dayjs'
import { ErrorView } from 'errors'
import {
    Button,
    Card,
    CardContent,
    Grid,
    InputAdornment,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material'
import { ServerSideLogEvent } from 'statistics/types'
import { PhraseContext } from 'phrases'
import * as xlsx from 'xlsx'
import * as fileSaver from 'file-saver'

interface EventsSearchParams {
    from: string
    to: string
}

type ServerSideLogEventLabels = {
    [Property in keyof ServerSideLogEvent]: string
}

export const EventsTable: FC<{
    events: ServerSideLogEvent[]
    labels: ServerSideLogEventLabels
}> = ({ events, labels }) => (
    <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>{labels.event}</TableCell>
                    <TableCell>{labels.at}</TableCell>
                    <TableCell>{labels.category}</TableCell>
                    <TableCell>{labels.organization}</TableCell>
                    <TableCell>{labels.co2kg}</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {events.map(({ event, at, category, organization, co2kg }) => (
                    <TableRow key={`${event}@${at}`}>
                        <TableCell>{event}</TableCell>
                        <TableCell>{dayjs(at).format('YYYY-MM-DD')}</TableCell>
                        <TableCell>{category}</TableCell>
                        <TableCell>{organization}</TableCell>
                        <TableCell>{co2kg}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
)

export const SearchHeader: FC<{
    searchParams: EventsSearchParams
    setSearchParams: (p: EventsSearchParams) => void
}> = ({ searchParams, setSearchParams }) => {
    const now = new Date()
    const thisYear = new Date(now.getFullYear(), 0, 1)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const quickFilters = [
        {
            label: '30 dagar',
            from: dayjs(now).add(-30, 'days').format('YYYY-MM-DD'),
            to: dayjs(now).add(1, 'days').format('YYYY-MM-DD'),
        },
        {
            label: 'Denna månad',
            from: dayjs(thisMonth).format('YYYY-MM-DD'),
            to: dayjs(thisMonth).add(1, 'month').format('YYYY-MM-DD'),
        },
        {
            label: 'Detta år',
            from: dayjs(thisYear).format('YYYY-MM-DD'),
            to: dayjs(thisYear).add(1, 'year').format('YYYY-MM-DD'),
        },
    ]

    return (
        <Grid container alignContent="center" alignItems="center" spacing={1}>
            <Grid item>
                <TextField
                    value={searchParams.from}
                    type="date"
                    onChange={(e) =>
                        setSearchParams({
                            ...searchParams,
                            from: e.currentTarget.value,
                        })
                    }
                />
            </Grid>
            <Grid item>
                <TextField
                    value={searchParams.to}
                    type="date"
                    onChange={(e) =>
                        setSearchParams({
                            ...searchParams,
                            to: e.currentTarget.value,
                        })
                    }
                />
            </Grid>
            {quickFilters.map((f) => (
                <Grid item key={f.label}>
                    <Button
                        variant="outlined"
                        onClick={() =>
                            setSearchParams({
                                ...searchParams,
                                from: f.from,
                                to: f.to,
                            })
                        }
                    >
                        {f.label}
                    </Button>
                </Grid>
            ))}
        </Grid>
    )
}

export const DownloadHeader: FC<{
    onExport: (name: string) => void
}> = ({ onExport }) => {
    const { phrase } = useContext(PhraseContext)
    const [name, setName] = useState('haffa')
    return (
        <TextField
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            label={phrase('EVENTLOG_EXPORT_FILENAME', 'Filnamn')}
            placeholder={phrase('EVENTLOG_EXPORT_FILENAME', 'Filnamn')}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end" sx={{ gap: 1 }}>
                        .xlsx
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => onExport(name)}
                        >
                            {phrase(
                                'EVENTLOG_EXPOR_FILENAME',
                                'Exportera till excel'
                            )}
                        </Button>
                    </InputAdornment>
                ),
            }}
        />
    )
}

export const EventLogView: FC = () => {
    const { getServerSideEventLog } = useContext(StatisticsContext)
    const { phrase } = useContext(PhraseContext)

    const search = useCallback(
        (p: EventsSearchParams) =>
            getServerSideEventLog(
                p.from ? new Date(p.from) : null,
                p.to ? new Date(p.to) : null
            ).then((events) => ({
                events,
                p,
            })),
        [getServerSideEventLog]
    )

    const view = useLiveSearch(() =>
        search({
            from: dayjs(new Date()).add(-30, 'days').format('YYYY-MM-DD'),
            to: dayjs().format('YYYY-MM-DD'),
        })
    )

    const eventLabels: ServerSideLogEventLabels = useMemo(
        () => ({
            event: phrase('EVENTLOG_FIELD_EVENT', 'Händelse'),
            at: phrase('EVENTLOG_FIELD_DAY', 'Dag'),
            by: phrase('EVENTLOG_FIELD_USER', 'Användare'),
            category: phrase('ADVERT_FIELD_CATEGORY', 'Kategori'),
            organization: phrase('ADVERT_FIELD_ORGANIZATION', 'Organisation'),
            co2kg: phrase('CATEGORIES_FIELD_C02', 'CO₂ besparing'),
        }),
        [phrase]
    )

    const exportExcel = useCallback(
        (name: string, events: ServerSideLogEvent[]) => {
            const headers = [
                eventLabels.event,
                eventLabels.at,
                eventLabels.quantity,
                eventLabels.organization,
                eventLabels.category,
                eventLabels.co2kg,
            ]
            const data = events.map(
                ({ event, at, quantity, organization, category, co2kg }) => [
                    event,
                    at,
                    quantity,
                    organization,
                    category,
                    co2kg,
                ]
            )
            const ws = xlsx.utils.aoa_to_sheet([headers, ...data])
            const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
            const excelBuffer = xlsx.write(wb, {
                bookType: 'xlsx',
                type: 'array',
            })
            const buffer = new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
            })
            fileSaver.saveAs(buffer, `${name}.xlsx`)
        },
        [eventLabels]
    )

    return view({
        pending: () => <LinearProgress />,
        resolved: ({ p, events }, enqueue) => (
            <Card>
                <CardContent>
                    <SearchHeader
                        searchParams={p}
                        setSearchParams={(p) => enqueue(() => search(p))}
                    />
                </CardContent>
                <CardContent>
                    <DownloadHeader
                        onExport={(name) => exportExcel(name, events)}
                    />
                </CardContent>
                <CardContent>
                    <EventsTable events={events} labels={eventLabels} />
                </CardContent>
            </Card>
        ),
        rejected: (e) => <ErrorView error={e} />,
    })
}
