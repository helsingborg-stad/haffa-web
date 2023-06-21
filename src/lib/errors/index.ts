const ERROR_NOT_FOUND = 'NOT FOUND'

export interface RenderError<T> {
	notFound: () => T,
	default: () => T 
}
export const renderError = <T>(error: any, render: RenderError<T>): T => {
	switch(error?.message) {
		case ERROR_NOT_FOUND:
			return render.notFound()
		default:
			return render.default()
	}
} 

export const ifNullThenNotFoundError = <T>(value: T): T => {
	if (value === null) {
		throw new Error(ERROR_NOT_FOUND)
	}
	return value
}