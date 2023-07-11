import { FC, PropsWithChildren, useContext } from 'react'
import { Box, LinearProgress } from '@mui/material'
import { AdvertFilterInput } from 'adverts'
import { AdvertsContext } from '../../AdvertsContext'
import { AdvertsList } from './AdvertsList'
import { ErrorView } from '../../../errors'
import { SearchableAdvertsList } from '../filter'
import { useLiveSearch } from '../../../hooks/use-live-search'
import useLocalStorage from '../../../hooks/use-local-storage'
import { Phrase } from '../../../phrases/Phrase'

export const AdvertsListWithSearch: FC<
    {
        cacheName: string
        defaultSearchParams: Partial<AdvertFilterInput>
    } & PropsWithChildren
> = ({ cacheName, defaultSearchParams }) => {
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

    const setSearchParams = (p: AdvertFilterInput) =>
        setSearchParamsRaw({
            versionKey,
            p,
        })

    const searchParams =
        searchParamsRaw.versionKey === versionKey
            ? searchParamsRaw.p
            : effectiveInitialSearchParams

    const { listAdverts } = useContext(AdvertsContext)
    const view = useLiveSearch(() => listAdverts(searchParams))

    const next = (p: AdvertFilterInput) => {
        setSearchParams(p)
        return () => listAdverts(p)
    }

    return view({
        pending: (adverts, enqueue) => (
            <SearchableAdvertsList
                searchParams={searchParams}
                setSearchParams={(p) => enqueue(next(p))}
            >
                <LinearProgress key="lp" />
                {adverts && <AdvertsList key="al" adverts={adverts} />}
            </SearchableAdvertsList>
        ),
        rejected: (error, enqueue) => (
            <SearchableAdvertsList
                searchParams={searchParams}
                setSearchParams={(p) => enqueue(next(p))}
            >
                <ErrorView key="ev" error={error} />
            </SearchableAdvertsList>
        ),
        resolved: (adverts, enqueue) => (
            <SearchableAdvertsList
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
                <AdvertsList key="al" adverts={adverts} />
            </SearchableAdvertsList>
        ),
    })
}
