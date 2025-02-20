import { Box, Checkbox, Grid, IconButton } from '@mui/material'
import { Func1 } from 'lib/types'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Fragment } from 'react/jsx-runtime'
import { ReactNode } from 'react'

export interface TreeSelectProps<T> {
    selected: string[]
    expanded: string[]
    roots: T[]
    getKey: Func1<T, string>
    getLabel: Func1<T, ReactNode | string | number>
    getChildren: Func1<T, T[]>
    onExpanded: (expanded: string[]) => any
    onSelected: (expanded: string[]) => any
}

export function TreeSelect<T>({
    roots,
    selected,
    expanded,
    getKey,
    getLabel,
    getChildren,
    onExpanded,
    onSelected,
}: TreeSelectProps<T>) {
    interface Node {
        label: ReactNode | string | number
        value: T
        selected: boolean
        pselected: boolean
        cselected: boolean
        expanded: boolean
        children: Node[]
        canExpand: boolean
        canCollapse: boolean
    }

    const selectedSet = new Set(selected)
    const expandedSet = new Set(expanded)

    // From input items, construct display nodes that can feed ourr recursive rendering
    const buildNode = (item: T, pselected: boolean): Node =>
        ((n: Node) => ({
            ...n,
            cselected: n.children.some((c) => c.selected || c.cselected),
        }))({
            label: getLabel(item),
            value: item,
            selected: selectedSet.has(getKey(item)),
            pselected,
            cselected: false,
            expanded: expandedSet.has(getKey(item)),
            canExpand:
                !expandedSet.has(getKey(item)) && getChildren(item).length > 0,
            canCollapse:
                expandedSet.has(getKey(item)) && getChildren(item).length > 0,
            children: getChildren(item).map((child) =>
                buildNode(child, pselected || selectedSet.has(getKey(item)))
            ),
        })

    const flexCells = 16
    // Render a node using some neat flex trix
    // - indentation is done by flex={level}
    // - buttons and checkboxes have flex={1}
    // - content fills out with flex={flexCells - level}
    const renderNode = (node: Node, level: number) => (
        <Fragment key={getKey(node.value)}>
            <Grid container spacing={0} key={getKey(node.value)}>
                <Grid item flex={level} />
                <Grid item flex={1} alignContent="center">
                    {node.canExpand && (
                        <IconButton
                            key="expand"
                            size="small"
                            onClick={() =>
                                onExpanded([...expanded, getKey(node.value)])
                            }
                        >
                            <KeyboardArrowRightIcon fontSize="small" />
                        </IconButton>
                    )}
                    {node.canCollapse && (
                        <IconButton
                            key="collapse"
                            size="small"
                            onClick={() =>
                                onExpanded(
                                    expanded.filter(
                                        (k) => k !== getKey(node.value)
                                    )
                                )
                            }
                        >
                            <KeyboardArrowDownIcon fontSize="small" />
                        </IconButton>
                    )}
                </Grid>
                <Grid item flex={1} alignContent="center">
                    <Checkbox
                        checked={node.selected}
                        indeterminate={
                            (node.cselected || node.pselected) && !node.selected
                                ? true
                                : undefined
                        }
                        onChange={() =>
                            onSelected(
                                node.selected
                                    ? selected.filter(
                                          (v) => v !== getKey(node.value)
                                      )
                                    : [...selected, getKey(node.value)]
                            )
                        }
                    />
                </Grid>
                <Grid item flex={flexCells - level} alignContent="center">
                    <Box>{node.label}</Box>
                </Grid>
            </Grid>
            {node.canCollapse &&
                node.children.map((c) => renderNode(c, level + 1))}
        </Fragment>
    )

    return (
        <Box>
            {roots
                .map((root) => buildNode(root, false))
                .map((node) => renderNode(node, 0))}
        </Box>
    )
}
