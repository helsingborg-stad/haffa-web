export interface Action {
    (): void
}

export interface Action1<T> {
    (arg: T): void
}

export interface Func<T> {
    (): T
}

export interface Func1<T, R> {
    (arg: T): R
}
