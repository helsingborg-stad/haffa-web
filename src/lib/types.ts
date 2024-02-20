export interface Action {
    (): void
}

export interface Action1<T> {
    (arg: T): void
}

export interface Action2<T1, T2> {
    (a1: T1, a2: T2): void
}

export interface Action3<T1, T2, T3> {
    (a1: T1, a2: T2, a3: T3): void
}

export interface Func<T> {
    (): T
}

export interface Func1<T, R> {
    (arg: T): R
}

export interface TreeAdapter<T> {
    rootNodes: T[]
    allNodes: T[]
    findById: (id: string) => T | null
    pathById: (id: string) => T[]
}
