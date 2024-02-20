import { FC } from 'react'
import { BulkAction } from './types'
import { BulkActionsAsDropdownButton } from './BulkActionsAsDropdownButton'
import { BulkActionsAsButtonGroup } from './BulkActionsAsButtonGroup'

export const BulkActions: FC<{ bulkActions: BulkAction[] }> = ({
    bulkActions,
}) =>
    bulkActions.length > 6 ? (
        <BulkActionsAsDropdownButton
            key="bulk-actions-as-dropdown"
            bulkActions={bulkActions}
        />
    ) : (
        <BulkActionsAsButtonGroup bulkActions={bulkActions} />
    )
