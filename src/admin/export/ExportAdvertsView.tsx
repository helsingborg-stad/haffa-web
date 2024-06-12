import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Checkbox,
    FormControlLabel,
    LinearProgress,
    Stack,
} from '@mui/material'
import { Advert, AdvertRestrictionsFilterInput, AdvertsContext } from 'adverts'
import { createEmptyAdvertInput } from 'adverts/repository/mappers'
import { DeepLinkContext } from 'deep-links/DeepLinkContext'
import { ErrorView } from 'errors'
import { useLiveSearch } from 'hooks/use-live-search'
import { FC, useCallback, useContext, useMemo, useState } from 'react'
import * as xlsx from 'xlsx'
import * as fileSaver from 'file-saver'
import useAbortController from 'hooks/use-abort-controller'
import { CategoriesContext } from 'categories'
import { createTreeAdapter } from 'lib/tree-adapter'
import { TreeAdapter } from 'lib/types'
import { Category } from 'categories/types'

/**
 * Repeatedly invoke next action from factory until factory returns null
 * @param factory action to invoke or null (to terminate)
 * @returns
 */
export const waitRepeat = async (
    factory: () => Promise<(() => Promise<any>) | null>
): Promise<void> => {
    const action = await factory()
    if (!action) {
        return
    }
    await action()
    await waitRepeat(factory)
}

interface Field {
    label: string
    getter: (a: Advert, categories: TreeAdapter<Category>) => string | number
}

const SelectFields: FC<{
    fields: Field[]
    selected: string[]
    setSelected: (s: string[]) => void
}> = ({ fields, selected, setSelected }) => (
    <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
        {fields.map(({ label }) => (
            <FormControlLabel
                key={label}
                label={label}
                control={
                    <Checkbox
                        checked={selected.includes(label)}
                        onChange={({ target: { checked } }) =>
                            setSelected(
                                checked
                                    ? [label, ...selected]
                                    : selected.filter((v) => v !== label)
                            )
                        }
                    />
                }
            />
        ))}
    </Stack>
)

export const ExportAdvertsView: FC = () => {
    const { signal } = useAbortController()
    const { getAdvertLink, getAdvertLinkForQrCode } =
        useContext(DeepLinkContext)
    const { listAdverts } = useContext(AdvertsContext)
    const { getCategories } = useContext(CategoriesContext)

    const systemFields = useMemo<Field[]>(
        () => [
            { label: 'id', getter: ({ id }) => id },
            {
                label: 'arkiverad',
                getter: (advert) =>
                    advert.meta.canUnarchive ? 'arkiverad' : '',
            },
            { label: 'url', getter: getAdvertLink },
            {
                label: 'qrkod',
                getter: getAdvertLinkForQrCode,
            },
        ],
        [getAdvertLinkForQrCode]
    )

    const simpleFields = useMemo<Field[]>(
        () =>
            Object.entries(createEmptyAdvertInput())
                .filter(
                    ([_, value]) =>
                        typeof value === 'string' || typeof value === 'number'
                )
                .map(([key]) => ({
                    label: key,
                    getter: (a: Advert, _: TreeAdapter<Category>) =>
                        (a as any)[key],
                }))
                .map((f) =>
                    f.label === 'category'
                        ? {
                              ...f,
                              getter: (a: Advert, t: TreeAdapter<Category>) =>
                                  t
                                      .pathById(a.category)
                                      .map(({ label }) => label)
                                      .join(','),
                          }
                        : f
                )
                .concat([
                    {
                        label: 'tags',
                        getter: ({ tags }) => tags.join(','),
                    },
                ]),
        []
    )

    const [selected, setSelected] = useState<string[]>(['id', 'qrkod'])

    const generateExport = useCallback(
        async (restrictions: AdvertRestrictionsFilterInput, name: string) => {
            const categories = await getCategories()
            const categoryTree = createTreeAdapter(
                categories,
                (c) => c.id,
                (c) => c.categories
            )

            const fields = [...systemFields, ...simpleFields].filter(
                ({ label }) => selected.includes(label)
            )
            const headers = fields.map(({ label }) => label)
            const data: (string | number)[][] = []

            const getPage = async (pageIndex: number) => {
                const {
                    adverts,
                    paging: {
                        totalCount,
                        pageCount,
                        pageIndex: actualPageIndex,
                    },
                } = await listAdverts(
                    {
                        restrictions,
                        paging: { pageIndex, pageSize: 50 },
                    },
                    { signal }
                )
                adverts.forEach((advert) => {
                    data.push(
                        fields.map(({ getter }) => getter(advert, categoryTree))
                    )
                })
                if (adverts.length === 0) {
                    return null
                }
                if (data.length >= totalCount) {
                    return null
                }
                if (pageIndex >= pageCount) {
                    return null
                }
                if (pageIndex !== actualPageIndex) {
                    return null
                }
                return () => getPage(pageIndex + 1)
            }
            await waitRepeat(() => getPage(0))

            const ws = xlsx.utils.aoa_to_sheet([headers, ...data])
            const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
            const excelBuffer = xlsx.write(wb, {
                bookType: 'xlsx',
                type: 'array',
            })
            const buffer = new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
            })
            fileSaver.saveAs(buffer, name)
        },
        [systemFields, simpleFields, selected, listAdverts]
    )

    const view = useLiveSearch<unknown>(async () => ({}))
    return view({
        rejected: (error) => <ErrorView error={error} />,
        pending: () => <LinearProgress />,
        resolved: (_, enqueue) => (
            <Card>
                <CardHeader title="Systemfält" />
                <CardContent>
                    <SelectFields
                        fields={systemFields}
                        selected={selected}
                        setSelected={setSelected}
                    />
                </CardContent>
                <CardHeader title="Annonsfält" />
                <CardContent>
                    <SelectFields
                        fields={simpleFields}
                        selected={selected}
                        setSelected={setSelected}
                    />
                </CardContent>
                <CardActions>
                    <Stack direction="row" spacing={1} width="100%">
                        <Box sx={{ flex: 1 }} />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                                enqueue(() =>
                                    generateExport(
                                        {
                                            isArchived: false,
                                            editableByMe: true,
                                        },
                                        `adverts-${Date.now()}.xlsx`
                                    )
                                )
                            }
                        >
                            Exportera
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() =>
                                enqueue(() =>
                                    generateExport(
                                        {
                                            isArchived: true,
                                            editableByMe: true,
                                        },
                                        `adverts-archived-${Date.now()}.xlsx`
                                    )
                                )
                            }
                        >
                            Exportera arkiverade
                        </Button>
                    </Stack>
                </CardActions>
            </Card>
        ),
    })
}
