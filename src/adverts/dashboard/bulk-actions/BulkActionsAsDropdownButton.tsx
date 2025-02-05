import {
    Button,
    ButtonGroup,
    ClickAwayListener,
    Grow,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    Popper,
} from '@mui/material'
import { FC, useMemo, useRef, useState } from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { BulkAction } from './types'

export const BulkActionsAsDropdownButton: FC<{ bulkActions: BulkAction[] }> = ({
    bulkActions,
}) => {
    const [open, setOpen] = useState(false)
    const anchorRef = useRef<HTMLDivElement>(null)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [dialogAction, setDialogAction] = useState<BulkAction | null>(null)

    const actions = useMemo<BulkAction[]>(
        () =>
            [
                {
                    key: '???',
                    label: 'Välj åtgärd',
                    enabled: () => true,
                    action: () => setOpen(true),
                },
                ...bulkActions,
            ].map((action) => {
                if (action.dialogAction) {
                    return {
                        ...action,
                        action: () => setDialogAction(action),
                    }
                }
                return action
            }),

        [setOpen, bulkActions]
    )

    const selectedAction = useMemo(
        () => actions[selectedIndex],
        [actions, selectedIndex]
    )

    return (
        <>
            {dialogAction?.dialogAction?.({
                action: dialogAction,
                open: !!dialogAction,
                closeDialog: () => setDialogAction(null),
            })}

            <ButtonGroup
                variant="contained"
                ref={anchorRef}
                aria-label="Bulkoperationer"
            >
                <Button
                    onClick={() => selectedAction.action()}
                    disabled={!selectedAction.enabled()}
                    startIcon={selectedAction.icon}
                >
                    {selectedAction.label}
                </Button>
                <Button
                    size="small"
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={() => setOpen(!open)}
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Popper
                sx={{
                    zIndex: 1000,
                }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom'
                                    ? 'center top'
                                    : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener
                                onClickAway={() => setOpen(false)}
                            >
                                <MenuList id="split-button-menu" autoFocusItem>
                                    {actions.map(
                                        (action, index) =>
                                            index !== 0 && (
                                                <MenuItem
                                                    key={action.key}
                                                    disabled={!action.enabled()}
                                                    selected={
                                                        index === selectedIndex
                                                    }
                                                    onClick={() => {
                                                        setOpen(false)
                                                        setSelectedIndex(index)
                                                        // immediate trigger dialog action
                                                        setDialogAction(
                                                            action.dialogAction
                                                                ? action
                                                                : null
                                                        )
                                                    }}
                                                >
                                                    <ListItemIcon>
                                                        {action.icon}
                                                    </ListItemIcon>
                                                    <ListItemText>
                                                        {action.label}
                                                    </ListItemText>
                                                </MenuItem>
                                            )
                                    )}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    )
}
