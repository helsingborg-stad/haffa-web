import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useContext } from 'react'
import ReservedIcon from '@mui/icons-material/MobileFriendly'
import CollectedIcon from '@mui/icons-material/LocalShipping'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import RemoveIcon from '@mui/icons-material/Delete'
import { AdvertsContext } from 'adverts'
import { Advert, AdvertClaimType, AdvertMutationResult } from '../../../types'

export const ClaimsPanel: FC<{
    advert: Advert
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({
    advert: {
        id,
        unit,
        meta: { claims, canCancelClaim },
    },
    onUpdate,
}) => {
    const { fromNow, phrase } = useContext(PhraseContext)
    const { cancelAdvertClaim } = useContext(AdvertsContext)
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{phrase('', 'Transaktioner')}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <List>
                    {claims.map(({ at, by, type, quantity }) => (
                        <ListItem key={`${at}-${by}-${type}-${quantity}`}>
                            <ListItemIcon>
                                {type === AdvertClaimType.reserved && (
                                    <ReservedIcon />
                                )}
                                {type === AdvertClaimType.collected && (
                                    <CollectedIcon />
                                )}
                            </ListItemIcon>
                            <ListItemText>
                                {fromNow(at)} {by}{' '}
                                {type === AdvertClaimType.reserved &&
                                    phrase('', 'haffade')}
                                {type === AdvertClaimType.collected &&
                                    phrase('', 'hämtade')}{' '}
                                {quantity} {unit}
                            </ListItemText>
                            {canCancelClaim && (
                                <ListItemButton
                                    onClick={() =>
                                        onUpdate(
                                            cancelAdvertClaim(id, {
                                                at,
                                                by,
                                                type,
                                                quantity,
                                            })
                                        )
                                    }
                                >
                                    <ListItemIcon>
                                        <RemoveIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        {phrase('', 'Annullera')}
                                    </ListItemText>
                                </ListItemButton>
                            )}
                        </ListItem>
                    ))}
                </List>
            </AccordionDetails>
        </Accordion>
    )
}
