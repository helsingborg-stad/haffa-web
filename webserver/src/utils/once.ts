export const once = <T>(fn: () => Promise<T>) => {
    interface State {
        value: Promise<T>
    }
    let current: State | null = null
    return async () => {
        if (current === null) {
            current = {
                value: fn().catch((e) => {
                    current = null
                    throw e
                }),
            }
        }
        return current.value
    }
}
