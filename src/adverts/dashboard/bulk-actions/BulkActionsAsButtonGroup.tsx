import { Button, ButtonGroup } from '@mui/material'
import { FC, useMemo, useState } from 'react'
import { BulkAction } from './types'

export const BulkActionsAsButtonGroup: FC<{ bulkActions: BulkAction[] }> = ({
    bulkActions,
}) => {
    const [dialogAction, setDialogAction] = useState<BulkAction | null>(null)
    const actions = useMemo<BulkAction[]>(
        () =>
            bulkActions.map((action) => {
                if (action.dialogAction) {
                    return {
                        ...action,
                        action: () => setDialogAction(action),
                    }
                }
                return action
            }),

        [bulkActions]
    )

    return (
        <>
            {dialogAction?.dialogAction?.({
                action: dialogAction,
                open: !!dialogAction,
                closeDialog: () => setDialogAction(null),
            })}

            <ButtonGroup variant="contained">
                {actions.map((action) => (
                    <Button
                        key={action.key}
                        onClick={() => action.action()}
                        disabled={!action.enabled()}
                        startIcon={action.icon}
                    >
                        {action.label}
                    </Button>
                ))}
            </ButtonGroup>
        </>
    )
}
