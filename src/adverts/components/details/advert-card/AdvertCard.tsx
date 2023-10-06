import { FC, useContext } from 'react'
import { Box, Card, CardContent, CardHeader, Grid } from '@mui/material'
import { DeepLinkContext } from 'deep-links/DeepLinkContext'
import { Editorial } from 'editorials'
import { TreeAdapter } from 'lib/types'
import { Category } from 'categories/types'
import { Advert, AdvertMutationResult } from '../../../types'
import { PhraseContext } from '../../../../phrases/PhraseContext'
import { InfoPanel } from './InfoPanel'
import { ActionsPanel } from './ActionsPanel'
import { ClaimsPanel } from './ClaimsPanel'
import { ImagesPanel } from './ImagesPanel'
import { CollectPanel } from './CollectPanel'
import { ArchivedPanel } from './ArchivedPanel'
import { EditorButtonsPanel } from './EditorButtonsPanel'

export const AdvertCard: FC<{
    advert: Advert
    categories: TreeAdapter<Category>
    error?: string
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, categories, error, onUpdate }) => {
    const { isCurrentLinkFromQrCode } = useContext(DeepLinkContext)
    const { phrase } = useContext(PhraseContext)
    const { meta } = advert

    // show a disclaimer if we are administering someone eleses advert
    const showRightsDisclaimer =
        !meta.isMine && (meta.canEdit || meta.canRemove || meta.canManageClaims)

    const showCollect =
        meta.canCollect && isCurrentLinkFromQrCode(advert) && false

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

            <ArchivedPanel advert={advert} onUpdate={onUpdate} />
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <ImagesPanel advert={advert} />
                </CardContent>
                <CardContent>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={9}>
                                <InfoPanel
                                    advert={advert}
                                    categories={categories}
                                    error={error}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <ActionsPanel
                                    advert={advert}
                                    onUpdate={onUpdate}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <ActionsPanel
                                    advert={advert}
                                    onUpdate={onUpdate}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InfoPanel
                                    advert={advert}
                                    categories={categories}
                                    error={error}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>

                {showRightsDisclaimer && (
                    <CardContent>
                        <Editorial severity="warning">
                            Du har givits rättigheter att adminstrera denna
                            annons trots att den tillhör någon annan.
                        </Editorial>
                    </CardContent>
                )}
            </Card>
            {meta.canManageClaims && (
                <ClaimsPanel advert={advert} onUpdate={onUpdate} />
            )}
            <EditorButtonsPanel advert={advert} onUpdate={onUpdate} />
        </>
    )
}
