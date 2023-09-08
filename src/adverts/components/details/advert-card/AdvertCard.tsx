import { FC, useContext } from 'react'
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
} from '@mui/material'
import { NavLink, useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import RemoveIcon from '@mui/icons-material/Delete'
import { AdvertsContext } from 'adverts/AdvertsContext'
import QrCodeIcon from '@mui/icons-material/QrCode2'
import { Editorial } from 'editorials'
import { DeepLinkContext } from 'deep-links/DeepLinkContext'
import { Advert, AdvertMutationResult } from '../../../types'
import { PhraseContext } from '../../../../phrases/PhraseContext'
import { InfoPanel } from './InfoPanel'
import { ActionsPanel } from './ActionsPanel'
import { ClaimsPanel } from './ClaimsPanel'
import { ImagesPanel } from './ImagesPanel'
import { CollectPanel } from './CollectPanel'
import { ArchivedPanel } from './ArchivedPanel'

export const AdvertCard: FC<{
    advert: Advert
    error?: string
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, error, onUpdate }) => {
    const { isCurrentLinkFromQrCode } = useContext(DeepLinkContext)
    const { removeAdvert, archiveAdvert } = useContext(AdvertsContext)
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
                            <ArchivedPanel
                                advert={advert}
                                onUpdate={onUpdate}
                            />
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
                    {meta.canArchive && (
                        <Button
                            sx={{ ml: 'auto' }}
                            color="primary"
                            onClick={async () =>
                                onUpdate(archiveAdvert(advert.id))
                            }
                        >
                            {phrase('', 'Arkivera')}
                        </Button>
                    )}
                    {meta.canRemove && (
                        <Button
                            sx={{ ml: 'auto' }}
                            color="warning"
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
