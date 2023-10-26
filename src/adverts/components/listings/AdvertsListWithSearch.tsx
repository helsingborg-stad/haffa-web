import { FC, PropsWithChildren, useCallback, useContext } from 'react'
import { Button, Pagination, Stack, SxProps, Theme } from '@mui/material'
import { AdvertFilterInput, AdvertList } from 'adverts'
import useAbortController from 'hooks/use-abort-controller'
import { createTreeAdapter } from 'lib/tree-adapter'
import { Phrase } from 'phrases/Phrase'
import {
    SubscriptionsContext,
    convertAdvertFilterToSubscriptionFilter,
} from 'subscriptions'
import { PhraseContext } from 'phrases'
import SubscriptionsIcon from '@mui/icons-material/Subscriptions'
import NotificationAddIcon from '@mui/icons-material/NotificationAdd'
import { AdvertsContext } from '../../AdvertsContext'
import { AdvertsList } from './AdvertsList'
import { ErrorView } from '../../../errors'
import { SearchableAdvertsList } from '../filter'
import { AsyncEnqueue, useLiveSearch } from '../../../hooks/use-live-search'
import useLocalStorage from '../../../hooks/use-local-storage'

const PAGE_SIZE = 5

const createEmptyResult = (): AdvertList => ({
    adverts: [],
    categories: [],
    paging: { pageIndex: 0, pageSize: PAGE_SIZE, pageCount: 0, totalCount: 0 },
})

const AdvertListSubscribe: FC<{
    searchParams: AdvertFilterInput
    sx?: SxProps<Theme>
}> = ({ searchParams, sx }) => {
    const {
        canManageSubscriptions,
        canSubscribeToFilter,
        addAdvertSubscription,
    } = useContext(SubscriptionsContext)
    const { phrase } = useContext(PhraseContext)
    const filter = convertAdvertFilterToSubscriptionFilter(searchParams)
    const buttons = canManageSubscriptions()
        ? [
              <Button
                  key="subscribe"
                  variant="outlined"
                  startIcon={<NotificationAddIcon />}
                  disabled={!canSubscribeToFilter(filter)}
                  onClick={() => addAdvertSubscription(filter).catch(() => {})}
              >
                  {phrase(
                      'SUBSCRIPTIONS_SUBSCRIBE_TO_SEARCH',
                      'Bevaka denna sökning'
                  )}
              </Button>,
              <Button
                  key="nav"
                  variant="outlined"
                  component={Button}
                  startIcon={<SubscriptionsIcon />}
                  href="/my-subscriptions"
              >
                  {phrase('NAV_SUBSCRIPTIONS', 'Visa mina bevakningar')}
              </Button>,
          ]
        : []
    return buttons.length > 0 ? (
        <Stack
            useFlexGap
            justifyContent="end"
            direction={{ xs: 'column', sm: 'row' }}
            sx={{ gap: 1, ...sx }}
        >
            {buttons}
        </Stack>
    ) : null
}
const AdvertsListPagination: FC<{
    sx?: SxProps<Theme>
    hideEmpty?: boolean
    adverts: AdvertList
    searchParams: AdvertFilterInput
    setSearchParams: (p: AdvertFilterInput) => void
}> = ({
    sx,
    hideEmpty,
    adverts: {
        paging: { totalCount, pageIndex, pageCount },
    },
    searchParams,
    setSearchParams,
}) => (
    <Stack alignItems="center" sx={sx}>
        {totalCount === 0 && !hideEmpty && (
            <Phrase
                id="SEARCH_EMPTY_RESULT"
                value="Hoppsan, det blev inga träffar på den"
            />
        )}
        {pageCount > 1 && (
            <Pagination
                color="primary"
                page={pageIndex + 1}
                count={pageCount}
                showFirstButton
                showLastButton
                onChange={(_, page) =>
                    setSearchParams({
                        ...searchParams,
                        paging: {
                            pageIndex: page - 1,
                            pageSize: PAGE_SIZE,
                        },
                    })
                }
            />
        )}
    </Stack>
)
export const AdvertsListWithSearch: FC<
    {
        cacheName: string
        defaultSearchParams: Partial<AdvertFilterInput>
        hideFilter?: boolean
        showSubscriptionOptions?: boolean
    } & PropsWithChildren
> = ({
    children,
    hideFilter,
    showSubscriptionOptions: showMonitorNewAds,
    cacheName,
    defaultSearchParams,
}) => {
    const { signal } = useAbortController()

    const effectiveInitialSearchParams: AdvertFilterInput = {
        search: '',
        sorting: {
            field: 'title',
            ascending: true,
        },
        paging: { pageIndex: 0, pageSize: PAGE_SIZE },
        ...defaultSearchParams,
    }
    const versionKey = btoa(JSON.stringify(effectiveInitialSearchParams))

    // We store searchpatams in local storage
    // The version key is used to detect when changes in default
    // parameters occus (which could be a schema addition or similar)
    // Change in default parameters are thus treated as a major version change
    const [searchParamsRaw, setSearchParamsRaw] = useLocalStorage(
        `haffa-filter-v2-${cacheName}`,
        {
            versionKey,
            p: effectiveInitialSearchParams,
        }
    )

    const setSearchParams = useCallback(
        (p: AdvertFilterInput) =>
            setSearchParamsRaw({
                versionKey,
                p,
            }),
        [setSearchParamsRaw, versionKey]
    )

    const searchParams =
        searchParamsRaw.versionKey === versionKey
            ? searchParamsRaw.p
            : effectiveInitialSearchParams

    const { listAdverts } = useContext(AdvertsContext)
    const next = useCallback(
        (p: AdvertFilterInput) => {
            setSearchParams(p)
            return listAdverts(p, { signal })
        },
        [setSearchParams, signal]
    )

    const view = useLiveSearch<AdvertList>(() => next(searchParams))

    const listResult = useCallback(
        (adverts: AdvertList, enqueue: AsyncEnqueue<AdvertList>) => (
            <SearchableAdvertsList
                key="sal"
                hideFilter={hideFilter}
                searchParams={searchParams}
                setSearchParams={(p) =>
                    enqueue(() =>
                        next({
                            ...p,
                            paging: { pageIndex: 0, pageSize: PAGE_SIZE },
                        })
                    )
                }
            >
                {showMonitorNewAds && (
                    <AdvertListSubscribe searchParams={searchParams} />
                )}
                <AdvertsListPagination
                    key="pagination-top"
                    adverts={adverts}
                    searchParams={searchParams}
                    setSearchParams={(p) => enqueue(() => next(p))}
                    sx={{ mb: 1 }}
                />
                <AdvertsList
                    key="adverts-listing"
                    adverts={adverts?.adverts || []}
                    categories={createTreeAdapter(
                        adverts?.categories || [],
                        (c) => c.id,
                        (c) => c.categories
                    )}
                />
                <AdvertsListPagination
                    key="pagination-bottom"
                    adverts={adverts}
                    searchParams={searchParams}
                    setSearchParams={(p) => enqueue(() => next(p))}
                    sx={{ mt: 1 }}
                    hideEmpty
                />
            </SearchableAdvertsList>
        ),
        [searchParams, setSearchParams, next]
    )

    return view({
        pending: (result, enqueue) =>
            listResult(result || createEmptyResult(), enqueue),
        rejected: (error, enqueue) => (
            <SearchableAdvertsList
                key="sal"
                searchParams={searchParams}
                setSearchParams={(p) => enqueue(() => next(p))}
            >
                <ErrorView key="ev" error={error} />
                {children}
            </SearchableAdvertsList>
        ),
        resolved: listResult,
    })
}
