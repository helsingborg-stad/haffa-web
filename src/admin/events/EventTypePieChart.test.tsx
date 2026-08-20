import { createTheme, ThemeProvider } from '@mui/material/styles'
import { render, screen } from '@testing-library/react'
import { PhraseContext } from 'phrases'
import { createPhraseContext } from 'phrases/create-phrase-context'
import type { ServerSideLogEvent } from 'statistics/types'
import { describe, expect, it } from 'vitest'
import { EventTypePieChart } from './EventTypePieChart'

const makeEvent = (
    event: string,
    overrides: Partial<ServerSideLogEvent> = {}
): ServerSideLogEvent => ({
    event,
    at: '2026-01-01T00:00:00.000Z',
    by: 'someone@example.com',
    ...overrides,
})

const renderChart = (events: ServerSideLogEvent[]) =>
    render(
        <ThemeProvider theme={createTheme()}>
            <PhraseContext.Provider value={createPhraseContext({})}>
                <EventTypePieChart events={events} />
            </PhraseContext.Provider>
        </ThemeProvider>
    )

describe('EventTypePieChart', () => {
    it('renders nothing when there are no events', () => {
        const { container } = renderChart([])
        expect(container).toBeEmptyDOMElement()
    })

    it('aggregates events by type and lists each type with its count', () => {
        renderChart([
            makeEvent('advert-was-created'),
            makeEvent('advert-was-created'),
            makeEvent('advert-was-reserved'),
        ])
        expect(screen.getByText('advert-was-created')).toBeInTheDocument()
        expect(screen.getByText('2 (66.7%)')).toBeInTheDocument()
        expect(screen.getByText('advert-was-reserved')).toBeInTheDocument()
        expect(screen.getByText('1 (33.3%)')).toBeInTheDocument()
    })

    it('folds event types beyond the top 7 into an "other" bucket', () => {
        const events = Array.from({ length: 9 }, (_, i) =>
            makeEvent(`event-${i}`)
        )
        renderChart(events)
        expect(screen.getByText('Övrigt')).toBeInTheDocument()
    })
})
