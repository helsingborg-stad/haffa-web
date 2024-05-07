import { createTreeAdapter } from './tree-adapter'

describe('tree-adapter', () => {
    interface Node {
        id: string
        nodes: Node[]
    }

    const node = (id: string, ...nodes: Node[]): Node => ({ id, nodes })
    const tree = [
        node('1', node('11'), node('12')),
        node('2', node('21'), node('22', node('221')), node('23')),
    ]

    it('findById', () => {
        const { findById } = createTreeAdapter(
            tree,
            (n) => n.id,
            (n) => n.nodes
        )
        expect(findById('22')).toBe(tree[1].nodes[1])
        expect(findById('221')).toBe(tree[1].nodes[1].nodes[0])

        expect(findById('')).toBeNull()
        expect(findById('missing')).toBeNull()
    })

    it('pathById', () => {
        const { pathById } = createTreeAdapter(
            tree,
            (n) => n.id,
            (n) => n.nodes
        )

        expect(pathById('221')).toMatchObject([
            tree[1],
            tree[1].nodes[1],
            tree[1].nodes[1].nodes[0],
        ])

        expect(pathById('')).toMatchObject([])
        expect(pathById('missing')).toMatchObject([])
    })
})
