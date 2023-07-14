export interface Action {
    (): any
}

export interface Action1<T> {
    (arg: T): any
}

export interface Func<T> {
    (): T
}

export interface Func1<T, R> {
    (arg: T): R
}
