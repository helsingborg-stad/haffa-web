import { Stack } from '@mui/material'
import {
    DataGrid,
    type GridColumnVisibilityModel,
    type GridDensity,
    type GridPaginationModel,
    type GridRowSelectionModel,
    type GridSortModel,
    GridToolbar,
} from '@mui/x-data-grid'

import type { Advert } from 'adverts'
import useLocalStorage from 'hooks/use-local-storage'
import {
    type FC,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { createRows } from '../createRows'
import { AdvertsTableContext } from './AdvertsTableContext'
import { FilterPanel } from './components/FilterPanel'
import { RestrictionsPanel } from './components/RestrictionsPanel'
import type { AdvertTableColumn } from './types'

export const PAGE_SIZE = 10
const PAGE_SIZES = [10, 25, 50, 100]

export const AdvertsTable: FC<{
    columns: AdvertTableColumn[]
    density: GridDensity
    onDensityChange: (density: GridDensity) => void
    loading: boolean
}> = ({ columns, density, onDensityChange, loading }) => {
    const context = useContext(AdvertsTableContext)
    const { selected, setSelected, filter, setFilter, adverts, paging } =
        context

    // Save/Load visibility model to localstorage
    const [visibilityModel, onColumnVisibilityModelChange] =
        useLocalStorage<GridColumnVisibilityModel>(
            'haffa-my-adverts-v2-visibility-model',
            columns.reduce((p, c) => ({ ...p, [c.field]: true }), {})
        )
    // A fresh array reference here on every render (even with the same
    // sort/field values) makes the DataGrid think the sort model changed,
    // which resets pagination back to page 0 - including right after a
    // pagination change re-renders this component. Memoize it so the
    // reference is stable unless the sort actually changes.
    const sortModel = useMemo<GridSortModel>(
        () => [
            {
                sort: filter.sorting?.ascending ? 'asc' : 'desc',
                field: (filter.sorting?.field as keyof Advert) ?? '',
            },
        ],
        [filter.sorting?.ascending, filter.sorting?.field]
    )
    // Transform sort model to serverside model
    const onSortModelChange = useCallback(
        ([model]: GridSortModel) =>
            model &&
            setFilter({
                ...filter,
                sorting: {
                    ascending: model?.sort === 'asc',
                    field: model?.field as keyof Advert,
                },
                paging: {
                    pageSize: filter.paging?.pageSize ?? PAGE_SIZE,
                    pageIndex: 0,
                },
            }),
        [setFilter, filter]
    )
    // The DataGrid's paginationModel prop is fully controlled, but our
    // setFilter round-trips through a debounced, async server fetch. Deriving
    // paginationModel directly from `paging` (which only updates once that
    // fetch resolves) races with the DataGrid's own internal reconciliation,
    // which snaps the page back before our fetch completes. Track it as local
    // state instead, updated instantly on change, and re-synced from `paging`
    // whenever it changes for some other reason (e.g. a search resetting it).
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(
        {
            page: paging.pageIndex,
            pageSize: paging.pageSize,
        }
    )
    useEffect(() => {
        setPaginationModel({
            page: paging.pageIndex,
            pageSize: paging.pageSize,
        })
    }, [paging.pageIndex, paging.pageSize])
    // Transform pagination model to serverside model
    const onPaginationModelChange = useCallback(
        (model: GridPaginationModel) => {
            setPaginationModel(model)
            setFilter({
                ...filter,
                paging: {
                    pageSize: model.pageSize,
                    pageIndex: model.page,
                },
            })
        },
        [setFilter, filter]
    )
    const rows = useMemo(() => createRows(adverts, density), [adverts, density])
    // The header "select all" checkbox reports its result as an "exclude"
    // model (all rows except the given ids) rather than an "include" model
    // of the ids themselves. Only the currently loaded page of rows is ever
    // selectable this way, so resolve "exclude" against those row ids.
    const onRowSelectionModelChange = useCallback(
        (model: GridRowSelectionModel) => {
            const excluded = model.ids
            setSelected(
                model.type === 'include'
                    ? Array.from(model.ids)
                    : rows.map((r) => r.id).filter((id) => !excluded.has(id))
            )
        },
        [setSelected, rows]
    )
    return (
        <Stack direction="column" spacing={2}>
            <FilterPanel filter={filter} setFilter={setFilter} />
            <RestrictionsPanel filter={filter} setFilter={setFilter} />
            <DataGrid
                loading={loading}
                getRowHeight={() => 'auto'}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                        csvOptions: {
                            fileName: new Date().toISOString(),
                        },
                    },
                }}
                disableColumnFilter
                density={density}
                onDensityChange={(density) => onDensityChange(density)}
                sortingMode="server"
                onSortModelChange={onSortModelChange}
                sortingOrder={['asc', 'desc']}
                sortModel={sortModel}
                paginationMode="server"
                rowCount={paging.totalCount}
                onPaginationModelChange={onPaginationModelChange}
                paginationModel={paginationModel}
                onRowSelectionModelChange={onRowSelectionModelChange}
                rowSelectionModel={{
                    type: 'include',
                    ids: new Set(selected),
                }}
                columnVisibilityModel={visibilityModel}
                onColumnVisibilityModelChange={onColumnVisibilityModelChange}
                rows={rows}
                columns={columns}
                pageSizeOptions={PAGE_SIZES}
                checkboxSelection
            />
        </Stack>
    )
}
