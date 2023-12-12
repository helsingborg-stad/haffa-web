import { Box, Button, CardActions } from '@mui/material'
import { PhraseContext } from 'phrases'
import { PropsWithChildren, useContext } from 'react'
import SaveIcon from '@mui/icons-material/Save'

export const AdminActionPanel = (
    props: PropsWithChildren & {
        disabled?: boolean
        onSave: () => void
        onRestore?: () => void
    }
) => {
    const { onSave, onRestore, children, disabled = false } = props
    const { phrase } = useContext(PhraseContext)

    return (
        <CardActions>
            {children}
            <Box flex={1} />
            <Button
                type="submit"
                disabled={disabled}
                id="ADMIN_ACTION_SAVE"
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={onSave}
            >
                {phrase('ADMIN_ACTION_SAVE', 'Spara')}
            </Button>
            {onRestore && (
                <Button
                    disabled={disabled}
                    onClick={onRestore}
                    id="ADMIN_ACTION_RESTORE"
                >
                    {phrase('ADMIN_ACTION_RESTORE', 'Återställ')}
                </Button>
            )}
        </CardActions>
    )
}
