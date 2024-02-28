import { FC } from 'react'
import { Box, Stack, useMediaQuery, useTheme } from '@mui/material'
import { BulkAction } from './types'
import { BulkActionsAsDropdownButton } from './BulkActionsAsDropdownButton'
import { BulkActionsAsButtonGroup } from './BulkActionsAsButtonGroup'

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
