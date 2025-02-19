import { Tree } from 'antd'
import { DataNode } from 'antd/es/tree'
import React, { FC, useCallback, useContext, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Category } from '../../../../categories/types'
import useAsync from '../../../../hooks/use-async'
import { encodeCategoryTree } from '../../../../categories/mappers'
import { CategoriesContext } from '../../../../categories'

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
): DataNode | null => {
    const n = {
        title: `${category.label} (${category.accumulatedAdvertCount})`,
        key: category.id,
        disabled,
        children: category.categories
            .map((subCategory) =>
                categoryToTreeNode(
                    subCategory,
                    checkedKeys.includes(category.id),
                    checkedKeys
                )
            )
            .filter((n) => n)
            .map((n) => n!),
    }
    if (n.children.length || (category.unarchivedAdvertCount || 0) > 0) {
        return n
    }
    return null
}

const buildTreeFromCategories = (
    categories: Category[],
    checkedKeys: string[]
): DataNode[] =>
    categories
        .map((category) => categoryToTreeNode(category, false, checkedKeys))
        .filter((n) => n)
        .map((n) => n!)

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

    return categoriesInspect({
        pending: () => null,
        rejected: () => <Box>Hoppsan! Något gick fel</Box>,
        resolved: (categories) => {
            // Calculate total adverts in category
            const countAdverts = (category: Category): number =>
                (category.categories?.reduce(
                    (p, c) => p + countAdverts(c),
                    0
                ) ?? 0) + (category.unarchivedAdvertCount ?? 0)

            // Calculate accumulated adverts
            const updateCategories = (categories: Category[]): Category[] =>
                categories.map((cat) => ({
                    ...cat,
                    categories: updateCategories(cat.categories),
                    accumulatedAdvertCount: countAdverts(cat),
                }))
            // Remove empty categories
            const filterCategories = (categories: Category[]): Category[] =>
                categories
                    .map((cat) => ({
                        ...cat,
                        categories: filterCategories(cat.categories),
                    }))
                    .filter((x) => (x.accumulatedAdvertCount ?? 0) > 0)

            const cleanedCategories = filterCategories(
                updateCategories(categories)
            )

            cacheCategories(cleanedCategories)
            return (
                <>
                    <Typography variant="subtitle1" gutterBottom>
                        Kategorier
                    </Typography>
                    <Box>
                        <Tree
                            checkable
                            checkStrictly
                            onCheck={onCheck}
                            checkedKeys={selected}
                            defaultExpandedKeys={selected}
                            treeData={buildTreeFromCategories(
                                cleanedCategories,
                                selected
                            )}
                        />
                    </Box>
                </>
            )
        },
    })
}
