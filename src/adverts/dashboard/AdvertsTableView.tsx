import { LinearProgress } from '@mui/material'
import {
    AdvertFilterInput,
    AdvertList,
    AdvertRestrictionsFilterInput,
    AdvertsContext,
} from 'adverts'
import { ErrorView } from 'errors'
import { FC, useCallback, useContext } from 'react'
import useAbortController from 'hooks/use-abort-controller'
import { useFetchQueue } from 'hooks/use-fetch-queue'
import { PAGE_SIZE, AdvertsTable } from './components/AdvertsTable'

export const AdvertsTableView: FC<{
    restrictions: AdvertRestrictionsFilterInput
}> = ({ restrictions }) => {
    type Data = AdvertList & { filter: AdvertFilterInput }

    const { signal } = useAbortController()

    const { listAdverts } = useContext(AdvertsContext)

    const list = useCallback(
        (filter: AdvertFilterInput) =>
            listAdverts(filter, { signal }).then((list) => ({
                ...list,
                filter,
            })),
        [listAdverts]
    )
    const [data, error, enqueue] = useFetchQueue<Data | null>(
        null,
        () =>
            list({
                paging: { pageIndex: 0, pageSize: PAGE_SIZE },
                sorting: {
                    field: undefined,
                    ascending: true,
                },
                restrictions,
            }),
        100
    )

    return (
        <>
            {error && <ErrorView key="error" error={error} />}
            {data && (
                <AdvertsTable
                    key="resolved"
                    list={data}
                    filter={data.filter}
                    setFilter={(f) => enqueue(() => list(f))}
                />
            )}
            {data === null && <LinearProgress key="pending" />}
        </>
    )
}
