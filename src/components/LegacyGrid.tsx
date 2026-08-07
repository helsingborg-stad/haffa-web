import { Box, type BoxProps } from '@mui/material'
import type { CSSProperties, FC, PropsWithChildren } from 'react'

type GridSpan = number | 'auto'

type LegacyGridProps = PropsWithChildren<
    BoxProps & {
        container?: boolean
        item?: boolean
        xs?: GridSpan
        sm?: GridSpan
        md?: GridSpan
        spacing?: number | string
        rowSpacing?: number | string
        columnSpacing?: number | string
    }
>

const spanToWidth = (span: GridSpan): CSSProperties['width'] =>
    span === 'auto' ? 'auto' : `${(span / 12) * 100}%`

export const Grid: FC<LegacyGridProps> = ({
    container,
    item,
    xs,
    sm,
    md,
    spacing,
    rowSpacing,
    columnSpacing,
    sx,
    children,
    ...rest
}) => {
    const widthByBreakpoint: Record<string, CSSProperties['width']> = {}

    if (typeof xs !== 'undefined') {
        widthByBreakpoint.xs = spanToWidth(xs)
    }
    if (typeof sm !== 'undefined') {
        widthByBreakpoint.sm = spanToWidth(sm)
    }
    if (typeof md !== 'undefined') {
        widthByBreakpoint.md = spanToWidth(md)
    }

    const isAutoWidth = xs === 'auto' || sm === 'auto' || md === 'auto'

    return (
        <Box
            {...rest}
            sx={[
                container
                    ? {
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: spacing,
                          rowGap: rowSpacing,
                          columnGap: columnSpacing,
                      }
                    : {},
                item
                    ? {
                          minWidth: 0,
                          ...(Object.keys(widthByBreakpoint).length > 0
                              ? {
                                    width: widthByBreakpoint,
                                    flexBasis: widthByBreakpoint,
                                    maxWidth: widthByBreakpoint,
                                }
                              : {}),
                          ...(isAutoWidth
                              ? {
                                    width: 'auto',
                                    flexBasis: 'auto',
                                    maxWidth: 'none',
                                }
                              : {}),
                      }
                    : {},
                sx,
            ]}
        >
            {children}
        </Box>
    )
}
