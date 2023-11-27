import { treeVisit } from 'lib/tree-lookup'
import { Category, CategoryFlat } from './types'

const trim = (s: any) => (typeof s === 'string' ? s.trim() : '')

export const decodeCategoryTree = (categories: CategoryFlat[]): Category[] => {
    const byParentId = categories
        .map(({ id, parentId, label, co2kg, valueByUnit, advertCount }) => ({
            id: trim(id),
            parentId: trim(parentId),
            label: trim(label),
            co2kg: Math.max(0, co2kg || 0),
            valueByUnit: Math.max(0, valueByUnit || 0),
            advertCount,
        }))
        .filter(({ id }) => id)
        .reduce((memo, c) => {
            const l = memo[c.parentId]
            if (!l) {
                // eslint-disable-next-line no-param-reassign
                memo[c.parentId] = [c]
            } else {
                l.push(c)
            }
            return memo
        }, {} as Record<string, CategoryFlat[]>)

    const rec = (pid: string): Category[] =>
        (byParentId[pid] || [])
            .map((c) => ({
                id: c.id,
                label: c.label,
                co2kg: c.co2kg,
                valueByUnit: c.valueByUnit,
                categories: rec(c.id),
                advertCount: c.advertCount,
            }))
            .filter((v) => v)

    return rec('')
}

export const encodeCategoryTree = (
    categories: Omit<Category[], 'advertCount'>
): CategoryFlat[] => {
    const c: CategoryFlat[] = []
    treeVisit(
        categories,
        (c) => c.categories,
        ({ node, parent }) => {
            c.push({
                id: node.id,
                parentId: parent ? parent.id : '',
                label: node.label,
                co2kg: node.co2kg,
                valueByUnit: node.valueByUnit,
            })
        }
    )
    return c
}
