import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { Advert } from 'adverts/types'
import { AuthContext } from 'auth'
import type { AuthContextType } from 'auth/types'
import { PickupLocationContext } from 'pickup-locations'
import type { PickupLocationRepository } from 'pickup-locations/types'
import { act, type ReactNode, useState } from 'react'
import { TagsContext } from 'tags'
import type { TagsRepository } from 'tags/types'
import { createEmptyTerms, TermsContext } from 'terms'
import type { TermsRepository } from 'terms/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AdvertsTable } from './AdvertsTable'
import { AdvertsTableContext } from './AdvertsTableContext'
import type { AdvertsTableContextType, AdvertTableColumn } from './types'

const makeAdvert = (id: string, overrides: Partial<Advert> = {}): Advert => ({
    id,
    title: `Advert ${id}`,
    description: '',
    quantity: 1,
    lendingPeriod: 0,
    co2kg: 0,
    valueByUnit: 0,
    images: [],
    unit: '',
    width: '',
    height: '',
    depth: '',
    weight: '',
    size: '',
    material: '',
    condition: '',
    usage: '',
    category: '',
    reference: '',
    notes: '',
    tags: [],
    location: {
        name: '',
        adress: '',
        zipCode: '',
        city: '',
        country: '',
    },
    contact: { phone: '', email: '', organization: '' },
    place: '',
    type: 'borrow' as Advert['type'],
    createdAt: '2026-01-01T00:00:00.000Z',
    reservedAt: '2026-01-01T00:00:00.000Z',
    collectedAt: '2026-01-01T00:00:00.000Z',
    returnedAt: '2026-01-01T00:00:00.000Z',
    meta: {
        reservableQuantity: 1,
        collectableQuantity: 1,
        isMine: true,
        canEdit: true,
        canArchive: true,
        canUnarchive: false,
        canRemove: true,
        canBook: true,
        canReserve: true,
        canCancelReservation: false,
        canCollect: false,
        canJoinWaitList: false,
        canLeaveWaitList: false,
        canManageClaims: false,
        canReturn: false,
        canPick: false,
        canUnpick: false,
        reservedyMe: 0,
        collectedByMe: 0,
        isLendingAdvert: false,
        isReservedBySome: false,
        isCollectedBySome: false,
        isPicked: false,
        waitlistCount: 0,
        returnInfo: [],
        claims: [],
        hasPickupLocations: false,
    },
    ...overrides,
})

const makeAdverts = (count: number): Advert[] =>
    Array.from({ length: count }, (_, i) => makeAdvert(String(i + 1)))

const columns: AdvertTableColumn[] = [{ field: 'title', headerName: 'Titel' }]

const makeContext = (
    overrides: Partial<AdvertsTableContextType> = {}
): AdvertsTableContextType =>
    ({
        adverts: makeAdverts(10),
        selectedAdverts: [],
        paging: { pageIndex: 0, pageSize: 10, totalCount: 17, pageCount: 2 },
        categories: [],
        categoryTree: undefined as any,
        filter: {},
        selected: [],
        fields: {},
        terms: undefined as any,
        setSelected: vi.fn(),
        setFilter: vi.fn(),
        selectionMatches: vi.fn(),
        selectionCommonValue: vi.fn(),
        patchAdverts: vi.fn(),
        updateAdverts: vi.fn(),
        archiveAdverts: vi.fn(),
        unarchiveAdverts: vi.fn(),
        markAdvertsAsPicked: vi.fn(),
        markAdvertsAsUnpicked: vi.fn(),
        createAdvertLabels: vi.fn(),
        collectClaimsManually: vi.fn(),
        cancelCollectedClaims: vi.fn(),
        ...overrides,
    }) as AdvertsTableContextType

const authContext = {
    isAuthenticated: true,
    isGuest: false,
    token: 'test-token',
    roles: {},
    authProvider: null,
    setAuthentication: vi.fn(),
    signout: vi.fn(),
    getEffectivePermissions: vi.fn(),
} as unknown as AuthContextType

// FilterPanel/RestrictionsPanel (siblings of the grid inside AdvertsTable)
// pull in these contexts too. Left unprovided, their default context values
// throw "not provided" and get logged as uncaught rejections from within
// AdvertsTable's own render tree - noisy, and unrelated to what these tests
// are actually about. Stub them so they resolve to empty data instead.
const termsContext: TermsRepository = {
    getTerms: () => Promise.resolve(createEmptyTerms()),
    updateTerms: () => Promise.reject(new Error('not used in tests')),
}
const pickupLocationContext: PickupLocationRepository = {
    getPickupLocations: () => Promise.resolve([]),
    getPickupLocationsByAdvert: () => Promise.resolve([]),
    updatePickupLocations: () => Promise.reject(new Error('not used in tests')),
}
const tagsContext: TagsRepository = {
    getTagDescriptions: () => Promise.resolve([]),
    updateTagDescriptions: () => Promise.reject(new Error('not used in tests')),
}

const Providers = ({
    context,
    children,
}: {
    context: AdvertsTableContextType
    children: ReactNode
}) => (
    <AuthContext.Provider value={authContext}>
        <TermsContext.Provider value={termsContext}>
            <TagsContext.Provider value={tagsContext}>
                <PickupLocationContext.Provider value={pickupLocationContext}>
                    <AdvertsTableContext.Provider value={context}>
                        {children}
                    </AdvertsTableContext.Provider>
                </PickupLocationContext.Provider>
            </TagsContext.Provider>
        </TermsContext.Provider>
    </AuthContext.Provider>
)

