import { Box, Card, CardContent, Typography } from '@mui/material'
import { PhraseContext } from 'phrases'
import { type FC, useContext, useMemo } from 'react'
import type { ServerSideLogEvent } from 'statistics/types'

const COLLECTED_EVENT = 'advert-was-collected'

const formatNumber = (value: number) =>
    value.toLocaleString('sv-SE', { maximumFractionDigits: 0 })

const StatTile: FC<{ value: string; label: string }> = ({ value, label }) => (
    <Box sx={{ minWidth: 140 }}>
        <Typography variant="h4" component="div" fontWeight="bold">
            {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {label}
        </Typography>
    </Box>
)

export const CollectedTotalsStats: FC<{ events: ServerSideLogEvent[] }> = ({
    events,
}) => {
    const { phrase } = useContext(PhraseContext)

    const { totalCo2, totalValue } = useMemo(() => {
        const collected = events.filter(
            ({ event }) => event === COLLECTED_EVENT
        )
        return {
            totalCo2: collected.reduce(
                (sum, { co2kg }) => sum + (co2kg ?? 0),
                0
            ),
            totalValue: collected.reduce(
                (sum, { valueByUnit, quantity }) =>
                    sum + (valueByUnit ?? 0) * (quantity ?? 0),
                0
            ),
        }
    }, [events])

    if (events.length === 0) {
        return null
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="body1" fontWeight="bold" gutterBottom>
                    {phrase(
                        'EVENTLOG_STATS_TITLE',
                        'Totalt vid uthämtning (advert-was-collected)'
                    )}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    <StatTile
                        value={`${formatNumber(totalCo2)} kg`}
                        label={phrase('CATEGORIES_FIELD_C02', 'CO₂ besparing')}
                    />
                    <StatTile
                        value={formatNumber(totalValue)}
                        label={phrase(
                            'CATEGORIES_FIELD_VALUE',
                            'Kostnadsvärdering'
                        )}
                    />
                </Box>
            </CardContent>
        </Card>
    )
}
