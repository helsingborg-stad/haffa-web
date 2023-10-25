import { createContext } from 'react'
import { SubscriptionsContextType } from './types'

const notProvided = (method: string) => () => {
    throw new Error(`SubscriptionsContext::${method} is not provided`)
}

export const SubscriptionsContext = createContext<SubscriptionsContextType>({
    canManageSubscriptions: notProvided('canManageSubscriptions'),
    canSubscribeToFilter: notProvided('canSubscribeToFilter'),
    addAdvertFilterSubscription: notProvided('addAdvertFilterSubscription'),
})
