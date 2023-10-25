import { FC, PropsWithChildren, useContext, useMemo } from 'react'
import { AuthContext } from 'auth'
import { AdvertFilterInput } from 'adverts'
import { SubscriptionsContextType, SubscriptionsRepository } from './types'
import { SubscriptionsContext } from './SubscriptionsContext'

const isSubscribeableFilter = (filter: AdvertFilterInput): boolean =>
    [filter.search, ...(filter.fields?.category?.in || [])].some((v) =>
        v?.trim()
    )

export const SubscriptionsProvider: FC<
    { repository: SubscriptionsRepository } & PropsWithChildren
> = ({ repository, children }) => {
    const { roles } = useContext(AuthContext)

    const context = useMemo<SubscriptionsContextType>(
        () => ({
            canManageSubscriptions: () => !!roles.canSubscribe,
            canSubscribeToFilter: (filter) =>
                !!(
                    repository &&
                    roles.canSubscribe &&
                    isSubscribeableFilter(filter)
                ),
            addAdvertFilterSubscription: (...args) =>
                repository.addAdvertFilterSubscription(...args),
        }),
        [roles]
    )

    return (
        <SubscriptionsContext.Provider value={context}>
            {children}
        </SubscriptionsContext.Provider>
    )
}
