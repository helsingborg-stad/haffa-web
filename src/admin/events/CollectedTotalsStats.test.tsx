import { createTheme, ThemeProvider } from '@mui/material/styles'
import { render, screen } from '@testing-library/react'
import { PhraseContext } from 'phrases'
import { createPhraseContext } from 'phrases/create-phrase-context'
import type { ServerSideLogEvent } from 'statistics/types'
import { describe, expect, it } from 'vitest'
import { CollectedTotalsStats } from './CollectedTotalsStats'

const makeEvent = (
    event: string,
    overrides: Partial<ServerSideLogEvent> = {}
): ServerSideLogEvent => ({
    event,
    at: '2026-01-01T00:00:00.000Z',
    by: 'someone@example.com',
    ...overrides,
})

const renderStats = (events: ServerSideLogEvent[]) =>
    render(
        <ThemeProvider theme={createTheme()}>
            <PhraseContext.Provider value={createPhraseContext({})}>
                <CollectedTotalsStats events={events} />
            </PhraseContext.Provider>
        </ThemeProvider>
    )

describe('CollectedTotalsStats', () => {
    it('renders nothing when there are no events', () => {
        const { container } = renderStats([])
        expect(container).toBeEmptyDOMElement()
    })

    it('sums co2kg and valueByUnit * quantity only for collected events', () => {
        renderStats([
            makeEvent('advert-was-collected', {
                co2kg: 10,
                valueByUnit: 100,
                quantity: 2,
            }),
            makeEvent('advert-was-collected', {
                co2kg: 5,
                valueByUnit: 50,
                quantity: 3,
            }),
            makeEvent('advert-was-reserved', {
                co2kg: 1000,
                valueByUnit: 1000,
                quantity: 1000,
            }),
        ])
        // co2: 10 + 5 = 15 (not scaled by quantity)
        expect(screen.getByText('15 kg')).toBeInTheDocument()
        // value: 100*2 + 50*3 = 350
        expect(screen.getByText('350')).toBeInTheDocument()
    })

    it('treats missing co2kg/valueByUnit/quantity as zero', () => {
        renderStats([makeEvent('advert-was-collected')])
        expect(screen.getByText('0 kg')).toBeInTheDocument()
        expect(screen.getByText('0')).toBeInTheDocument()
    })
})
