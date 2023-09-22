import { useContext, useEffect, useState } from 'react'
import { NotificationsContext } from './NotificationsContext'
import { Notification } from './types'

export const useNotifications = (): [Notification | null, () => void] => {
    const { observe, cancel } = useContext(NotificationsContext)
    const [notification, setNotification] = useState<Notification | null>(null)
    useEffect(() => observe(setNotification))
    return [notification, () => notification && cancel(notification)]
}
