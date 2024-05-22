import { Grid, InputAdornment, Stack, TextField } from '@mui/material'
import {
    DataGrid,
    GridColumnVisibilityModel,
    GridPaginationModel,
    GridSortModel,
    GridToolbar,
} from '@mui/x-data-grid'

import { Advert, AdvertFilterInput } from 'adverts'
import { FC, PropsWithChildren, useCallback, useContext, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import {
    FilterDialog,
    FiltersIconButton,
} from 'adverts/components/filter/filters'

import useLocalStorage from 'hooks/use-local-storage'
import { AdvertsTableContext } from './AdvertsTableContext'
import { createRows } from '../createRows'
import { AdvertTableColumn } from './types'

export const PAGE_SIZE = 25
const PAGE_SIZES = [10, 25, 50, 100]

const FilterPanel: FC<
    {
        filter: AdvertFilterInput
        setFilter: (p: AdvertFilterInput) => void
    } & PropsWithChildren
> = ({ filter, setFilter }) => {
    const [showFilter, setShowFilter] = useState(false)
    const [search, setSearch] = useState(filter.search || '')

    return (
        <Grid container>
            <Grid item sx={{ flex: 1 }}>
                <TextField
                    fullWidth
                    type="search"
                    value={search}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    onChange={({ target: { value } }) => {
                        setSearch(value)
                        setFilter({
                            ...filter,
                            search: value,
                        })
                    }}
                />
            </Grid>
            <Grid item>
                <FiltersIconButton
                    searchParams={filter}
                    onClick={() => setShowFilter(true)}
                />
                <FilterDialog
                    open={showFilter}
                    onClose={() => setShowFilter(false)}
                    searchParams={filter}
                    setSearchParams={setFilter}
                />
            </Grid>
        </Grid>
    )
}

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
            <DataGrid
                autoHeight
                getRowHeight={() => 'auto'}
                slots={{ toolbar: GridToolbar }}
                disableColumnFilter
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
                rows={createRows(adverts)}
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
