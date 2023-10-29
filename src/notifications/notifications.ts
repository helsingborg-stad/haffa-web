import EventEmitter from 'eventemitter3'
import {
    Notification,
    Notifications,
    SufficientlyDescribedNotification,
} from './types'

export const createNotifications = (
    defaultInvocationError?: SufficientlyDescribedNotification
): Notifications => {
    const ee = new EventEmitter()
    let notification: Notification | null = null

    const notify = () => ee.emit('notifications', notification)
    const setNotification = (
        n: SufficientlyDescribedNotification
    ): Notification => {
        notification = {
            severity: 'info',
            ...n,
        }
        notify()
        return notification
    }
    return {
        observe: (observer) => {
            ee.addListener('notifications', observer)
            notification && observer(notification)
            return () => ee.removeListener('notifications', observer)
        },
        cancel: (n) => {
            if (n === notification) {
                notification = null
                notify()
            }
        },
        info: (n) => setNotification({ severity: 'info', ...n }),
        warning: (n) => setNotification({ severity: 'warning', ...n }),
        error: (n) => setNotification({ severity: 'error', ...n }),
        notifyInvocation: (invocation, info) =>
            invocation().then(
                (result) => {
                    info && setNotification({ severity: 'info', ...info })
                    return result
                },
                (error) => {
                    defaultInvocationError &&
                        setNotification({
                            severity: 'error',
                            ...defaultInvocationError,
                        })
                    throw error
                }
            ),
    }
}
