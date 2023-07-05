import { ErrorView } from './ErrorView'
import { NotFoundView } from './NotFoundView'

const ERROR_NOT_FOUND = 'NOT FOUND'
export { ErrorView, NotFoundView }
export interface RenderError<T> {
    notFound: (error: any) => T
    default: (error: any) => T
}
const isNotFound = (error: any) =>
    error?.status === 404 || /not found/gi.test(error?.message)
export const renderError = <T>(error: any, render: RenderError<T>): T => {
    if (isNotFound(error)) {
        return render.notFound(error)
    }
    return render.default(error)
}

export const ifNullThenNotFoundError = <T>(value: T): T => {
    if (value === null) {
        throw Object.assign(new Error(ERROR_NOT_FOUND), { code: 404 })
    }
    return value
}

export const valueAndValidOrThrowNotFound = <T>(value: T, isValid: any) => {
    if (!isValid) {
        throw Object.assign(new Error(ERROR_NOT_FOUND), { code: 404 })
    }
    return value
}
