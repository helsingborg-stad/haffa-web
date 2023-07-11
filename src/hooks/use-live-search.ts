import { useCallback, useState } from 'react'

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
    const [state, setState] = useState<{
        pending: Promise<void> | null
        next: AsyncFunc<TModel> | null
        data: TModel | null
        error: Error | null
    }>({
        pending: null,
        next: null,
        data: null,
        error: null,
    })

    const enqueue = useCallback(
        (next: AsyncFunc<TModel>): void => {
            const { pending } = state
            // hackish, no react way of updating state
            // in order to avoid FOUC
            if (pending) {
                state.next = next
                return
            }
            state.next = null
            state.error = null
            state.pending = next()
                .then((data) => dequeue(data, null))
                .catch((error) => dequeue(null, error))
        },
        [state]
    )
    const dequeue = useCallback((data: TModel | null, error: Error | null) => {
        const { next } = state
        if (next) {
            state.next = null
            enqueue(next)
        }
        setState({
            ...state,
            pending: null,
            next: null,
            data,
            error,
        })
    }, [])
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
