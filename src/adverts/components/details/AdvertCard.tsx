import { FC, useContext, useState } from 'react'
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Alert,
    Backdrop,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    InputAdornment,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
    Typography,
} from '@mui/material'
import { NavLink, useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import RemoveIcon from '@mui/icons-material/Delete'
import ReservedIcon from '@mui/icons-material/MobileFriendly'
import CollectedIcon from '@mui/icons-material/LocalShipping'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { AdvertsContext } from 'adverts/AdvertsContext'
import { Markdown } from 'components/Markdown'
import QrCodeIcon from '@mui/icons-material/QrCode2'
import { Editorial } from 'editorials'
import { DeepLinkContext } from 'deep-links/DeepLinkContext'
import { Advert, AdvertClaimType, AdvertMutationResult } from '../../types'
import { PhraseContext } from '../../../phrases/PhraseContext'

const parseNumberInput = (n: string, min: number, max: number): number =>
    Math.min(max, Math.max(min, parseInt(n, 10))) || min

const InfoPanel: FC<{ advert: Advert; error?: string }> = ({
    advert,
    error,
}) => {
    const { fromNow } = useContext(PhraseContext)
    return (
        <>
            {error && <Alert severity="error">{error}</Alert>}
            <Typography variant="h5" component="div">
                {advert.title}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
                {`${advert.meta.reservableQuantity} ${advert.unit} ${fromNow(
                    advert.createdAt
                )}`}
            </Typography>
            <Markdown markdown={advert.description} />
        </>
    )
}

const ActionsPanel: FC<{
    advert: Advert
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, onUpdate }) => {
    const { meta } = advert
    const { reserveAdvert, cancelAdvertReservation } =
        useContext(AdvertsContext)
    const { phrase } = useContext(PhraseContext)
    const [reservationCount, setResevationCount] = useState(
        meta.reservableQuantity
    )
    return (
        <>
            <TextField
                sx={{ mb: 2 }}
                disabled={!meta.canReserve}
                value={reservationCount}
                type="number"
                fullWidth
                label={phrase('', 'Antal')}
                placeholder={phrase('', 'Antal')}
                onChange={(e) =>
                    setResevationCount(
                        parseNumberInput(
                            e.target.value,
                            1,
                            meta.reservableQuantity
                        )
                    )
                }
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Button
                                fullWidth
                                color="primary"
                                variant="outlined"
                                disabled={!meta.canReserve}
                                onClick={() =>
                                    onUpdate(reserveAdvert(advert.id, 1))
                                }
                            >
                                {phrase('', 'HAFFA!')}
                            </Button>
                        </InputAdornment>
                    ),
                }}
            />

            <Button
                fullWidth
                color="primary"
                variant="outlined"
                disabled={!meta.canCancelReservation}
                onClick={() => onUpdate(cancelAdvertReservation(advert.id))}
            >
                {phrase('', 'Ångra mina haffningar!')}
            </Button>
        </>
    )
}

const ClaimsPanel: FC<{
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
    const { fromNow } = useContext(PhraseContext)
    const { phrase } = useContext(PhraseContext)
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

export const ImagesPanel: FC<{ advert: Advert }> = ({ advert }) => {
    const [backdropImage, setBackdropImage] = useState(-1)
    return (
        <Grid container spacing={2}>
            {advert.images.map(({ url }, index) => (
                <Grid key={index} item xs={12} sm={6}>
                    <Box
                        component="img"
                        src={url}
                        sx={{
                            objectFit: 'contain',
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer',
                        }}
                        onClick={() => setBackdropImage(index)}
                    />
                    <Backdrop
                        open={backdropImage === index}
                        onClick={() => setBackdropImage(-1)}
                        sx={{
                            cursor: 'pointer',
                            background: (theme) => theme.palette.primary.light,
                            zIndex: (theme) => theme.zIndex.drawer + 1,
                        }}
                    >
                        <Box
                            component="img"
                            src={url}
                            sx={{
                                objectFit: 'contain',
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </Backdrop>
                </Grid>
            ))}
        </Grid>
    )
}

const CollectPanel: FC<{
    advert: Advert
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, onUpdate }) => {
    const { phrase, PICKUP_ADVERT } = useContext(PhraseContext)
    const [quantity, setQuantity] = useState(advert.meta.collectableQuantity)
    const { collectAdvert } = useContext(AdvertsContext)

    return (
        <Grid container spacing={2} color="primary">
            <TextField
                type="number"
                value={quantity}
                label={phrase('', 'Antal')}
                placeholder={phrase('', 'Antal')}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            />
            <Button
                color="primary"
                variant="outlined"
                disabled={!advert.meta.canCollect}
                onClick={() => onUpdate(collectAdvert(advert.id, quantity))}
            >
                {PICKUP_ADVERT}
            </Button>
        </Grid>
    )
}

export const AdvertCard: FC<{
    advert: Advert
    error?: string
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, error, onUpdate }) => {
    const { isCurrentLinkFromQrCode } = useContext(DeepLinkContext)
    const { removeAdvert } = useContext(AdvertsContext)
    const { phrase, EDIT_ADVERT, REMOVE_ADVERT } = useContext(PhraseContext)
    const { meta } = advert
    const navigate = useNavigate()

    // show a disclaimer if we are administering someone eleses advert
    const showRightsDisclaimer =
        !meta.isMine && (meta.canEdit || meta.canRemove)

    const showCollect = meta.canCollect && isCurrentLinkFromQrCode(advert)

    return (
        <>
            {showCollect && (
                <Card sx={{ mb: 2 }}>
                    <CardHeader
                        title={phrase('', 'Vill du hämta ut prylen?')}
                        subheader={phrase(
                            '',
                            'Vad kul att just fina du återbrukar just denna fina pryl ☺️'
                        )}
                    />
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item flex={1} />
                            <Grid item>
                                <CollectPanel
                                    advert={advert}
                                    onUpdate={onUpdate}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}

            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={9}>
                            <InfoPanel advert={advert} error={error} />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <ActionsPanel advert={advert} onUpdate={onUpdate} />
                        </Grid>
                    </Grid>
                </CardContent>
                <CardContent>
                    <ImagesPanel advert={advert} />
                </CardContent>

                {showRightsDisclaimer && (
                    <CardContent>
                        <Editorial severity="info">
                            Du har givits rättigheter att adminstrera denna
                            annons trots att den tillhör någon annan.
                        </Editorial>
                    </CardContent>
                )}
                {meta.canEdit && (
                    <CardContent>
                        <ClaimsPanel advert={advert} onUpdate={onUpdate} />
                    </CardContent>
                )}
                <CardActions>
                    {meta.canEdit && (
                        <Button
                            color="primary"
                            component={NavLink}
                            to={`/advert/edit/${advert?.id}`}
                            startIcon={<EditIcon />}
                        >
                            {EDIT_ADVERT}
                        </Button>
                    )}
                    {meta.canEdit && (
                        <Button
                            color="primary"
                            component={NavLink}
                            to={`/advert/qrcode/${advert.id}`}
                            target="blank"
                            startIcon={<QrCodeIcon />}
                        >
                            {phrase('', 'Skriv ut QR')}
                        </Button>
                    )}
                    {meta.canRemove && (
                        <Button
                            sx={{ ml: 'auto' }}
                            color="primary"
                            onClick={async () =>
                                onUpdate(
                                    removeAdvert(advert.id).then((r) => {
                                        navigate('/')
                                        return r
                                    })
                                )
                            }
                            startIcon={<RemoveIcon />}
                        >
                            {REMOVE_ADVERT}
                        </Button>
                    )}
                </CardActions>
            </Card>
        </>
    )
}
