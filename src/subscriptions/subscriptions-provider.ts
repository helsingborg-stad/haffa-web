import { SubscriptionsRepository } from './types'

export const createSubscriptionsRepository = (
    token: string,
    f?: typeof fetch
): SubscriptionsRepository => ({
    addAdvertFilterSubscription: async (filter) => {
        console.log({
            message: 'not implemented: addAdvertFilterSubscription',
            filter,
            token,
            f,
        })
    },
})
