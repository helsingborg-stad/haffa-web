import { Button } from '@mui/material'
import { Advert } from 'adverts'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useContext } from 'react'
import NotificationAddIcon from '@mui/icons-material/NotificationAdd'
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff'

export const WaitlistButton: FC<{
    advert: Advert
    onJoinWaitlist: () => void
    onLeaveWaitlist: () => void
}> = ({ advert, onJoinWaitlist, onLeaveWaitlist }) => {
    const { phrase } = useContext(PhraseContext)

    const {
        meta: { canJoinWaitList, canLeaveWaitList },
    } = advert

    return (
        <>
            {canJoinWaitList && (
                <Button
                    key="join-waitlist"
                    fullWidth
                    color="secondary"
                    variant="text"
                    disabled={!canJoinWaitList}
                    endIcon={<NotificationAddIcon />}
                    onClick={() => onJoinWaitlist()}
                >
                    {phrase('ADVERT_JOIN_WAITLIST', 'Bevaka denna annons')}
                </Button>
            )}
            {canLeaveWaitList && (
                <Button
                    key="leave-waitlist"
                    fullWidth
                    color="secondary"
                    variant="text"
                    disabled={!canLeaveWaitList}
                    endIcon={<NotificationsOffIcon />}
                    onClick={() => onLeaveWaitlist()}
                >
                    {phrase(
                        'ADVERT_LEAVE_WAITLIST',
                        'Sluta bevaka denna annons'
                    )}
                </Button>
            )}
        </>
    )
}
