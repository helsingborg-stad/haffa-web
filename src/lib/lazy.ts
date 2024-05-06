export const lazy = <T>(factory: () => T): (() => T) => {
    let memo: { value: T } | undefined
    return () => {
        if (!memo) {
            memo = { value: factory() }
        }
        return memo.value
    }
}