// FilterPanel/RestrictionsPanel kick off their own data fetches (via
// useAsync) as soon as they mount, unrelated to anything these tests
// exercise. Those fetches resolve on a later microtask than RTL's render,
// so their state updates land outside any act() boundary unless we
// explicitly flush for them - otherwise React logs "not wrapped in act(...)"
// warnings even though the tests themselves are correct.
const flushAsync = () =>
    act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0))
    })

const renderTable = async (
    contextOverrides: Partial<AdvertsTableContextType> = {}
) => {
    const context = makeContext(contextOverrides)
    const utils = render(
        <Providers context={context}>
            <AdvertsTable
                columns={columns}
                density="standard"
                onDensityChange={vi.fn()}
                loading={false}
            />
        </Providers>
    )
    await flushAsync()
    return { context, ...utils }
}

const nextPageButton = () =>
    document.querySelector<HTMLButtonElement>(
        '.MuiTablePagination-actions button:last-child'
    )!
const headerCheckbox = () =>
    document.querySelector<HTMLInputElement>(
        '.MuiDataGrid-columnHeaderCheckbox input[type="checkbox"]'
    )!
const rowCheckboxes = () =>
    Array.from(
        document.querySelectorAll<HTMLInputElement>(
            '.MuiDataGrid-row input[type="checkbox"]'
        )
    )

beforeEach(() => {
    window.localStorage.clear()
})

describe('AdvertsTable', () => {
    it('renders the current page of rows', async () => {
        await renderTable()
        expect(screen.getByText('Advert 1')).toBeInTheDocument()
        expect(screen.getByText('Advert 10')).toBeInTheDocument()
    })

    it('requests the next page when the pagination next button is clicked', async () => {
        const setFilter = vi.fn()
        await renderTable({ setFilter })

        fireEvent.click(nextPageButton())

        await waitFor(() => expect(setFilter).toHaveBeenCalled())
        expect(setFilter.mock.calls[0][0].paging).toEqual({
            pageSize: 10,
            pageIndex: 1,
        })
    })

    // Regression test for a MUI X v9 upgrade bug: the DataGrid's sortModel
    // prop was rebuilt as a new array on every render (even when the sort
    // itself hadn't changed). The DataGrid treats a new sortModel reference
    // as "the sort changed" and resets pagination back to page 0 - including
    // on the very re-render caused by clicking the next-page button itself,
    // so `setFilter` immediately received a second, spurious call reverting
    // to page 0. Memoizing sortModel by its actual field/direction fixed it.
    it('does not revert to page 0 after requesting the next page', async () => {
        const setFilter = vi.fn()
        await renderTable({ setFilter })

        fireEvent.click(nextPageButton())

        await waitFor(() => expect(setFilter).toHaveBeenCalled())
        // give any delayed/debounced internal DataGrid correction a chance to fire
        await new Promise((resolve) => setTimeout(resolve, 50))

        const requestedPageIndexes = setFilter.mock.calls.map(
            ([f]) => f.paging.pageIndex
        )
        expect(requestedPageIndexes).toEqual([1])
    })

    it('resets to page 0 when the sort model changes (legitimate reset)', async () => {
        const setFilter = vi.fn()
        await renderTable({ setFilter })

        const titleHeader = document.querySelector(
            '.MuiDataGrid-columnHeader[data-field="title"]'
        )!
        fireEvent.click(titleHeader)

        await waitFor(() => expect(setFilter).toHaveBeenCalled())
        const [call] = setFilter.mock.calls
        expect(call[0].paging.pageIndex).toBe(0)
        expect(call[0].sorting).toEqual({ ascending: true, field: 'title' })
    })

    // Regression test for a MUI X v9 upgrade bug: the header "select all"
    // checkbox reports its result as an "exclude" model (all rows except
    // the given ids), not an "include" model of the ids themselves. The
    // previous conversion always read `model.ids` as the included ids,
    // so an "exclude" result with an empty id set (meaning "select
    // everything") turned into an empty selection instead.
    it('selects every row on the page when "select all" is clicked', async () => {
        const setSelected = vi.fn()
        await renderTable({ setSelected })

        fireEvent.click(headerCheckbox())

        await waitFor(() => expect(setSelected).toHaveBeenCalled())
        const selected = setSelected.mock.calls.at(-1)![0]
        expect(selected.sort()).toEqual(
            Array.from({ length: 10 }, (_, i) => String(i + 1)).sort()
        )
    })

    it('deselects every row when "select all" is clicked twice', async () => {
        // Selection is a controlled prop, so toggling "select all" off only
        // makes sense once the app has round-tripped the previous selection
        // back in - this harness plays that role, the way AdvertsTableView
        // does in the real app.
        const Harness = () => {
            const [selected, setSelected] = useState<Array<string | number>>([])
            const context = makeContext({ selected, setSelected })
            return (
                <Providers context={context}>
                    <AdvertsTable
                        columns={columns}
                        density="standard"
                        onDensityChange={vi.fn()}
                        loading={false}
                    />
                </Providers>
            )
        }
        render(<Harness />)
        await flushAsync()

        fireEvent.click(headerCheckbox())
        await waitFor(() =>
            expect(rowCheckboxes().every((c) => c.checked)).toBe(true)
        )

        fireEvent.click(headerCheckbox())
        await waitFor(() =>
            expect(rowCheckboxes().every((c) => !c.checked)).toBe(true)
        )
    })

    it('selects a single row via its own checkbox', async () => {
        const setSelected = vi.fn()
        await renderTable({ setSelected })

        fireEvent.click(rowCheckboxes()[0])

        await waitFor(() => expect(setSelected).toHaveBeenCalled())
        expect(setSelected.mock.calls.at(-1)![0]).toEqual(['1'])
    })
})
