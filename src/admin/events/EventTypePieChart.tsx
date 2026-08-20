import {
    Box,
    Card,
    CardContent,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material'
import { PhraseContext } from 'phrases'
import { type FC, useContext, useMemo, useState } from 'react'
import type { ServerSideLogEvent } from 'statistics/types'

const MAX_SLICES = 7
const OTHER_KEY = '__OTHER__'
const OTHER_COLOR = '#898781'

const CATEGORICAL_LIGHT = [
    '#2a78d6',
    '#eb6834',
    '#1baf7a',
    '#eda100',
    '#e87ba4',
    '#008300',
    '#4a3aa7',
]
const CATEGORICAL_DARK = [
    '#3987e5',
    '#d95926',
    '#199e70',
    '#c98500',
    '#d55181',
    '#008300',
    '#9085e9',
]

const SIZE = 200
const CENTER = SIZE / 2
const RADIUS = 86
const HOVER_GROWTH = 5

interface Slice {
    key: string
    label: string
    value: number
    percentage: number
    color: string
    startAngle: number
    endAngle: number
}

const toRadians = (angleDeg: number) => ((angleDeg - 90) * Math.PI) / 180

const pointOnCircle = (angleDeg: number, radius: number) => ({
    x: CENTER + radius * Math.cos(toRadians(angleDeg)),
    y: CENTER + radius * Math.sin(toRadians(angleDeg)),
})

const arcPath = (startAngle: number, endAngle: number, radius: number) => {
    const start = pointOnCircle(startAngle, radius)
    const end = pointOnCircle(endAngle, radius)
    const largeArc = endAngle - startAngle > 180 ? 1 : 0
    return `M ${CENTER} ${CENTER} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`
}

const buildSlices = (
    events: ServerSideLogEvent[],
    palette: string[],
    labelFor: (event: string) => string,
    otherLabel: string
): Slice[] => {
    const counts = new Map<string, number>()
    events.forEach(({ event }) =>
        counts.set(event, (counts.get(event) ?? 0) + 1)
    )
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1])
    const top = sorted.slice(0, MAX_SLICES)
    const otherTotal = sorted
        .slice(MAX_SLICES)
        .reduce((sum, [, value]) => sum + value, 0)
    const entries: [string, number][] =
        otherTotal > 0 ? [...top, [OTHER_KEY, otherTotal]] : top
    const total = events.length

    let angle = 0
    return entries.map(([key, value], i) => {
        const percentage = total ? (value / total) * 100 : 0
        const startAngle = angle
        const endAngle = angle + (total ? (value / total) * 360 : 0)
        angle = endAngle
        return {
            key,
            label: key === OTHER_KEY ? otherLabel : labelFor(key),
            value,
            percentage,
            color:
                key === OTHER_KEY ? OTHER_COLOR : palette[i % palette.length],
            startAngle,
            endAngle,
        }
    })
}

export const EventTypePieChart: FC<{ events: ServerSideLogEvent[] }> = ({
    events,
}) => {
    const { phrase } = useContext(PhraseContext)
    const theme = useTheme()
    const [hovered, setHovered] = useState<string | null>(null)

    const palette =
        theme.palette.mode === 'dark' ? CATEGORICAL_DARK : CATEGORICAL_LIGHT

    const otherLabel = phrase('EVENTLOG_CHART_OTHER', 'Övrigt')

    const slices = useMemo(
        () =>
            buildSlices(
                events,
                palette,
                (event) => phrase(event, event),
                otherLabel
            ),
        [events, palette, phrase, otherLabel]
    )

    if (events.length === 0) {
        return null
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="body1" fontWeight="bold" gutterBottom>
                    {phrase(
                        'EVENTLOG_CHART_TITLE',
                        'Fördelning per händelsetyp'
                    )}
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 4,
                    }}
                >
                    <Box
                        component="svg"
                        viewBox={`0 0 ${SIZE} ${SIZE}`}
                        sx={{ width: 240, height: 240, flexShrink: 0 }}
                    >
                        {slices.map((slice) => {
                            const isHovered = hovered === slice.key
                            const isFullCircle =
                                slices.length === 1 && slice.percentage >= 100
                            const radius =
                                RADIUS + (isHovered ? HOVER_GROWTH : 0)
                            const mid = (slice.startAngle + slice.endAngle) / 2
                            const labelPoint = pointOnCircle(mid, radius * 0.62)
                            return (
                                <g key={slice.key}>
                                    <Tooltip
                                        title={`${slice.label}: ${slice.value} (${slice.percentage.toFixed(1)}%)`}
                                    >
                                        {isFullCircle ? (
                                            // biome-ignore lint/a11y/useSemanticElements: SVG chart segment can't be a real <button>
                                            <circle
                                                cx={CENTER}
                                                cy={CENTER}
                                                r={radius}
                                                fill={slice.color}
                                                role="button"
                                                aria-label={slice.label}
                                                tabIndex={0}
                                                onMouseEnter={() =>
                                                    setHovered(slice.key)
                                                }
                                                onMouseLeave={() =>
                                                    setHovered(null)
                                                }
                                                onFocus={() =>
                                                    setHovered(slice.key)
                                                }
                                                onBlur={() => setHovered(null)}
                                            />
                                        ) : (
                                            // biome-ignore lint/a11y/useSemanticElements: SVG chart segment can't be a real <button>
                                            <path
                                                d={arcPath(
                                                    slice.startAngle,
                                                    slice.endAngle,
                                                    radius
                                                )}
                                                fill={slice.color}
                                                stroke={
                                                    theme.palette.background
                                                        .paper
                                                }
                                                strokeWidth={2}
                                                role="button"
                                                aria-label={slice.label}
                                                tabIndex={0}
                                                onMouseEnter={() =>
                                                    setHovered(slice.key)
                                                }
                                                onMouseLeave={() =>
                                                    setHovered(null)
                                                }
                                                onFocus={() =>
                                                    setHovered(slice.key)
                                                }
                                                onBlur={() => setHovered(null)}
                                            />
                                        )}
                                    </Tooltip>
                                    {slice.percentage >= 8 && (
                                        <text
                                            x={labelPoint.x}
                                            y={labelPoint.y}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            fontSize={11}
                                            fill="#ffffff"
                                            style={{ pointerEvents: 'none' }}
                                        >
                                            {`${Math.round(slice.percentage)}%`}
                                        </text>
                                    )}
                                </g>
                            )
                        })}
                    </Box>
                    <Box
                        component="ul"
                        sx={{
                            listStyle: 'none',
                            m: 0,
                            p: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.75,
                            minWidth: 220,
                        }}
                    >
                        {slices.map((slice) => (
                            <Box
                                component="li"
                                key={slice.key}
                                onMouseEnter={() => setHovered(slice.key)}
                                onMouseLeave={() => setHovered(null)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    opacity:
                                        hovered && hovered !== slice.key
                                            ? 0.5
                                            : 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 14,
                                        height: 14,
                                        borderRadius: 0.5,
                                        bgcolor: slice.color,
                                        flexShrink: 0,
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    sx={{ flexGrow: 1 }}
                                >
                                    {slice.label}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {`${slice.value} (${slice.percentage.toFixed(1)}%)`}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}
