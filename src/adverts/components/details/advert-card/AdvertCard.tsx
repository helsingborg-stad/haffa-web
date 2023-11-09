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
                        <InfoPanel
                            advert={advert}
                            categories={categories}
                            error={error}
                            hideDescription
                        />
                        <ActionsPanel advert={advert} onUpdate={onUpdate} />
                        <InfoPanel
                            advert={advert}
                            categories={categories}
                            error={error}
                            hideTitle
                        />
                    </CardContent>
                </CardContent>
                <CardContent
                    key="desktop"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    <Grid container spacing={2} direction="row">
                        <Grid item xs={6}>
                            <ImagesPanel advert={advert} />
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container direction="column">
                                <Grid>
                                    <InfoPanel
                                        advert={advert}
                                        categories={categories}
                                        error={error}
                                        hideDescription
                                    />
                                </Grid>
                                <Grid item>
                                    <ActionsPanel
                                        advert={advert}
                                        onUpdate={onUpdate}
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
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <AddressCard variant="outlined" advert={advert} />
            <ContactCard variant="outlined" advert={advert} />

            {showRightsDisclaimer && (
                <Card>
                    <CardContent>
                        <Editorial severity="warning">
                            Du har givits rättigheter att adminstrera denna
                            annons trots att den tillhör någon annan.
                        </Editorial>
                    </CardContent>
                </Card>
            )}

            {meta.canManageClaims && (
                <ClaimsPanel advert={advert} onUpdate={onUpdate} />
            )}
            <EditorButtonsPanel advert={advert} onUpdate={onUpdate} />
        </Stack>
    )
}
