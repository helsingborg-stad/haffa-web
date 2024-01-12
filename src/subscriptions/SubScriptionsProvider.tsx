import { FC, PropsWithChildren, useContext, useMemo } from 'react'
import { AuthContext } from 'auth'
import {
    AdvertSubscriptionFilter,
    SubscriptionsContextType,
    SubscriptionsRepository,
} from './types'
import { SubscriptionsContext } from './SubscriptionsContext'

const isSubscribeableFilter = (filter: AdvertSubscriptionFilter): boolean =>
    [
        filter.search,
        ...(filter.categories || []),
        ...(filter.tags || []),
        ...(filter.size || []),
    ].some((v) => v?.trim())

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
            getAdvertSubscriptions: () => repository.getAdvertSubscriptions(),
            addAdvertSubscription: (...args) =>
                repository.addAdvertSubscription(...args),
            removeAdvertSubscription: (...args) =>
                repository.removeAdvertSubscription(...args),
        }),
        [roles]
    )

    return (
        <SubscriptionsContext.Provider value={context}>
            {children}
        </SubscriptionsContext.Provider>
    )
}
