import { createContext } from 'react'
import { createNotifications } from './notifications'
import type { Notifications } from './types'

export const NotificationsContext = createContext<Notifications>(
    createNotifications()
)
