import { Action1 } from 'lib/types'
import { useCallback, useState } from 'react'

const createQueue = <TModel>() => {
    let current: (() => Promise<void>) | null = null
    let next: (() => Promise<void>) | null = null

    const enqueue = (
        f: AsyncFunc<TModel> | null,
        completion: Action1<{
            data: TModel | null
            error: Error | null
            pending: boolean
        }>
    ) => {
        if (!f) {
            return null
        }

        const completed = (data: TModel | null, error: Error | null) => {
            completion({ data, error, pending: next !== null })
            if (next) {
                current = next
                next = null
            } else {
                current = null
                next = null
            }
            if (current) {
                current()
            }
        }

        const wrapped = () =>
            f()
                .then((data) => completed(data, null))
                .catch((error) => completed(null, error))

        if (current) {
            next = wrapped
            return
        }
        current = wrapped
        next = null
        if (current) {
            current()
        }
    }

    return {
        get pending() {
            return current !== null || next !== null
        },
        enqueue,
    }
}

interface AsyncFunc<TModel> {
    (): Promise<TModel>
}

export interface AsyncEnqueue<T> {
    (f: AsyncFunc<T>): void
}

export interface AsyncView<TData, TView> {
    pending: (data: TData | null, enqueue: AsyncEnqueue<TData>) => TView
    resolved: (data: TData, enqueue: AsyncEnqueue<TData>) => TView
    rejected: (e: Error, enqueue: AsyncEnqueue<TData>) => TView
}

export type AsyncInspect<TData> = <TView>(
    view: AsyncView<TData, TView>
) => TView

export const useLiveSearch = <TModel>(
    getData: AsyncFunc<TModel>
): AsyncInspect<TModel> => {
    const [initialized, setInitialized] = useState(false)

    const [queue] = useState(() => createQueue<TModel | null>())

    const [state, setState] = useState<{
        pending: boolean
        data: TModel | null
        error: Error | null
    }>({
        pending: true,
        data: null,
        error: null,
    })

    const enqueue = useCallback(
        (next: AsyncFunc<TModel>): void => {
            setState({
                ...state,
                pending: true,
            })
            queue.enqueue(
                () => next(),
                ({ data, error, pending }) =>
                    setState({
                        ...state,
                        data: data || state.data,
                        error,
                        pending,
                    })
            )
        },
        [queue, state]
    )

    if (!initialized) {
        setInitialized(true)
        enqueue(getData)
    }

    return <TView>(view: AsyncView<TModel, TView>) => {
        const { pending, data, error } = state
        if (pending) {
            return view.pending(data, enqueue)
        }
        if (error) {
            return view.rejected(error, enqueue)
        }
        return view.resolved(data!, enqueue)
    }
}
