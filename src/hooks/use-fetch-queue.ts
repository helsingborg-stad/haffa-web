import { debounce } from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'

export type FetchQueueFetch<T> = () => Promise<T>

/**
 * A react hook that monitor (value, error) of lastes finished enqueued fetch operation
 * The returned enqueue function only saves latest supplied value
 * Ensures thar at most one operation is pending at every given moment
 * @param initial Initial reported value
 * @param initialFetch Optional initial fetch
 * @param wait Optional timout for debounce
 * @returns [value, error, enqueue]
 */

export const useFetchQueue = <T>(
    initial: T,
    initialFetch?: FetchQueueFetch<T>,
    wait?: number
): [T, Error | null, (next: () => Promise<T>) => void] => {
    const [value, setValue] = useState<T>(initial)
    const [error, setError] = useState<Error | null>(null)
    const [next, setNext] = useState<FetchQueueFetch<T> | null>(
        initialFetch ? () => initialFetch : null
    )
    const [pending, setPending] = useState<Promise<T> | null>(null)

    const enqueueRaw = useCallback(
        (fetch: FetchQueueFetch<T>) => setNext(() => fetch),
        [setNext]
    )

    const enqueue = useMemo(
        () => (wait && wait > 0 ? debounce(enqueueRaw, wait) : enqueueRaw),
        [wait, enqueueRaw]
    )

    useEffect(() => {
        if (pending === null && next !== null) {
            const p = next()
                .then((value) => {
                    setError(null)
                    setValue(value)
                    setPending(null)
                    return value
                })
                .catch((error) => {
                    setError(error)
                    setPending(null)
                    throw error
                })
            setNext(null)
            setPending(p)
        }
    }, [pending, setPending, next, setNext, setValue])

    return [value, error, enqueue]
}
