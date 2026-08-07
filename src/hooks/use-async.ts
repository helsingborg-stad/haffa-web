import { useEffect, useRef, useState } from 'react'

export type AsyncFunc<T> = () => Promise<T>

export interface AsyncView<TData, TState, TView> {
    pending: (state: TState) => TView
    resolved: (
        data: TData,
        state: TState,
        update: (p: Promise<TData>, state?: TState) => void
    ) => TView
    rejected: (
        e: Error,
        state: TState,
        update: (p: Promise<TData>, state?: TState) => void
    ) => TView
}

export type AsyncInspect<TData, TState> = <TView>(
    view: AsyncView<TData, TState, TView>
) => TView

export default function useAsync<TData, TState = any>(
    getData: AsyncFunc<TData>,
    initialState?: TState
): AsyncInspect<TData, TState> {
    const mountedRef = useRef(false)
    const requestIdRef = useRef(0)

    const [state, setState] = useState<{
        asyncState: 'dormant' | 'pending' | 'resolved' | 'rejected'
        userState: TState | undefined
        data: TData | null
        error: Error | null
    }>({ asyncState: 'dormant', userState: undefined, data: null, error: null })

    const setPending = (p: Promise<TData>, userState: TState | undefined) => {
        const requestId = requestIdRef.current + 1
        requestIdRef.current = requestId

        setState((currentState) => ({
            ...currentState,
            asyncState: 'pending',
            userState,
            error: null,
        }))

        p.then((d) => {
            if (!mountedRef.current || requestId !== requestIdRef.current) {
                return
            }

            setState((currentState) => ({
                ...currentState,
                asyncState: 'resolved',
                data: d,
                userState,
                error: null,
            }))
        }).catch((e) => {
            if (!mountedRef.current || requestId !== requestIdRef.current) {
                return
            }

            setState((currentState) => ({
                ...currentState,
                asyncState: 'rejected',
                error: e,
                userState,
            }))
        })
    }

    useEffect(() => {
        mountedRef.current = true
        setPending(getData(), initialState)

        return () => {
            mountedRef.current = false
            requestIdRef.current += 1
        }
        // Intentionally only load once on mount.
    }, [])

    return <TView>(view: AsyncView<TData, TState, TView>) => {
        switch (state.asyncState) {
            case 'resolved':
                return view.resolved(
                    state.data as TData,
                    state.userState as TState,
                    (p, newState) => setPending(p, newState)
                )
            case 'rejected':
                return view.rejected(
                    state.error as Error,
                    state.userState as TState,
                    (p, newState) => setPending(p, newState)
                )
            default:
                return view.pending(state.userState as TState)
        }
    }
}
