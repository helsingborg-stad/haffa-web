import { expires } from './expires'

export const cached = <T>(fn: () => Promise<T>, ms: number) => {
    interface State {
        value: Promise<T>
        expired: () => boolean
    }
    let current: State | null = null
    return async () => {
        if (current === null || current.expired()) {
            current = {
                expired: expires(ms),
                value: fn().catch((e) => {
                    current = null
                    throw e
                }),
            }
        }
        return current.value
    }
}
