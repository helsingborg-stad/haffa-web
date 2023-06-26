import { ErrorView } from './ErrorView'

const ERROR_NOT_FOUND = 'NOT FOUND'
export { ErrorView }
export interface RenderError<T> {
	notFound: (error: any) => T,
	default: (error: any) => T 
}
const isNotFound = (error: any) => (error?.status === 404) || (/not found/ig.test(error?.message))
export const renderError = <T>(error: any, render: RenderError<T>): T => {
	if (isNotFound(error)) {
		return render.notFound(error)
	}
	return render.default(error)
} 

export const ifNullThenNotFoundError = <T>(value: T): T => {
	if (value === null) {
		throw new Error(ERROR_NOT_FOUND)
	}
	return value
}