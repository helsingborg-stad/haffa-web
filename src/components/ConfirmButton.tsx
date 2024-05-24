import {
    Button,
    ButtonProps,
    Dialog,
    DialogActions,
    DialogTitle,
    Stack,
} from '@mui/material'
import { PhraseContext } from 'phrases'
import { FC, useContext, useState } from 'react'

export const ConfirmButton: FC<ButtonProps> = ({
    children,
    onClick,
    ...props
}) => {
    const { phrase } = useContext(PhraseContext)
    const [dialog, setDialog] = useState(false)

    return (
        <>
            <Button {...props} onClick={() => setDialog(true)}>
                {children}
            </Button>
            <Dialog
                onClose={() => setDialog(false)}
                open={dialog}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {phrase('CONFIRM_DIALOG_TITLE', 'Är du säker?')}
                </DialogTitle>
                <DialogActions>
                    <Stack spacing={2} direction="row" sx={{ width: '100%' }}>
                        <Button
                            fullWidth
                            onClick={() => setDialog(false)}
                            variant="outlined"
                        >
                            {phrase('CONFIRM_DIALOG_CANCEL', 'Nej, avbryt')}
                        </Button>
                        <Button
                            fullWidth
                            color="primary"
                            variant="contained"
                            {...props}
                            onClick={onClick}
                        >
                            {phrase('CONFIRM_DIALOG_PROCEED', 'Ja, fortsätt')}
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    )
}
