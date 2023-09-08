import { FC, PropsWithChildren, useCallback, useContext } from 'react'
import { Box } from '@mui/material'
import { Advert, AdvertFilterInput } from 'adverts'
import useAbortController from 'hooks/use-abort-controller'
import { AdvertsContext } from '../../AdvertsContext'
import { AdvertsList } from './AdvertsList'
import { ErrorView } from '../../../errors'
import { SearchableAdvertsList } from '../filter'
import { AsyncEnqueue, useLiveSearch } from '../../../hooks/use-live-search'
import useLocalStorage from '../../../hooks/use-local-storage'
import { Phrase } from '../../../phrases/Phrase'

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
        ...defaultSearchParams,
    }
    const versionKey = btoa(JSON.stringify(effectiveInitialSearchParams))

    // We store searchpatams in local storage
    // The version key is used to detect when changes in default
    // parameters occus (which could be a schema addition or similar)
    // Change in default parameters are thus treated as a major version change
    const [searchParamsRaw, setSearchParamsRaw] = useLocalStorage(
        `haffa-filter-${cacheName}-v1`,
        {
            versionKey,
            p: effectiveInitialSearchParams,
        }
    )

    const setSearchParams = useCallback(
        (p: AdvertFilterInput) =>
            setSearchParamsRaw({
                versionKey,
                p,
            }),
        [setSearchParamsRaw, versionKey]
    )

    const searchParams =
        searchParamsRaw.versionKey === versionKey
            ? searchParamsRaw.p
            : effectiveInitialSearchParams

    const { listAdverts } = useContext(AdvertsContext)
    const view = useLiveSearch(() => listAdverts(searchParams, { signal }))

    const next = useCallback(
        (p: AdvertFilterInput) => {
            setSearchParams(p)
            return () => listAdverts(p, { signal })
        },
        [setSearchParams, listAdverts, signal]
    )

    const listResult = useCallback(
        (adverts: Advert[] | null, enqueue: AsyncEnqueue<Advert[]>) => (
            <SearchableAdvertsList
                key="sal"
                searchParams={searchParams}
                setSearchParams={(p) => enqueue(next(p))}
            >
                {adverts?.length === 0 && (
                    <Box key="e">
                        <Phrase
                            id="SEARCH_EMPTY_RESULT"
                            value="Hoppsan, det blev inga träffar på den"
                        />
                    </Box>
                )}
                {renderControls?.(searchParams, (p) => enqueue(next(p)))}
                <AdvertsList key="al" adverts={adverts || []} />
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
