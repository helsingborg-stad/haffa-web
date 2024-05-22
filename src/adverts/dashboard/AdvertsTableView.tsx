import { LinearProgress } from '@mui/material'
import {
    Advert,
    AdvertFilterInput,
    AdvertList,
    AdvertRestrictionsFilterInput,
    AdvertsContext,
} from 'adverts'
import { ErrorView } from 'errors'
import { FC, useCallback, useContext, useMemo, useState } from 'react'
import useAbortController from 'hooks/use-abort-controller'
import { useFetchQueue } from 'hooks/use-fetch-queue'
import { createTreeAdapter } from 'lib/tree-adapter'

import { AuthContext } from 'auth'
import { PhraseContext } from 'phrases'
import { Func1 } from 'lib/types'
import { AdvertFieldsContext } from 'advert-field-config'
import { toMap } from 'lib/to-map'
import { UrlParamsContext } from 'url-params'
import { AdvertsTable, AdvertsTableContext, PAGE_SIZE } from './AdvertsTable'
import { createColumns } from './createColumns'
import { createSortableFields } from './createSortableFields'
import { AdvertsTableContextType } from './AdvertsTable/types'
import { createBulkActions } from './createBulkActions'
import { BulkActions } from './bulk-actions'

export const AdvertsTableView: FC<{
    prefix: string
    restrictions: AdvertRestrictionsFilterInput
}> = ({ prefix, restrictions }) => {
    type Data = AdvertList & { filter: AdvertFilterInput } & {
        fields: AdvertsTableContextType['fields']
    } & {
        loading: boolean
    }
    const { signal } = useAbortController()
    const { roles } = useContext(AuthContext)
    const {
        listAdverts,
        patchAdvert,
        archiveAdvert,
        unarchiveAdvert,
        markAdvertAsPicked,
        markAdvertAsUnpicked,
    } = useContext(AdvertsContext)

    const { phrase } = useContext(PhraseContext)

    const { getFieldConfig } = useContext(AdvertFieldsContext)

    const sortableFields = useMemo(() => createSortableFields(), [])
    const { updateUrlFromAdvertFilterInput, patchAdvertFilterInputFromUrl } =
        useContext(UrlParamsContext)

    // We kind of preftech visible fields config once and return this async result
    // in subsequent searches
    const fieldsPromise = useMemo(async () => {
        const fc = await getFieldConfig()
        return toMap(
            fc,
            (r) => r.name,
            (r) => ({
                label: r.label,
                visible: r.visible,
            })
        )
    }, [getFieldConfig])

    // Given a search filter, perform actual search
    const list = useCallback<Func1<AdvertFilterInput, Promise<Data>>>(
        (filter) => {
            updateUrlFromAdvertFilterInput(prefix, filter, { sortableFields })
            return Promise.all([
                listAdverts(filter, { signal }).then((list) => ({
                    ...list,
                    filter,
                })),
                fieldsPromise, // <== called once
            ]).then(([data, fields]) => ({
                loading: false,
                ...data,
                fields,
            }))
        },
        [listAdverts, fieldsPromise]
    )

    // ids of checkbox selected adverts
    const [selected, setSelected] = useState<Array<string | number>>([])

    // Async driver for initial and repeated updates of data via server side search
    const [data, error, enqueue] = useFetchQueue<Data>(
        {
            loading: true,
            fields: {},
            adverts: [],
            categories: [],
            filter: patchAdvertFilterInputFromUrl(
                prefix,
                { restrictions },
                { sortableFields }
            ),
            paging: {
                pageIndex: 0,
                pageSize: PAGE_SIZE,
                totalCount: 0,
                pageCount: 0,
            },
        },
        () =>
            list(
                patchAdvertFilterInputFromUrl(
                    prefix,
                    {
                        paging: { pageIndex: 0, pageSize: PAGE_SIZE },
                        sorting: {
                            field: undefined,
                            ascending: true,
                        },
                        restrictions,
                    },
                    { sortableFields }
                )
            ),
        100
    )
    // Perform a forech update and the list fresh from server
    const bulkUpdateAdverts = useCallback(
        (update: (id: string | number) => Promise<any>) =>
            enqueue(() =>
                Promise.all([...selected].map(update)).then(() =>
                    list(data.filter)
                )
            ),
        [enqueue, data, selected]
    )

    const context = useMemo<AdvertsTableContextType>(
        () => ({
            adverts: data.adverts,
            paging: data.paging,
            categories: data.categories,
            categoryTree: createTreeAdapter(
                data.categories,
                (c) => c.id,
                (c) => c.categories
            ),
            filter: data?.filter,
            selected,
            fields: data.fields,
            setSelected,
            setFilter: (f) => enqueue(() => list(f)),
            selectionMatches: (p) =>
                selected.length > 0 &&
                data.adverts.filter(({ id }) => selected.includes(id)).every(p),
            selectionCommonValue: <T,>(
                getter: Func1<Advert, T>,
                def: T
            ): { value: T; conflict: boolean } => {
                const values = new Set<T>(
                    data.adverts
                        .filter(({ id }) => selected.includes(id))
                        .map(getter)
                )
                return values.size === 1
                    ? {
                          value: [...values][0],
                          conflict: false,
                      }
                    : { value: def, conflict: true }
            },
            patchAdverts: (patch) =>
                bulkUpdateAdverts((id) => patchAdvert(String(id), patch)),
            archiveAdverts: () =>
                bulkUpdateAdverts((id) => archiveAdvert(String(id))),
            unarchiveAdverts: () =>
                bulkUpdateAdverts((id) => unarchiveAdvert(String(id))),
            markAdvertsAsPicked: () =>
                bulkUpdateAdverts((id) => markAdvertAsPicked(String(id))),
            markAdvertsAsUnpicked: () =>
                bulkUpdateAdverts((id) => markAdvertAsUnpicked(String(id))),
            createAdvertLabels: () =>
                window.open(
                    `/api/v1/labels/${selected.toString()}`,
                    'Etiketter'
                ),
        }),
        [
            data,
            selected,
            enqueue,
            patchAdvert,
            archiveAdvert,
            unarchiveAdvert,
            list,
            bulkUpdateAdverts,
        ]
    )
    const bulkActions = useMemo(
        () => createBulkActions({ ...context, roles, phrase }),
        [context, roles, phrase]
    )

    return (
        <AdvertsTableContext.Provider value={context}>
            <AdvertsTableContext.Consumer>
                {(c) => (
                    <>
                        {error && <ErrorView key="error" error={error} />}
                        {data.loading && <LinearProgress key="pending" />}
                        {!data.loading && (
                            <>
                                <AdvertsTable
                                    key="resolved"
                                    columns={createColumns(c)}
                                />
                                <BulkActions bulkActions={bulkActions} />
                            </>
                        )}
                    </>
                )}
            </AdvertsTableContext.Consumer>
        </AdvertsTableContext.Provider>
    )
}
