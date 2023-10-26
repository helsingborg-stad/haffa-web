import { NotificationsContext } from 'notifications'
import { PhraseContext } from 'phrases'
import { FC, PropsWithChildren, useContext } from 'react'
import { createNotifications } from './notifications'

export const NotificationsProvider: FC<PropsWithChildren & {}> = ({
    children,
}) => {
    const { ERROR_UNKNOWN } = useContext(PhraseContext)
    return (
        <NotificationsContext.Provider
            value={createNotifications({
                message: ERROR_UNKNOWN,
            })}
        >
            {children}
        </NotificationsContext.Provider>
    )
}
