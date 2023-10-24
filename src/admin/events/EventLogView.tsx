import { useLiveSearch } from 'hooks/use-live-search'
import { FC, useCallback, useContext } from 'react'
import { StatisticsContext } from 'statistics'
import dayjs from 'dayjs'
import { ErrorView } from 'errors'
import {
    Button,
    Card,
    CardContent,
    Grid,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
} from '@mui/material'
import { ServerSideLogEvent } from 'statistics/types'

interface EventsSearchParams {
    from: string
    to: string
}

export const EventsTable: FC<{ events: ServerSideLogEvent[] }> = ({
    events,
}) => (
    <TableContainer>
        <Table>
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

export const EventLogView: FC = () => {
    const { getServerSideEventLog } = useContext(StatisticsContext)

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
                    <EventsTable events={events} />
                </CardContent>
            </Card>
        ),
        rejected: (e) => <ErrorView error={e} />,
    })
}
