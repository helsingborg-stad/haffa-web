import { Alert, Snackbar } from '@mui/material'
import { useNotifications } from 'notifications'
import { FC } from 'react'

export const NotificationsSnackbar: FC = () => {
    const [notification, closeNotification] = useNotifications()
    const open = !!notification

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            color="primary"
            open={open}
            autoHideDuration={6000}
            onClose={() => closeNotification()}
            message={notification?.message}
        >
            <Alert
                onClose={closeNotification}
                severity={notification?.severity || 'info'}
                sx={{ width: '100%' }}
            >
                {notification?.message}
            </Alert>
        </Snackbar>
    )
}
