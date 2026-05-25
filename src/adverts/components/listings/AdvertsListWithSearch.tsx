import { Pagination, Stack, type SxProps, type Theme } from '@mui/material'
import type { AdvertFilterInput, AdvertList } from 'adverts'
import { Editorial } from 'editorials'
import { getAdvertFieldSortOptions } from 'hard-coded-config'
import useAbortController from 'hooks/use-abort-controller'
import { createTreeAdapter } from 'lib/tree-adapter'
import { PhraseContext } from 'phrases'
import {
    type FC,
    type PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { AdvertSubscriptionControls } from 'subscriptions'
import { UrlParamsContext } from 'url-params'
import { ErrorView } from '../../../errors'
import {
    type AsyncEnqueue,
    useLiveSearch,
} from '../../../hooks/use-live-search'
import { AdvertsContext } from '../../AdvertsContext'
import { SearchableAdvertsList } from '../filter'
import { AdvertsList } from './AdvertsList'

const PAGE_SIZE = 24

const createEmptyResult = (): AdvertList => ({
    adverts: [],
    categories: [],
    paging: { pageIndex: 0, pageSize: PAGE_SIZE, pageCount: 0, totalCount: 0 },
})

const createCenteredStackSx = (sx?: SxProps<Theme>): SxProps<Theme> => [
    { alignItems: 'center' },
    ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
]

export const AdvertsListPagination: FC<{
    sx?: SxProps<Theme>
    adverts: AdvertList
    searchParams: AdvertFilterInput
    setSearchParams: (p: AdvertFilterInput) => void
    pageSize: number
}> = ({
    sx,
    adverts: {
        paging: { pageIndex, pageCount },
    },
    searchParams,
    setSearchParams,
    pageSize,
}) => (
    <Stack sx={createCenteredStackSx(sx)}>
        {pageCount > 1 && (
            <Pagination
                color="primary"
                page={pageIndex + 1}
                count={pageCount}
                showFirstButton
                showLastButton
                hidePrevButton
                hideNextButton
                onChange={(_, page) =>
                    setSearchParams({
                        ...searchParams,
                        paging: {
                            pageIndex: page - 1,
                            pageSize,
                        },
                    })
                }
            />
        )}
    </Stack>
)

const AdvertsListEmptyResult: FC<{
    sx?: SxProps<Theme>
    adverts: AdvertList
}> = ({
    sx,
    adverts: {
        paging: { totalCount },
    },
}) => (
    <Stack sx={createCenteredStackSx(sx)}>
        {totalCount === 0 && (
            <Editorial phraseKey="SEARCH_EMPTY_RESULT">
                Hoppsan, det blev inga träffar på den
            </Editorial>
        )}
    </Stack>
)

export const AdvertsListWithSearch: FC<
    {
        prefix: string
        defaultSearchParams: Partial<AdvertFilterInput>
        hideFilter?: boolean
        scrollTopOnFilterChange?: boolean
        showSubscriptionOptions?: boolean
    } & PropsWithChildren
> = ({
    children,
    hideFilter,
    scrollTopOnFilterChange,
    showSubscriptionOptions,
    prefix,
    defaultSearchParams,
}) => {
    const { signal } = useAbortController()
    const { phrase } = useContext(PhraseContext)
    const { updateUrlFromAdvertFilterInput, patchAdvertFilterInputFromUrl } =
        useContext(UrlParamsContext)

    const effectiveInitialSearchParams: AdvertFilterInput = {
        search: '',
        sorting: {
            field: 'title',
            ascending: true,
        },
        paging: { pageIndex: 0, pageSize: PAGE_SIZE },
        ...defaultSearchParams,
    }

    const sortableFields = useMemo(
        () => getAdvertFieldSortOptions(phrase),
        [phrase]
    )

    const [searchParamsRaw, setSearchParamsRaw] = useState<AdvertFilterInput>(
        () =>
            patchAdvertFilterInputFromUrl(
                prefix,
                effectiveInitialSearchParams,
                {
                    sortableFields,
                }
            )
    )

    useEffect(() => {
        // ensure new results are shown
        // in particular, last page might have fewer ads, so a scroll reset is needed
        scrollTopOnFilterChange && window.scrollTo(0, 0)
    }, [scrollTopOnFilterChange])

    const setSearchParams = useCallback(
        (p: AdvertFilterInput) => {
            setSearchParamsRaw(p)
            updateUrlFromAdvertFilterInput(prefix, p, {
                sortableFields,
            })
        },
        [sortableFields, updateUrlFromAdvertFilterInput, prefix]
    )

    const searchParams = searchParamsRaw

    const { listAdverts } = useContext(AdvertsContext)
    const next = useCallback(
        (p: AdvertFilterInput) => {
            setSearchParams(p)
            return listAdverts(p, { signal })
        },
        [setSearchParams, listAdverts, signal]
    )
    const changed = useCallback(
        (p: AdvertFilterInput, enqueue: AsyncEnqueue<AdvertList>) => {
            setSearchParams(p)
            return enqueue(() => listAdverts(p, { signal }))
        },
        [setSearchParams, listAdverts, signal]
    )

    const view = useLiveSearch<AdvertList>(() => next(searchParams))

    const listResult = useCallback(
        (
            adverts: AdvertList,
            enqueue: AsyncEnqueue<AdvertList>,
            isPendingResult?: boolean
        ) => (
            <SearchableAdvertsList
                key="sal"
                hideFilter={hideFilter}
                searchParams={searchParams}
                setSearchParams={(p) =>
                    changed(
                        {
                            ...p,
                            paging: { pageIndex: 0, pageSize: PAGE_SIZE },
                        },
                        enqueue
                    )
                }
            >
                {showSubscriptionOptions && (
                    <AdvertSubscriptionControls
                        searchParams={searchParams}
                        hideIfEmptySearch={false}
                        sx={{ mt: 1 }}
                    />
                )}

                <AdvertsList
                    key="adverts-listing"
                    adverts={adverts?.adverts || []}
                    categories={createTreeAdapter(
                        adverts?.categories || [],
                        (c) => c.id,
                        (c) => c.categories
                    )}
                />
                {!isPendingResult && (
                    <AdvertsListEmptyResult
                        key="empty-result"
                        adverts={adverts}
                    />
                )}
                <AdvertsListPagination
                    key="pagination-bottom"
                    adverts={adverts}
                    searchParams={searchParams}
                    setSearchParams={(p) => changed(p, enqueue)}
                    sx={{ my: 2 }}
                    pageSize={PAGE_SIZE}
                />
            </SearchableAdvertsList>
        ),
        [searchParams, changed, showSubscriptionOptions, hideFilter]
    )

    return view({
        pending: (result, enqueue) =>
            listResult(result || createEmptyResult(), enqueue, true),
        rejected: (error, enqueue) => (
            <SearchableAdvertsList
                key="sal"
                searchParams={searchParams}
                setSearchParams={(p) => changed(p, enqueue)}
            >
                <ErrorView key="ev" error={error} />
                {children}
            </SearchableAdvertsList>
        ),
        resolved: listResult,
    })
}
