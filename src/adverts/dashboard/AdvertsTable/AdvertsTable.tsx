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
import { Advert } from 'adverts'
import { FC, useContext, useMemo, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import { Column, ColumnComponentFactory } from './types'
import { createAdvertTableComponentFactory } from '../components'
import { MultiselectCheckbox } from '../components/MultiselectCheckbox'
import { SingleselectCheckbox } from '../components/SingleselectCheckbox'
import { AdvertsTableContext } from './AdvertsTableContext'

export const PAGE_SIZE = 25
const PAGE_SIZES = [10, 25, 50, 100]

export const AdvertsTable: FC<{
    columns: Column<Advert>[]
}> = ({ columns }) => {
    const { selected, setSelected, filter, setFilter, adverts, paging } =
        useContext(AdvertsTableContext)
    const cols = useMemo<ColumnComponentFactory<Advert>[]>(
        () => [
            ...createAdvertTableComponentFactory({
                filter,
                setFilter,
            }).mapColumns(columns),
        ],
        [filter, setFilter, columns]
    )

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
                            <TableCell key="[]">
                                <MultiselectCheckbox
                                    selected={selected}
                                    viable={adverts.map(({ id }) => id)}
                                    onChange={setSelected}
                                />
                            </TableCell>
                            {cols.map((c) => (
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
                                {cols.map((c) => (
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
                count={paging.totalCount}
                rowsPerPage={paging.pageSize}
                page={paging.pageIndex || 0}
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
