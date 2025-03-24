import { Button, Card, CardContent, Typography } from '@mui/material'
import { Advert } from 'adverts/types'
import { AuthContext } from 'auth'
import { ErrorView } from 'errors'
import { useLiveSearch } from 'hooks/use-live-search'
import { PhraseContext } from 'phrases'
import { FC, useContext, useState } from 'react'
import { StatisticsContext } from 'statistics'
import { ServerSideLogEvent } from 'statistics/types'
import HistoryIcon from '@mui/icons-material/History'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import { sortBy } from 'lib/sort-by'

const PAGE_SIZE = 5

const EventsCard: FC<{ events: ServerSideLogEvent[] }> = ({ events }) => {
    const { prettyDate, phrase } = useContext(PhraseContext)
    const [index, setIndex] = useState(PAGE_SIZE)

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" align="center">
                    Historik
                </Typography>
                <Timeline>
                    {events.slice(0, index).map(({ event, at, by }, index) => (
                        <TimelineItem key={index}>
                            <TimelineOppositeContent
                                variant="body2"
                                color="text.secondary"
                            >
                                {prettyDate(at)}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <HistoryIcon />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent sx={{ py: 0, px: 2 }}>
                                <Typography
                                    variant="subtitle2"
                                    component="span"
                                >
                                    {phrase(event, event)}
                                </Typography>
                                <Typography>{by}</Typography>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
                <Button
                    fullWidth
                    disabled={index >= events.length}
                    onClick={() => setIndex(index + PAGE_SIZE)}
                >
                    Visa mer...
                </Button>
            </CardContent>
        </Card>
    )
}

export const HistoryPanel: FC<{ advert: Advert }> = ({ advert }) => {
    const { roles } = useContext(AuthContext)
    const { getServerSideAdvertEventLog } = useContext(StatisticsContext)

    const eventsView = useLiveSearch(() =>
        getServerSideAdvertEventLog(advert.id)
    )
    return (
        roles.canManageOwnAdvertsHistory &&
        eventsView({
            pending: () => null,
            rejected: (error) => <ErrorView error={error} />,
            resolved: (events) => (
                <EventsCard
                    events={events.sort(sortBy(({ at }) => at)).reverse()}
                />
            ),
        })
    )
}
