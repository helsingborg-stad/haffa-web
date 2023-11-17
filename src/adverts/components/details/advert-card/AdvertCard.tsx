import { FC } from 'react'
import { Card, CardContent, Grid, Stack } from '@mui/material'
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
import { DetailsPanel } from './DetailsPanel'

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
        <Stack spacing={2}>
            <ArchivedPanel advert={advert} onUpdate={onUpdate} />
            <Card>
                <CardContent key="mobile" sx={{ display: { sm: 'none' } }}>
                    <CardContent>
                        <ImagesPanel advert={advert} />
                    </CardContent>
                    <CardContent>
                        <Grid container direction="column" rowGap={1}>
                            <Grid item>
                                <InfoPanel
                                    advert={advert}
                                    categories={categories}
                                    error={error}
                                    hideDescription
                                    hideNotifications
                                />
                            </Grid>
                            <Grid item>
                                <InfoPanel
                                    advert={advert}
                                    categories={categories}
                                    error={error}
                                    hideTitle
                                />
                            </Grid>
                            <Grid item>
                                <ActionsPanel
                                    advert={advert}
                                    onUpdate={onUpdate}
                                />
                            </Grid>
                            <Grid item>
                                <DetailsPanel advert={advert} />
                            </Grid>
                            <Grid item>
                                <AddressCard advert={advert} />
                            </Grid>
                            <Grid item>
                                <ContactCard advert={advert} />
                            </Grid>
                        </Grid>
                    </CardContent>
                </CardContent>
                <CardContent
                    key="desktop"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    <Grid container spacing={2} direction="row" p={4}>
                        <Grid item xs={7} pr={8}>
                            <ImagesPanel advert={advert} />
                        </Grid>
                        <Grid item xs={5}>
                            <Grid container direction="column" rowGap={1}>
                                <Grid item pt={4}>
                                    <InfoPanel
                                        advert={advert}
                                        categories={categories}
                                        error={error}
                                        hideDescription
                                        hideNotifications
                                    />
                                </Grid>
                                <Grid item>
                                    <InfoPanel
                                        advert={advert}
                                        categories={categories}
                                        error={error}
                                        hideTitle
                                    />
                                </Grid>
                                <Grid item>
                                    <ActionsPanel
                                        advert={advert}
                                        onUpdate={onUpdate}
                                    />
                                </Grid>
                                <Grid item>
                                    <DetailsPanel advert={advert} />
                                </Grid>
                                <Grid item>
                                    <AddressCard advert={advert} />
                                </Grid>
                                <Grid item>
                                    <ContactCard advert={advert} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {meta.canManageClaims && (
                <ClaimsPanel advert={advert} onUpdate={onUpdate} />
            )}
            {showRightsDisclaimer && (
                <Editorial severity="warning">
                    Du har givits rättigheter att adminstrera denna annons trots
                    att den tillhör någon annan.
                </Editorial>
            )}
            <EditorButtonsPanel advert={advert} onUpdate={onUpdate} />
        </Stack>
    )
}
