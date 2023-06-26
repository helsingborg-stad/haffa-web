import { useCallback, useState } from 'react'

interface AsyncFunc<TModel> {
	(): Promise<TModel>
}

export interface AsyncView<TData, TView> {
    pending: (
		data: TData|null,
		enqueue: (f: AsyncFunc<TData>) => void) => TView;
    resolved: (
        data: TData,
        enqueue: (f: AsyncFunc<TData>) => void,
    ) => TView;
    rejected: (
        e: Error,
        enqueue: (f: AsyncFunc<TData>) => void,
    ) => TView;
}

export type AsyncInspect<TData> = <TView>(
    view: AsyncView<TData, TView>,
) => TView;

export const useLiveSearch = <TModel>(
	getData: AsyncFunc<TModel>,
): AsyncInspect<TModel> => {
	const [ state, setState ] = useState<{
		initialized: boolean,
		pending: Promise<void>|null,
		next: AsyncFunc<TModel>|null,
		data: TModel | null,
		error: Error | null
;
    }>({ initialized: false, pending: null, next: null, data: null, error: null })

	const enqueue = useCallback((next: AsyncFunc<TModel>): void => {
		const { pending } = state
		if (pending) {
			setState({
				...state,
				initialized: true,
				next,
			})
			return
		}
		setState({
			...state,
			initialized: true,
			next: null,
			error: null,
			pending: next()
				.then(data => dequeue(data, null))
				.catch(error => dequeue(null, error)),
		})
	}, [  ])
	const dequeue = useCallback((data: TModel|null, error: Error|null) => {
		const { next } = state
		setState({
			...state,
			initialized: true,
			pending: null,
			next: null,
			data,
			error,
		})
		if (next) {
			enqueue(next)
		}
	}, [  ])
	if (!state.initialized) {
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