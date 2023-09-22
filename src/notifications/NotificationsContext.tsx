import { createContext } from 'react'
import { Notifications } from './types'
import { createNotifications } from './notifications'

export const NotificationsContext = createContext<Notifications>(
    createNotifications()
)
