import { useState } from 'react'

type AsyncFunc<T> = () => Promise<T>;

export interface AsyncView<TData, TState, TView> {
    pending: (state: TState) => TView;
    resolved: (
        data: TData,
        state: TState,
        update: (p: Promise<TData>, state?: TState) => void,
    ) => TView;
    rejected: (
        e: Error,
        state: TState,
        update: (p: Promise<TData>, state?: TState) => void,
    ) => TView;
}

export type AsyncInspect<TData, TState> = <TView>(
    view: AsyncView<TData, TState, TView>,
) => TView;

export default function useAsync<TData, TState = any>(
	getData: AsyncFunc<TData>,
	initialState?: TState,
): AsyncInspect<TData, TState> {
	const [ state, setState ] = useState<{
        asyncState: 'dormant' | 'pending' | 'resolved' | 'rejected';
        userState: TState | undefined;
        data: TData | null;
        error: Error | null;
    }>({ asyncState: 'dormant',userState: undefined,data: null,error: null })

	const setPending = (p: Promise<TData>, userState: TState | undefined) => {
		setState({
			...state,
			asyncState: 'pending',
			userState,
		})
		p.then((d) => {
			setState({
				...state,
				asyncState: 'resolved',
				data: d,
			})
		}).catch((e) => {
			setState({
				...state,
				asyncState: 'rejected',
				error: e,
			})
		})
	}
	if (state.asyncState === 'dormant') {
		setPending(getData(), initialState)
	}

	return <TView>(view: AsyncView<TData, TState, TView>) => {
		switch (state.asyncState) {
			case 'resolved':
				return view.resolved(
                    state.data as TData,
                    state.userState as TState,
                    (p, newState) => setPending(p, newState)
					,
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
