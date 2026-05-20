import { Box, Stack, useMediaQuery, useTheme } from '@mui/material'
import type { FC } from 'react'
import { BulkActionsAsButtonGroup } from './BulkActionsAsButtonGroup'
import { BulkActionsAsDropdownButton } from './BulkActionsAsDropdownButton'
import type { BulkAction } from './types'

export const BulkActions: FC<{ bulkActions: BulkAction[] }> = ({
    bulkActions,
}) => {
    const theme = useTheme()
    const largeScreen = useMediaQuery(theme.breakpoints.up('md'))
    const manyButtons = bulkActions.length >= 6
    const showCompact = manyButtons || !largeScreen
    return (
        <Stack direction="row">
            <Box sx={{ flex: 1 }} />
            {showCompact ? (
                <BulkActionsAsDropdownButton
                    key="bulk-actions-as-dropdown"
                    bulkActions={bulkActions}
                />
            ) : (
                <BulkActionsAsButtonGroup
                    key="bulk-actions-as-button-group"
                    bulkActions={bulkActions}
                />
            )}
        </Stack>
    )
}
