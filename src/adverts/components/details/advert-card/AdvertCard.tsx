import { Card, CardContent, Grid, Stack } from '@mui/material'
import type { AdvertFieldConfig } from 'advert-field-config/types'
import { AuthContext } from 'auth'
import type { Category } from 'categories/types'
import { Editorial } from 'editorials'
import type { TreeAdapter } from 'lib/types'
import type { PickupLocation } from 'pickup-locations/types'
import { type FC, useContext } from 'react'
import type { TagDescription } from 'tags/types'
import type { Terms } from 'terms/types'
import type {
    Advert,
    AdvertLocation,
    AdvertMutationResult,
} from '../../../types'
import { ActionsPanel } from './ActionsPanel'
import { AddressCard } from './AddressCard'
import { ArchivedPanel } from './ArchivedPanel'
import { ClaimsPanel } from './ClaimsPanel'
import { ContactCard } from './ContactCard'
import { DetailsPanel } from './DetailsPanel'
import { EditorButtonsPanel } from './EditorButtonsPanel'
import { HistoryPanel } from './HistoryPanel'
import { ImagesPanel } from './ImagesPanel'
import { InfoPanel } from './InfoPanel'
import { PickPanel } from './PickPanel'
import { PlacePanel } from './PlacePanel'
import { QRCodePanel } from './QRCodePanel'
import { ReturnPanel } from './ReturnPanel'
import { TagCard } from './TagCard'
import { TagDescriptionsPanel } from './TagDescriptionsPanel'

export const AdvertCard: FC<{
    advert: Advert
    terms: Terms
    categories: TreeAdapter<Category>
    fields: AdvertFieldConfig
    tagDescriptions: TagDescription[]
    pickupLocations: PickupLocation[]
    error?: string
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({
    advert,
    terms,
    categories,
    fields,
    tagDescriptions,
    pickupLocations,
    error,
    onUpdate,
}) => {
    const { meta } = advert
    // show a disclaimer if we are administering someone eleses advert
    const showRightsDisclaimer =
        !meta.isMine && (meta.canEdit || meta.canRemove || meta.canManageClaims)

    const effectiveLocations: AdvertLocation[] = (
        pickupLocations.length > 0 ? pickupLocations : [advert.location]
    )
        .filter((l) => l)
        .filter(({ name, adress, zipCode, city }) =>
            [name, adress, zipCode, city].some((v) => v.trim())
        )
    const { roles } = useContext(AuthContext)

    return (
        <Stack spacing={2}>
            {showRightsDisclaimer && (
                <Editorial
                    phraseKey="ADVERT_IMPERSONATION_EDITORIAL"
                    severity="warning"
                >
                    Du har givits rättigheter att adminstrera denna annons trots
                    att den tillhör någon annan.
                </Editorial>
            )}

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
                                <TagDescriptionsPanel
                                    advert={advert}
                                    tagDescriptions={tagDescriptions}
                                />
                            </Grid>
                            <Grid item>
                                <ActionsPanel
                                    advert={advert}
                                    onUpdate={onUpdate}
                                />
                            </Grid>
                            <Grid item>
                                <DetailsPanel fields={fields} advert={advert} />
                            </Grid>
                            <Grid item>
                                <AddressCard
                                    advert={advert}
                                    locations={effectiveLocations}
                                />
                            </Grid>
                            <Grid item>
                                <ContactCard advert={advert} />
                            </Grid>
                            <Grid item>
                                <TagCard
                                    advert={advert}
                                    tagDescriptions={tagDescriptions}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </CardContent>
                <CardContent
                    key="desktop"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    <Grid
                        container
                        spacing={2}
                        direction="row"
                        p={4}
                        rowGap={1}
                    >
                        <Grid item xs={7} pr={8}>
                            <ImagesPanel advert={advert} />
                        </Grid>
                        <Grid item xs={5}>
                            <Grid container direction="column">
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
                                    <TagDescriptionsPanel
                                        advert={advert}
                                        tagDescriptions={tagDescriptions}
                                    />
                                </Grid>
                                <Grid item>
                                    <ActionsPanel
                                        advert={advert}
                                        onUpdate={onUpdate}
                                    />
                                </Grid>
                                <Grid item>
                                    <DetailsPanel
                                        fields={fields}
                                        advert={advert}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <AddressCard
                                        advert={advert}
                                        locations={effectiveLocations}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <ContactCard advert={advert} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TagCard
                                        advert={advert}
                                        tagDescriptions={tagDescriptions}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <ArchivedPanel advert={advert} onUpdate={onUpdate} />

            <PickPanel advert={advert} onUpdate={onUpdate} />
            <PlacePanel
                advert={advert}
                fields={fields}
                terms={terms}
                onUpdate={onUpdate}
            />

            <ReturnPanel advert={advert} onUpdate={onUpdate} />

            <ClaimsPanel advert={advert} terms={terms} onUpdate={onUpdate} />
            <EditorButtonsPanel advert={advert} onUpdate={onUpdate} />

            {meta.canManageClaims && <HistoryPanel advert={advert} />}

            {meta.canEdit && roles.canUseQRCode && (
                <QRCodePanel advert={advert} />
            )}
        </Stack>
    )
}
