export interface Notification {
    severity: string
    message: string
}

export type SufficientlyDescribedNotification = Partial<Notification> &
    Pick<Notification, 'message'>

export interface NotificationsObserver {
    (notification: Notification | null): void
}

export interface CancelObserver {
    (): void
}

export interface Notifications {
    observe: (observer: NotificationsObserver) => CancelObserver
    cancel: (notification: Notification) => void
    info: (notification: SufficientlyDescribedNotification) => Notification
    warning: (notification: SufficientlyDescribedNotification) => Notification
    error: (notification: SufficientlyDescribedNotification) => Notification
}
