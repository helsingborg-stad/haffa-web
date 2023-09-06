import { Tree } from 'antd'
import { DataNode } from 'antd/es/tree'
import { FC, useCallback, useContext, useState } from 'react'
import { Box, Button } from '@mui/material'
import { Category } from '../../../categories/types'
import useAsync from '../../../hooks/use-async'
import { encodeCategoryTree } from '../../../categories/mappers'
import { CategoriesContext } from '../../../categories'

export interface CategoriesFilterProps {
    selected: string[]
    onCategoriesChanged: (newCategories: string[]) => void
}

interface CheckedInput {
    checked: React.Key[]
    halfChecked: React.Key[]
}

const categoryToTreeNode = (
    category: Category,
    disabled: boolean,
    checkedKeys: string[]
): DataNode => ({
    title: category.label,
    key: category.id,
    disabled,
    children: category.categories.map((subCategory) =>
        categoryToTreeNode(
            subCategory,
            checkedKeys.includes(category.id),
            checkedKeys
        )
    ),
})

const buildTreeFromCategories = (
    categories: Category[],
    checkedKeys: string[]
): DataNode[] =>
    categories.map((category) =>
        categoryToTreeNode(category, false, checkedKeys)
    )

const findCategory = (
    allCategories: Category[],
    categoryId: string
): Category | undefined => {
    const found = allCategories.find((c) => c.id === categoryId)

    if (found) {
        return found
    }

    const matchingChildren = allCategories
        .map((c) => c.categories ?? [])
        .map((c) => findCategory(c, categoryId))
        .flat()
        .filter((c) => c !== undefined)

    return matchingChildren[0]
}

const getCategoryChildren = (category: Category | undefined): Category[] => {
    if (!category) return []
    return [
        ...category.categories,
        ...category.categories.map(getCategoryChildren).flat(),
    ]
}

export const CategoriesFilter: FC<CategoriesFilterProps> = ({
    selected,
    onCategoriesChanged,
}) => {
    const [categoriesCache, setCategoriesCache] = useState<Category[]>([])
    const { getCategories } = useContext(CategoriesContext)
    const categoriesInspect = useAsync(getCategories)

    const onCheck = (checked: React.Key[] | CheckedInput) => {
        const categories = (
            Array.isArray(checked) ? checked : checked.checked
        ).map((k) => `${k}`)

        const categoriesWithChildren = [
            ...new Set(
                categories.reduce<string[]>((acc, categoryId) => {
                    const category = findCategory(categoriesCache, categoryId)
                    const children = getCategoryChildren(category)
                    const childrenIds = children.map((c) => c.id)
                    return [...acc, categoryId, ...childrenIds]
                }, [])
            ),
        ]

        onCategoriesChanged(categoriesWithChildren)
    }

    const cacheCategories = useCallback(
        (categories: Category[]) => {
            const ids = encodeCategoryTree(categories).map((c) => c.id)
            const cachedIds = encodeCategoryTree(categoriesCache).map(
                (c) => c.id
            )
            if (
                cachedIds.length === ids.length &&
                cachedIds.every((c) => ids.includes(c))
            ) {
                return
            }
            setCategoriesCache([...categories])
        },
        [setCategoriesCache, categoriesCache]
    )

    const uncheckAll = () => onCheck([])

    return categoriesInspect({
        pending: () => null,
        rejected: (e) => {
            console.error(e)
            return <Box>Hoppsan! Något gick fel</Box>
        },
        resolved: (categories) => {
            cacheCategories(categories)
            return (
                <Box>
                    <Button variant="text" size="small" onClick={uncheckAll}>
                        Nollställ
                    </Button>
                    <Tree
                        checkable
                        checkStrictly
                        defaultExpandAll
                        autoExpandParent
                        defaultExpandParent
                        onCheck={onCheck}
                        checkedKeys={selected}
                        treeData={buildTreeFromCategories(categories, selected)}
                    />
                </Box>
            )
        },
    })
}
