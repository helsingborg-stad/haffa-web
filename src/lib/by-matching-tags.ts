import { Func1 } from './types'

export const byMatchingTags = <T extends { tag: string }>(
    tags: string[]
): Func1<T, boolean> => {
    const s = new Set(tags.map((t) => t?.trim() || '').filter((v) => v))
    return s.size > 0 ? (elem) => s.has(elem.tag) : () => true
}
