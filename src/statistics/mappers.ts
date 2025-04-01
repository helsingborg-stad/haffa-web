import { Summaries } from './types'

export const normalizeSummaries = (
    summaries?: Partial<Summaries>
): Summaries => ({
    eventSummaries: {
        totalCo2: 0,
        totalValue: 0,
        totalCollects: 0,
        ...summaries?.eventSummaries,
    },
    advertSummaries: {
        totalLendingAdverts: 0,
        totalRecycleAdverts: 0,
        availableLendingAdverts: 0,
        availableRecycleAdverts: 0,
        totalAdverts: 0,
        reservedAdverts: 0,
        collectedAdverts: 0,
        ...summaries?.advertSummaries,
    },
})
