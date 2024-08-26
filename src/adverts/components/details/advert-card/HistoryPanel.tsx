import { Card, CardContent, Typography } from '@mui/material'
import { Advert } from 'adverts/types'
import { AuthContext } from 'auth'
import { ErrorView } from 'errors'
import { useLiveSearch } from 'hooks/use-live-search'
import { PhraseContext } from 'phrases'
import { FC, useContext } from 'react'
import { StatisticsContext } from 'statistics'
import { ServerSideLogEvent } from 'statistics/types'

// import { Timeline, TimelineItem, TimelineOppositeContent } from '@mui/lab'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import { sortBy } from 'lib/sort-by'

const EventsCard: FC<{ events: ServerSideLogEvent[] }> = ({ events }) => {
    const { prettyDate, phrase } = useContext(PhraseContext)
    return (
        <Card>
            <CardContent>
                <Timeline>
                    {events.map(({ event, at, by }) => (
                        <TimelineItem>
                            <TimelineOppositeContent>
                                {prettyDate(at)}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot />
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography>{phrase(event, event)}</Typography>
                                <Typography>{by}</Typography>
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
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
