import { FC, useContext, useState } from 'react'
import { Box, LinearProgress } from '@mui/material'
import { AdvertsContext } from '../AdvertsContext'
import useAsync from '../../hooks/use-async'
import { AdvertsList } from './AdvertsList'
import { ErrorView } from '../../errors'
import { SearchableAdvertsList } from './filter/SearchableAdvertsList'
import { AdvertsSearchParams } from '../types'
import { useLiveSearch } from '../../hooks/use-live-search'
import useLocalStorage from '../../hooks/use-local-storage'
import { Phrase } from '../../phrases/Phrase'

export const AdvertsView: FC = () => {
    const [searchParams, setSearchParams] =
        useLocalStorage<AdvertsSearchParams>('haffa-live-search-v1', {
            search: '',
        })
    const { listAdverts } = useContext(AdvertsContext)
    const view = useLiveSearch(() => listAdverts())

    const next = (p: AdvertsSearchParams) => {
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
