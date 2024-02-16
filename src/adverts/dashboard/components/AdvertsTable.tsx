import {
    InputAdornment,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
} from '@mui/material'
import { Advert, AdvertFilterInput, AdvertInput, AdvertList } from 'adverts'
import { FC, ReactNode, useCallback, useMemo, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { NavLink } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser'
import { createTreeAdapter } from 'lib/tree-adapter'
import { Column, ColumnComponentFactory } from './types'
import { createAdvertTableComponentFactory } from '.'
import { MultiselectCheckbox } from './MultiselectCheckbox'
import { SingleselectCheckbox } from './SingleselectCheckbox'
import { BulkChangeCategory } from './BulkChangeCategory'
import { BulkChangeNotes } from './BulkChangeNotes'

export const PAGE_SIZE = 25
const PAGE_SIZES = [10, 25, 50, 100]

const createLink = (to: string, icon: ReactNode) => (
    <NavLink to={to} style={{ color: 'inherit', textDecoration: 'none' }}>
        {icon}
    </NavLink>
)

export const AdvertsTable: FC<{
    list: AdvertList
    filter: AdvertFilterInput
    setFilter: (f: AdvertFilterInput) => void
    bulkUpdate: (
        filter: AdvertFilterInput,
        advertIds: string[],
        patch: Partial<AdvertInput>
    ) => void
}> = ({ list: { adverts, categories }, filter, setFilter, bulkUpdate }) => {
    const categoryTree = useMemo(
        () =>
            createTreeAdapter(
                categories,
                (c) => c.id,
                (c) => c.parentId,
                (c) => c.categories
            ),
        [categories]
    )

    const cols = useMemo<Column<Advert>[]>(
        () => [
            {
                key: 'title',
                label: 'Titel',
                sortField: 'title',
                getter: ({ title }) => title,
            },
            {
                key: 'category',
                label: 'Kategori',
                getter: ({ category }) =>
                    categoryTree
                        .pathById(category)
                        .map(({ label }) => label)
                        .join(' - '),
            },
            {
                key: 'reference',
                label: 'Egen referens',
                sortField: 'reference',
                getter: ({ reference }) => reference,
            },
            {
                key: 'notes',
                label: 'Egna noteringar',
                sortField: 'notes',
                getter: ({ notes }) => notes,
            },
            {
                key: 'isOverdue',
                label: 'Försenad',
                getter: ({ meta }) =>
                    meta.claims.some(({ isOverdue }) => isOverdue),
            },
            {
                key: 'visit-link',
                label: '',
                getter: ({ id }) => `/advert/${id}`,
                header: () => null,
                cell: ({ id }) =>
                    createLink(`/advert/${id}`, <OpenInBrowserIcon />),
            },
            {
                key: 'edit-link',
                label: '',
                getter: ({ id }) => `/advert/edit/${id}`,
                header: () => null,
                cell: ({ id }) =>
                    createLink(`/advert/edit/${id}`, <EditIcon />),
            },
        ],
        [categoryTree]
    )

    const columns = useMemo<ColumnComponentFactory<Advert>[]>(
        () => [
            ...createAdvertTableComponentFactory({
                filter,
                setFilter,
            }).mapColumns(cols),
        ],
        [filter, setFilter, cols]
    )

    const [selected, setSelected] = useState(new Set<string>())

    const selectedAdverts = useMemo(
        () => adverts.filter(({ id }) => selected.has(id)),
        [selected, adverts]
    )

    const [search, setSearch] = useState(filter.search || '')

    const bulk = useCallback(
        (patch: Partial<AdvertInput>) =>
            bulkUpdate(
                filter,
                selectedAdverts.map(({ id }) => id),
                patch
            ),
        [selectedAdverts, bulkUpdate]
    )

    return (
        <Stack direction="column" spacing={2}>
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
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell key="[]">
                                <MultiselectCheckbox
                                    selected={selected}
                                    viable={adverts.map(({ id }) => id)}
                                    onChange={setSelected}
                                />
                            </TableCell>
                            {columns.map((c) => (
                                <TableCell key={c.key}>{c.header()}</TableCell>
                            ))}
                            <TableCell />
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {adverts.map((advert) => (
                            <TableRow hover key={advert.id}>
                                <TableCell key="[]">
                                    <SingleselectCheckbox
                                        id={advert.id}
                                        selected={selected}
                                        onChange={setSelected}
                                    />
                                </TableCell>
                                {columns.map((c) => (
                                    <TableCell key={c.key}>
                                        {c.cell(advert)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={PAGE_SIZES}
                component="div"
                count={adverts.length}
                rowsPerPage={filter.paging?.pageSize || PAGE_SIZE}
                page={filter.paging?.pageIndex || 0}
                onPageChange={(_, p) =>
                    setFilter({
                        ...filter,
                        paging: {
                            pageSize: PAGE_SIZE,
                            ...filter.paging,
                            pageIndex: p,
                        },
                    })
                }
                onRowsPerPageChange={(e) =>
                    setFilter({
                        ...filter,
                        paging: {
                            pageIndex: 0,
                            ...filter.paging,
                            pageSize: +e.target.value,
                        },
                    })
                }
            />
            <BulkChangeCategory
                categoryTree={categoryTree}
                disabled={selectedAdverts.length === 0}
                onBulkUpdate={bulk}
            />
            <BulkChangeNotes
                disabled={selectedAdverts.length === 0}
                onBulkUpdate={bulk}
            />
        </Stack>
    )
}
