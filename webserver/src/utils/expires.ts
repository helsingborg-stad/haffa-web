export const expires = (ms: number): (() => boolean) => {
    const expires = Date.now() + ms
    return () => expires < Date.now()
}
