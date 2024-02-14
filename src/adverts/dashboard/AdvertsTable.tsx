import {
    Checkbox,
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
import { AdvertFilterInput, AdvertList } from 'adverts'
import { FC, useMemo, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { NavLink } from 'react-router-dom'
import { createAdvertTableColumns, createAdvertTableHost } from './tabular'

export const PAGE_SIZE = 25
const PAGE_SIZES = [10, 25, 50, 100]

const toggleSelected = <T,>(set: Set<T>, value: T, include: boolean) => {
    const has = set.has(value)
    if (include && !has) {
        return new Set<T>([value, ...set])
    }
    if (!include && has) {
        return new Set<T>([...set].filter((v) => v !== value))
    }
    return set
}

export const AdvertsTable: FC<{
    list: AdvertList
    filter: AdvertFilterInput
    setFilter: (f: AdvertFilterInput) => void
}> = ({ list: { adverts }, filter, setFilter }) => {
    const columns = useMemo(
        () =>
            createAdvertTableColumns(
                createAdvertTableHost({ filter, setFilter })
            ),
        [filter, setFilter]
    )

    const [selectedIds, setSelectedIds] = useState(new Set<String>())

    const [search, setSearch] = useState(filter.search || '')

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
                            <TableCell />
                            {columns.map((c) => (
                                <TableCell>{c.headerComponent?.()}</TableCell>
                            ))}
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {adverts.map((advert) => (
                            <TableRow
                                hover
                                component={NavLink}
                                to={`/advert/${advert.id}`}
                                sx={{ textDecoration: 'none' }}
                            >
                                <TableCell>
                                    <Checkbox
                                        checked={selectedIds.has(advert.id)}
                                        onChange={(e) => {
                                            setSelectedIds(
                                                toggleSelected(
                                                    selectedIds,
                                                    advert.id,
                                                    e.target.checked
                                                )
                                            )
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                    />
                                </TableCell>
                                {columns.map((c) => (
                                    <TableCell>
                                        {c.cellComponent?.(advert)}
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
        </Stack>
    )
}
