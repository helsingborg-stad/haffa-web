import { Button } from '@mui/material'
import { Advert, AdvertMutationResult, AdvertsContext } from 'adverts'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useContext } from 'react'
import NotificationAddIcon from '@mui/icons-material/NotificationAdd'
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff'
import { AuthContext } from 'auth'
import { ReserveButton } from './action-butttons/ReserveButton'
import { CollectButton } from './action-butttons/CollectButton'

export const ActionsPanel: FC<{
    advert: Advert
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, onUpdate }) => {
    const { meta } = advert
    const {
        reserveAdvert,
        cancelAdvertReservation,
        collectAdvert,
        joinAdvertWaitlist,
        leaveAdvertWaitlist,
    } = useContext(AdvertsContext)
    const { phrase } = useContext(PhraseContext)
    const { roles } = useContext(AuthContext)

    return (
        <>
            {meta.canCollect && roles.canUseQRCode && (
                <CollectButton
                    advert={advert}
                    fullWidth
                    color="primary"
                    variant="contained"
                    sx={{ mb: 1 }}
                    onCollect={(n) => onUpdate(collectAdvert(advert.id, n))}
                />
            )}

            <ReserveButton
                key="reserve"
                advert={advert}
                onReserve={(n, l) => onUpdate(reserveAdvert(advert.id, n, l))}
            />

            <Button
                key="cancel"
                fullWidth
                color="secondary"
                variant="text"
                disabled={!meta.canCancelReservation}
                onClick={() => onUpdate(cancelAdvertReservation(advert.id))}
            >
                {phrase(
                    'ADVERT_CANCEL_RESERVATION',
                    'Ångra mina reservationer'
                )}
            </Button>
            {meta.canJoinWaitList && (
                <Button
                    key="join-waitlist"
                    fullWidth
                    color="secondary"
                    variant="text"
                    disabled={!meta.canJoinWaitList}
                    endIcon={<NotificationAddIcon />}
                    onClick={() => onUpdate(joinAdvertWaitlist(advert.id))}
                >
                    {phrase('ADVERT_JOIN_WAITLIST', 'Bevaka denna annons')}
                </Button>
            )}
            {meta.canLeaveWaitList && (
                <Button
                    key="join-waitlist"
                    fullWidth
                    color="secondary"
                    variant="text"
                    disabled={!meta.canLeaveWaitList}
                    endIcon={<NotificationsOffIcon />}
                    onClick={() => onUpdate(leaveAdvertWaitlist(advert.id))}
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
