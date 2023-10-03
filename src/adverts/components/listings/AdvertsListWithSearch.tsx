import { FC, PropsWithChildren, useCallback, useContext } from 'react'
import { Box } from '@mui/material'
import { Advert, AdvertFilterInput, AdvertList } from 'adverts'
import useAbortController from 'hooks/use-abort-controller'
import merge from 'lodash.merge'
import { createTreeAdapter } from 'lib/tree-adapter'
import { AdvertsContext } from '../../AdvertsContext'
import { AdvertsList } from './AdvertsList'
import { ErrorView } from '../../../errors'
import { SearchableAdvertsList } from '../filter'
import { AsyncEnqueue, useLiveSearch } from '../../../hooks/use-live-search'
import useLocalStorage from '../../../hooks/use-local-storage'
import { Phrase } from '../../../phrases/Phrase'
import { AdvertPagingControls } from './AdvertPagingControls'

export const AdvertsListWithSearch: FC<
    {
        cacheName: string
        defaultSearchParams: Partial<AdvertFilterInput>
        renderControls?: (
            searchParams: AdvertFilterInput,
            setSearchParams: (p: AdvertFilterInput) => void
        ) => JSX.Element
    } & PropsWithChildren
> = ({ children, cacheName, defaultSearchParams, renderControls }) => {
    const { signal } = useAbortController()
    const effectiveInitialSearchParams: AdvertFilterInput = {
        search: '',
        sorting: {
            field: 'title',
            ascending: true,
        },
        paging: { limit: 25 },
        ...defaultSearchParams,
    }
    const versionKey = btoa(JSON.stringify(effectiveInitialSearchParams))

    // We store searchpatams in local storage
    // The version key is used to detect when changes in default
    // parameters occus (which could be a schema addition or similar)
    // Change in default parameters are thus treated as a major version change
    const [searchParamsRaw, setSearchParamsRaw] = useLocalStorage(
        `haffa-filter-${cacheName}`,
        {
            versionKey,
            p: effectiveInitialSearchParams,
        }
    )

    const setSearchParams = useCallback(
        (p: AdvertFilterInput) =>
            setSearchParamsRaw({
                versionKey,
                p: {
                    ...p,
                    paging: {
                        limit:
                            p.paging?.limit ??
                            effectiveInitialSearchParams.paging?.limit!,
                    },
                },
            }),
        [setSearchParamsRaw, versionKey]
    )

    const searchParams =
        searchParamsRaw.versionKey === versionKey
            ? searchParamsRaw.p
            : effectiveInitialSearchParams

    const { listAdverts } = useContext(AdvertsContext)

    const appendListAdverts = useCallback(
        async (p: AdvertFilterInput, activeList: Advert[]) =>
            listAdverts(p, { signal }).then((newAdvertList) => ({
                ...newAdvertList,
                adverts: [...activeList, ...newAdvertList.adverts],
            })),
        [listAdverts]
    )

    const view = useLiveSearch(() => appendListAdverts(searchParams, []))

    const next = useCallback(
        (p: AdvertFilterInput, appendOnto: Advert[] = []) => {
            setSearchParams(p)
            return () => appendListAdverts(p, appendOnto)
        },
        [setSearchParams, appendListAdverts, signal]
    )

    const tryLoadMoreAdverts = (
        enqueue: AsyncEnqueue<AdvertList>,
        activeAdverts: Advert[],
        cursor: string | null | undefined
    ) => {
        enqueue(
            next(
                merge(searchParams, {
                    paging: {
                        limit: searchParams.paging?.limit,
                        cursor,
                    },
                }),
                activeAdverts
            )
        )
    }

    const listResult = useCallback(
        (adverts: AdvertList | null, enqueue: AsyncEnqueue<AdvertList>) => (
            <SearchableAdvertsList
                key="sal"
                searchParams={searchParams}
                setSearchParams={(p) => enqueue(next(p))}
            >
                <Box key="e" sx={{ m: 2 }}>
                    {adverts?.adverts.length === 0 ? (
                        <Phrase
                            id="SEARCH_EMPTY_RESULT"
                            value="Hoppsan, det blev inga träffar på den"
                        />
                    ) : (
                        <Phrase
                            id="SEARCH_TOTAL_COUNT"
                            value="Visar {count} av {totalCount} annonser"
                            variables={{
                                count: adverts?.adverts.length ?? '?',
                                totalCount: adverts?.paging.totalCount ?? '?',
                            }}
                        />
                    )}
                </Box>
                {renderControls?.(searchParams, (p) => enqueue(next(p)))}
                <AdvertsList
                    key="al"
                    adverts={adverts?.adverts || []}
                    categories={createTreeAdapter(
                        adverts?.categories || [],
                        (c) => c.id,
                        (c) => c.categories
                    )}
                />
                {adverts?.adverts.length === 0 ? null : (
                    <AdvertPagingControls
                        onLoadMore={() =>
                            tryLoadMoreAdverts(
                                enqueue,
                                adverts?.adverts ?? [],
                                adverts?.paging.nextCursor
                            )
                        }
                        nextCursor={adverts?.paging.nextCursor}
                    />
                )}
            </SearchableAdvertsList>
        ),
        [renderControls, searchParams, setSearchParams, next]
    )

    return view({
        pending: listResult,
        rejected: (error, enqueue) => (
            <SearchableAdvertsList
                key="sal"
                searchParams={searchParams}
                setSearchParams={(p) => enqueue(next(p))}
            >
                {renderControls?.(searchParams, setSearchParams)}
                <ErrorView key="ev" error={error} />
                {children}
            </SearchableAdvertsList>
        ),
        resolved: listResult,
    })
}
