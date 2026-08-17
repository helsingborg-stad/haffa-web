import { Box } from '@mui/material'
import type { AdvertFilterInput, AdvertList } from 'adverts'
import { createTreeAdapter } from 'lib/tree-adapter'
import {
    type FC,
    type PropsWithChildren,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { AdvertsContext } from '../../AdvertsContext'
import { AdvertsList } from './AdvertsList'
import { AdvertsListPagination } from './AdvertsListWithSearch'

export const AdvertsListGeneric: FC<
    {
        defaultSearchParams: Partial<AdvertFilterInput>
        pageSize?: number
        itemWidth?: { xs: number; sm: number }
    } & PropsWithChildren
> = ({ defaultSearchParams, pageSize = 4, itemWidth }) => {
    const effectiveInitialSearchParams: AdvertFilterInput = useMemo(
        () => ({
            search: '',
            sorting: {
                field: 'title',
                ascending: true,
            },
            paging: { pageIndex: 0, pageSize },
            ...defaultSearchParams,
        }),
        [pageSize, JSON.stringify(defaultSearchParams)]
    )
    interface ListState {
        adverts?: AdvertList
        filter: AdvertFilterInput
    }
    const [state, setState] = useState<ListState>({
        adverts: undefined,
        filter: effectiveInitialSearchParams,
    })

    const { listAdverts } = useContext(AdvertsContext)

    useEffect(() => {
        listAdverts(effectiveInitialSearchParams).then((result) =>
            setState({
                adverts: result,
                filter: effectiveInitialSearchParams,
            })
        )
    }, [listAdverts, effectiveInitialSearchParams])

    const getAdverts = (filter: AdvertFilterInput) => {
        listAdverts(filter).then((result) =>
            setState({
                adverts: result,
                filter,
            })
        )
    }

    return (
        <Box>
            {state.adverts && (
                <>
                    <AdvertsList
                        key="adverts-listing"
                        adverts={state.adverts.adverts || []}
                        categories={createTreeAdapter(
                            state.adverts.categories || [],
                            (c) => c.id,
                            (c) => c.categories
                        )}
                        itemWidth={itemWidth}
                    />
                    <AdvertsListPagination
                        key="pagination-bottom"
                        adverts={state.adverts}
                        searchParams={state.filter}
                        setSearchParams={getAdverts}
                        sx={{ my: 2 }}
                        pageSize={pageSize}
                    />
                </>
            )}
        </Box>
    )
}
