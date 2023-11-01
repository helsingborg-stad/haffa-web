import { FC, PropsWithChildren, useCallback, useContext, useState } from 'react'
import { Pagination, Stack, SxProps, Theme } from '@mui/material'
import { AdvertFilterInput, AdvertList } from 'adverts'
import useAbortController from 'hooks/use-abort-controller'
import { createTreeAdapter } from 'lib/tree-adapter'
import { Phrase } from 'phrases/Phrase'
import { AdvertSubscriptionControls } from 'subscriptions'
import { UrlParamsContext } from 'url-params'
import { AdvertsContext } from '../../AdvertsContext'
import { AdvertsList } from './AdvertsList'
import { ErrorView } from '../../../errors'
import { SearchableAdvertsList } from '../filter'
import { AsyncEnqueue, useLiveSearch } from '../../../hooks/use-live-search'

const PAGE_SIZE = 5

const createEmptyResult = (): AdvertList => ({
    adverts: [],
    categories: [],
    paging: { pageIndex: 0, pageSize: PAGE_SIZE, pageCount: 0, totalCount: 0 },
})

const AdvertsListPagination: FC<{
    sx?: SxProps<Theme>
    hideEmpty?: boolean
    adverts: AdvertList
    searchParams: AdvertFilterInput
    setSearchParams: (p: AdvertFilterInput) => void
}> = ({
    sx,
    hideEmpty,
    adverts: {
        paging: { totalCount, pageIndex, pageCount },
    },
    searchParams,
    setSearchParams,
}) => (
    <Stack alignItems="center" sx={sx}>
        {totalCount === 0 && !hideEmpty && (
            <Phrase
                id="SEARCH_EMPTY_RESULT"
                value="Hoppsan, det blev inga träffar på den"
            />
        )}
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
                            pageSize: PAGE_SIZE,
                        },
                    })
                }
            />
        )}
    </Stack>
)

export const AdvertsListWithSearch: FC<
    {
        prefix: string
        defaultSearchParams: Partial<AdvertFilterInput>
        hideFilter?: boolean
        showSubscriptionOptions?: boolean
    } & PropsWithChildren
> = ({
    children,
    hideFilter,
    showSubscriptionOptions: showMonitorNewAds,
    prefix,
    defaultSearchParams,
}) => {
    const { signal } = useAbortController()
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
    const versionKey = btoa(JSON.stringify(effectiveInitialSearchParams))

    const [searchParamsRaw, setSearchParamsRaw] = useState<AdvertFilterInput>(
        () =>
            patchAdvertFilterInputFromUrl(prefix, effectiveInitialSearchParams)
    )

    const setSearchParams = useCallback(
        (p: AdvertFilterInput) => {
            setSearchParamsRaw(p)
            updateUrlFromAdvertFilterInput(prefix, p)
        },
        [setSearchParamsRaw, versionKey]
    )

    const searchParams = searchParamsRaw

    const { listAdverts } = useContext(AdvertsContext)
    const next = useCallback(
        (p: AdvertFilterInput) => {
            setSearchParams(p)
            return listAdverts(p, { signal })
        },
        [setSearchParams, signal]
    )

    const view = useLiveSearch<AdvertList>(() => next(searchParams))

    const listResult = useCallback(
        (adverts: AdvertList, enqueue: AsyncEnqueue<AdvertList>) => (
            <SearchableAdvertsList
                key="sal"
                hideFilter={hideFilter}
                searchParams={searchParams}
                setSearchParams={(p) =>
                    enqueue(() =>
                        next({
                            ...p,
                            paging: { pageIndex: 0, pageSize: PAGE_SIZE },
                        })
                    )
                }
            >
                {showMonitorNewAds && (
                    <AdvertSubscriptionControls
                        searchParams={searchParams}
                        hideIfEmptySearch={false}
                    />
                )}
                <AdvertsListPagination
                    key="pagination-top"
                    adverts={adverts}
                    searchParams={searchParams}
                    setSearchParams={(p) => enqueue(() => next(p))}
                    sx={{ mb: 1 }}
                />
                <AdvertsList
                    key="adverts-listing"
                    adverts={adverts?.adverts || []}
                    categories={createTreeAdapter(
                        adverts?.categories || [],
                        (c) => c.id,
                        (c) => c.categories
                    )}
                />
                <AdvertsListPagination
                    key="pagination-bottom"
                    adverts={adverts}
                    searchParams={searchParams}
                    setSearchParams={(p) => enqueue(() => next(p))}
                    sx={{ mt: 1 }}
                    hideEmpty
                />
            </SearchableAdvertsList>
        ),
        [searchParams, setSearchParams, next]
    )

    return view({
        pending: (result, enqueue) =>
            listResult(result || createEmptyResult(), enqueue),
        rejected: (error, enqueue) => (
            <SearchableAdvertsList
                key="sal"
                searchParams={searchParams}
                setSearchParams={(p) => enqueue(() => next(p))}
            >
                <ErrorView key="ev" error={error} />
                {children}
            </SearchableAdvertsList>
        ),
        resolved: listResult,
    })
}
