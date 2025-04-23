import { Summaries } from './types'

export const normalizeSummaries = (
    summaries?: Partial<Summaries>
): Summaries => ({
    eventsFromStart: {
        totalCo2: 0,
        totalValue: 0,
        totalCollects: 0,
        ...summaries?.eventsFromStart,
    },
    eventsThisYear: {
        totalCo2: 0,
        totalValue: 0,
        totalCollects: 0,
        ...summaries?.eventsThisYear,
    },
    advertSummaries: {
        totalLendingAdverts: 0,
        totalRecycleAdverts: 0,
        availableLendingAdverts: 0,
        availableRecycleAdverts: 0,
        availableAdverts: 0,
        totalAdverts: 0,
        reservedAdverts: 0,
        collectedAdverts: 0,
        ...summaries?.advertSummaries,
    },
})
