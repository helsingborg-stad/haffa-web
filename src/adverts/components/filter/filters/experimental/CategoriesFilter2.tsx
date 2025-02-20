import { FC, Fragment, useContext, useState } from 'react'
import { CategoriesContext } from 'categories'
import useAsync from 'hooks/use-async'
import { Category } from 'categories/types'
import { TreeSelect } from './TreeSelect'

// Take a list of categories and recursively trim list to only contain
// categories connected to unarchived adverts
const prune = (categories: Category[]): Category[] =>
    categories
        .map((c) => ({
            ...c,
            categories: prune(c.categories),
        }))
        .filter(
            (c) => (c.unarchivedAdvertCount || 0) > 0 || c.categories.length > 0
        )

// Our display model calculated from a category
interface Node {
    category: Category
    count: number
    nodes: Node[]
}

// Map a category to our display representation
const category2Node = (category: Category): Node =>
    ((node: Node): Node => ({
        ...node,
        count:
            (category.unarchivedAdvertCount || 0) +
            node.nodes.reduce((c, child) => child.count + c, 0),
    }))({
        category,
        count: 0,
        nodes: category.categories.map(category2Node),
    })

const CategoriesTree: FC<{
    categories: Category[]
    selected: string[]
    onCategoriesChanged: (newCategories: string[]) => void
}> = ({ categories, selected, onCategoriesChanged }) => {
    const [expanded, setExpanded] = useState<string[]>([])

    return (
        <TreeSelect<Node>
            roots={prune(categories).map(category2Node)}
            getKey={(n) => n.category.id}
            getChildren={(n) => n.nodes}
            getLabel={(n) => `${n.category.label} (${n.count})`}
            selected={selected}
            expanded={expanded}
            onExpanded={setExpanded}
            onSelected={(s) => onCategoriesChanged([...s])}
        />
    )
}
export const CategoriesFilter2: FC<{
    selected: string[]
    onCategoriesChanged: (newCategories: string[]) => void
}> = ({ selected, onCategoriesChanged }) => {
    const { getCategories } = useContext(CategoriesContext)
    const wait = useAsync(getCategories)
    return wait({
        pending: () => <Fragment key="pending" />,
        rejected: () => <Fragment key="rejected" />,
        resolved: (categories) => (
            <CategoriesTree
                categories={categories}
                selected={selected}
                onCategoriesChanged={onCategoriesChanged}
            />
        ),
    })
}
