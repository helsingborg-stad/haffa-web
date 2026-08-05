import { NotificationsContext } from 'notifications'
import { PhraseContext } from 'phrases'
import { type FC, type PropsWithChildren, useContext, useMemo } from 'react'
import { createNotifications } from './notifications'

export const NotificationsProvider: FC<PropsWithChildren & {}> = ({
    children,
}) => {
    const { ERROR_UNKNOWN } = useContext(PhraseContext)
    const value = useMemo(
        () => createNotifications({ message: ERROR_UNKNOWN }),
        [ERROR_UNKNOWN]
    )
    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    )
}
