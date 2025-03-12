import { Stack } from '@mui/material'
import {
    DataGrid,
    GridColumnVisibilityModel,
    GridDensity,
    GridPaginationModel,
    GridSortModel,
    GridToolbar,
} from '@mui/x-data-grid'

import { Advert } from 'adverts'
import { FC, useCallback, useContext } from 'react'

import useLocalStorage from 'hooks/use-local-storage'
import { AdvertsTableContext } from './AdvertsTableContext'
import { createRows } from '../createRows'
import { AdvertTableColumn } from './types'
import { FilterPanel } from './components/FilterPanel'
import { RestrictionsPanel } from './components/RestrictionsPanel'

export const PAGE_SIZE = 10
const PAGE_SIZES = [10, 25, 50, 100]

export const AdvertsTable: FC<{
    columns: AdvertTableColumn[]
}> = ({ columns }) => {
    const context = useContext(AdvertsTableContext)
    const { selected, setSelected, filter, setFilter, adverts, paging } =
        context

    // Save/Load visibility model to localstorage
    const [visibilityModel, onColumnVisibilityModelChange] =
        useLocalStorage<GridColumnVisibilityModel>(
            'haffa-my-adverts-v2-visibility-model',
            columns.reduce((p, c) => ({ ...p, [c.field]: true }), {})
        )

    const [density, onDensityChange] = useLocalStorage<GridDensity>(
        'haffa-my-adverts-v2-density',
        'standard'
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
        [setFilter]
    )
    // Transform pagination model to serverside model
    const onPaginationModelChange = useCallback(
        (model: GridPaginationModel) => {
            setFilter({
                ...filter,
                paging: {
                    pageSize: model.pageSize,
                    pageIndex: model.page,
                },
            })
        },
        [setFilter]
    )
    return (
        <Stack direction="column" spacing={2}>
            <FilterPanel filter={filter} setFilter={setFilter} />
            <RestrictionsPanel filter={filter} setFilter={setFilter} />
            <DataGrid
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
                sortModel={[
                    {
                        sort: filter.sorting?.ascending ? 'asc' : 'desc',
                        field: (filter.sorting?.field as keyof Advert) ?? '',
                    },
                ]}
                paginationMode="server"
                rowCount={paging.totalCount}
                onPaginationModelChange={onPaginationModelChange}
                paginationModel={{
                    page: paging.pageIndex,
                    pageSize: paging.pageSize,
                }}
                onRowSelectionModelChange={setSelected}
                rowSelectionModel={selected}
                columnVisibilityModel={visibilityModel}
                onColumnVisibilityModelChange={onColumnVisibilityModelChange}
                rows={createRows(adverts, density)}
                columns={columns}
                initialState={{
                    pagination: {
                        rowCount: paging.totalCount,
                        paginationModel: {
                            pageSize: PAGE_SIZE,
                            page: 0,
                        },
                    },
                }}
                pageSizeOptions={PAGE_SIZES}
                checkboxSelection
            />
        </Stack>
    )
}
