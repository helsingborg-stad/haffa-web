import { FC } from 'react'
import { Box, Card, CardContent, Grid } from '@mui/material'
import { Editorial } from 'editorials'
import { TreeAdapter } from 'lib/types'
import { Category } from 'categories/types'
import { Advert, AdvertMutationResult } from '../../../types'
import { InfoPanel } from './InfoPanel'
import { ActionsPanel } from './ActionsPanel'
import { ClaimsPanel } from './ClaimsPanel'
import { ImagesPanel } from './ImagesPanel'
import { ArchivedPanel } from './ArchivedPanel'
import { EditorButtonsPanel } from './EditorButtonsPanel'
import { AddressCard } from './AddressCard'
import { ContactCard } from './ContactCard'

export const AdvertCard: FC<{
    advert: Advert
    categories: TreeAdapter<Category>
    error?: string
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, categories, error, onUpdate }) => {
    const { meta } = advert

    // show a disclaimer if we are administering someone eleses advert
    const showRightsDisclaimer =
        !meta.isMine && (meta.canEdit || meta.canRemove || meta.canManageClaims)

    return (
        <>
            <ArchivedPanel advert={advert} onUpdate={onUpdate} />
            <Card sx={{ mb: 1 }} variant="outlined">
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

            <AddressCard
                variant="outlined"
                advert={advert}
                sx={{ mb: 1, height: 120 }}
            />
            <ContactCard
                variant="outlined"
                advert={advert}
                sx={{ mb: 2, height: 120 }}
            />

            {meta.canManageClaims && (
                <ClaimsPanel advert={advert} onUpdate={onUpdate} />
            )}
            <EditorButtonsPanel advert={advert} onUpdate={onUpdate} />
        </>
    )
}
