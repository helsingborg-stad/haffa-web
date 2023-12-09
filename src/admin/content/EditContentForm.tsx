import { Box, Button, ButtonGroup, Grid } from '@mui/material'
import { useCallback, useState } from 'react'
import {
    ContentModule,
    ContentRepository,
    ViewComposition,
    ViewRow,
} from 'content/types'
import { Terms } from 'terms/types'
import { Category } from 'categories/types'
import { ContentCard } from 'content/components/ContentCard'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import MoveUpIcon from '@mui/icons-material/MoveUp'
import MoveDownIcon from '@mui/icons-material/MoveDown'
import { PropertyEditor } from './PropertyEditor'

type Cell = {
    row: number
    col: number
}
export interface ContentModuleWithPosition {
    position: Cell
    module: ContentModule
}

export const createModule = (): ContentModule => ({
    title: 'Titel',
    body: 'Lorum Ipsum',
    image: '',
    categories: '',
    tags: '',
})

const createRow = (): ViewRow => ({
    columns: [
        {
            module: createModule(),
        },
    ],
})

const shiftArrayPos = (arr: any[], pos: number) =>
    pos + 1 < arr.length && pos > -1
        ? [
              ...arr.slice(0, pos),
              ...arr.slice(pos, pos + 2).reverse(),
              ...arr.slice(pos + 2),
          ]
        : arr

export const EditContentForm = (props: {
    terms: Terms
    categories: Category[]
    page: ViewComposition
    update: ContentRepository['updateComposition']
}) => {
    const { update, page, categories, terms } = props

    const [cache, setCache] = useState<ContentModuleWithPosition | undefined>()
    const [rows, setRows] = useState(page.rows)

    const saveComposition = async () => {
        await update({
            rows,
        }).then((page) => setRows(page.rows))
    }
    // Column actions
    const insertCell = useCallback(
        ({ row, col }: Cell) => {
            const copy = [...rows]
            copy[row].columns.splice(col + 1, 0, {
                module: createModule(),
            })
            setRows(copy)
        },
        [rows]
    )
    const moveCell = useCallback(
        ({ row, col }: Cell) => {
            const copy = [...rows]

            copy[row].columns = shiftArrayPos(copy[row].columns, col)
            setRows(copy)
        },
        [rows]
    )
    const deleteCell = useCallback(
        ({ row, col }: Cell) => {
            const copy = [...rows]
            if (copy[row].columns.length === 1) {
                copy.splice(row, 1)
            } else {
                copy[row].columns.splice(col, 1)
            }
            setRows(copy)
        },
        [rows]
    )
    // Row actions
    const moveRow = useCallback(
        (row: number) => setRows(shiftArrayPos(rows, row)),
        [rows]
    )
    // Content actions
    const copyModule = ({ row, col }: Cell) => ({
        ...rows[row].columns[col].module,
    })
    const cacheModule = useCallback(
        ({ row, col }: Cell) =>
            setCache({
                position: { row, col },
                module: copyModule({ row, col }),
            }),
        [rows]
    )
    const cacheUpdate = useCallback(
        (module: ContentModule) => {
            cache
                ? setCache({
                      ...cache,
                      module,
                  })
                : void 0
        },
        [cache, setCache]
    )
    const applyFromCache = useCallback(() => {
        if (cache) {
            const copy = [...rows]
            const { row, col } = cache.position
            copy[row].columns[col].module = {
                ...cache.module,
            }
            setCache(undefined)
            setRows(copy)
        }
    }, [cache])

    const renderCardActions = ({ row, col }: Cell, max: Cell) => (
        <>
            {col === max.col - 1 && (
                <Box sx={{ position: 'absolute', top: 5, right: 5 }}>
                    <ButtonGroup
                        orientation="vertical"
                        size="small"
                        variant="contained"
                    >
                        <Button
                            startIcon={<MoveUpIcon />}
                            disabled={row < 1}
                            onClick={() => moveRow(row - 1)}
                        />
                        <Button
                            startIcon={<MoveDownIcon />}
                            disabled={row === max.row - 1}
                            onClick={() => moveRow(row)}
                        />
                    </ButtonGroup>
                </Box>
            )}

            <Box sx={{ position: 'absolute', bottom: 5, right: 5 }}>
                <ButtonGroup size="small">
                    <Button
                        startIcon={<ChevronLeftIcon />}
                        disabled={col === 0}
                        onClick={() => moveCell({ row, col: col - 1 })}
                    />
                    <Button
                        startIcon={<AddIcon />}
                        disabled={max.col > 3}
                        onClick={() => insertCell({ row, col })}
                    />
                    <Button
                        startIcon={<EditIcon />}
                        onClick={() => cacheModule({ row, col })}
                    />
                    <Button
                        startIcon={<DeleteIcon />}
                        onClick={() => deleteCell({ row, col })}
                    />
                    <Button
                        startIcon={<ChevronRightIcon />}
                        disabled={col === max.col - 1}
                        onClick={() => moveCell({ row, col })}
                    />
                </ButtonGroup>
            </Box>
        </>
    )

    return (
        <>
            <Button
                startIcon={<AddIcon />}
                onClick={() => setRows([createRow(), ...rows])}
            >
                Ny rad
            </Button>
            <Button
                startIcon={<SaveOutlinedIcon />}
                onClick={() => saveComposition()}
            >
                Spara
            </Button>
            {rows.map((row, rowIndex) => (
                <Grid
                    key={rowIndex}
                    container
                    rowSpacing={2}
                    columnSpacing={2}
                    pb={2}
                >
                    {row.columns.map((column, colIndex) => (
                        <Grid
                            key={colIndex}
                            item
                            xs={12}
                            md={12 / row.columns.length}
                        >
                            <ContentCard module={column.module}>
                                {renderCardActions(
                                    { row: rowIndex, col: colIndex },
                                    {
                                        row: rows.length,
                                        col: row.columns.length,
                                    }
                                )}
                            </ContentCard>
                        </Grid>
                    ))}
                </Grid>
            ))}
            {cache && (
                <PropertyEditor
                    module={cache.module}
                    terms={terms}
                    categories={categories}
                    onUpdate={cacheUpdate}
                    onApply={applyFromCache}
                    onClose={() => setCache(undefined)}
                />
            )}
        </>
    )
}
