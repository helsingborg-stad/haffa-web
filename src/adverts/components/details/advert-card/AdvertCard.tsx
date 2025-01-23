import React, { FC, useContext } from 'react'
import { Card, CardContent, Grid, Stack } from '@mui/material'
import { Editorial } from 'editorials'
import { TreeAdapter } from 'lib/types'
import { Category } from 'categories/types'
import { AdvertFieldConfig } from 'advert-field-config/types'
import { Terms } from 'terms/types'
import { AdvertsContext } from 'adverts/AdvertsContext'
import { Advert, AdvertMutationResult } from '../../../types'
import { InfoPanel } from './InfoPanel'
import { ClaimsPanel } from './ClaimsPanel'
import { ImagesPanel } from './ImagesPanel'
import { ArchivedPanel } from './ArchivedPanel'
import { EditorButtonsPanel } from './EditorButtonsPanel'
import { AddressCard } from './AddressCard'
import { ContactCard } from './ContactCard'
import { DetailsPanel } from './DetailsPanel'
import { ReturnPanel } from './ReturnPanel'
import { PickPanel } from './PickPanel'
import { QRCodePanel } from './QRCodePanel'
import { HistoryPanel } from './HistoryPanel'
import { TagCard } from './TagCard'
import { CollectButton } from './action-butttons/CollectButton'
import { ReserveButton } from './action-butttons/ReserveButton'
import { CancelButton } from './action-butttons/CancelButton'
import { WaitlistButton } from './action-butttons/WaitlistButton'
import { TagDescriptionsPanel } from './TagDescriptionsPanel'

export type ContentType =
    | 'ImagesPanel'
    | 'InfoPanel'
    | 'DetailsPanel'
    | 'TagDescriptionsPanel'
    | 'CollectButton'
    | 'ReserveButton'
    | 'CancelButton'
    | 'AddressCard'
    | 'ContactCard'
    | 'TagCard'
    | 'WaitlistButton'
export interface Content {
    type: 'container' | 'item'
    direction?: 'column' | 'row'
    name?: ContentType
    width?: number
    children?: Array<Content>
}
export type AdvertCardLayout = Content[]

export type ContentFactory = {
    [key in ContentType]: () => React.ReactNode
}

const layout: AdvertCardLayout = [
    {
        type: 'container',
        direction: 'row',
        children: [
            {
                type: 'item',
                name: 'ImagesPanel',
                width: 7,
            },
            {
                type: 'item',
                width: 5,
                children: [
                    {
                        type: 'container',
                        direction: 'column',
                        children: [
                            {
                                type: 'item',
                                name: 'InfoPanel',
                            },
                            {
                                type: 'item',
                                name: 'TagDescriptionsPanel',
                            },
                            {
                                type: 'item',
                                name: 'DetailsPanel',
                            },
                            {
                                type: 'item',
                                name: 'CollectButton',
                            },
                            {
                                type: 'item',
                                name: 'ReserveButton',
                            },
                            {
                                type: 'item',
                                name: 'CancelButton',
                            },
                            {
                                type: 'item',
                                name: 'WaitlistButton',
                            },
                            {
                                type: 'item',
                                name: 'AddressCard',
                            },
                            {
                                type: 'item',
                                name: 'ContactCard',
                            },
                            {
                                type: 'item',
                                name: 'TagCard',
                            },
                        ],
                    },
                ],
            },
        ],
    },
]

const ContentService = ({
    advert,
    categories,
    fields,
    error,
    onUpdate,
}: {
    advert: Advert
    categories: TreeAdapter<Category>
    fields: AdvertFieldConfig
    error?: string
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}): ContentFactory => {
    const { meta } = advert
    const {
        collectAdvert,
        reserveAdvert,
        cancelAdvertReservation,
        joinAdvertWaitlist,
        leaveAdvertWaitlist,
    } = useContext(AdvertsContext)

    return {
        InfoPanel: () => (
            <InfoPanel advert={advert} categories={categories} error={error} />
        ),
        TagDescriptionsPanel: () => <TagDescriptionsPanel advert={advert} />,
        ImagesPanel: () => <ImagesPanel advert={advert} />,
        ReserveButton: () => (
            <ReserveButton
                advert={advert}
                onReserve={(n) => onUpdate(reserveAdvert(advert.id, n))}
            />
        ),
        CancelButton: () => (
            <CancelButton
                advert={advert}
                onCancel={() => onUpdate(cancelAdvertReservation(advert.id))}
            />
        ),
        CollectButton: () =>
            meta.canCollect && (
                <CollectButton
                    advert={advert}
                    onCollect={(n) => onUpdate(collectAdvert(advert.id, n))}
                />
            ),
        WaitlistButton: () => (
            <WaitlistButton
                advert={advert}
                onJoinWaitlist={() => onUpdate(joinAdvertWaitlist(advert.id))}
                onLeaveWaitlist={() => onUpdate(leaveAdvertWaitlist(advert.id))}
            />
        ),
        DetailsPanel: () => <DetailsPanel fields={fields} advert={advert} />,
        AddressCard: () => <AddressCard advert={advert} />,
        ContactCard: () => <ContactCard advert={advert} />,
        TagCard: () => <TagCard advert={advert} />,
    }
}

const ReduceLayout = (
    items: Content[],
    factory: ContentFactory,
    flatten: boolean
): React.ReactNode => (
    <>
        {items.map((v, key) => {
            if (v.type === 'item') {
                return (
                    <Grid item xs={flatten ? 'auto' : v.width} key={key} p={1}>
                        {v.name
                            ? factory[v.name]()
                            : ReduceLayout(v.children ?? [], factory, flatten)}
                    </Grid>
                )
            }
            return flatten ? (
                ReduceLayout(v.children ?? [], factory, flatten)
            ) : (
                <Grid container direction={v.direction} p={1}>
                    {ReduceLayout(v.children ?? [], factory, flatten)}
                </Grid>
            )
        })}
    </>
)

export const AdvertCard: FC<{
    advert: Advert
    terms: Terms
    categories: TreeAdapter<Category>
    fields: AdvertFieldConfig
    error?: string
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, terms, categories, fields, error, onUpdate }) => {
    const { meta } = advert
    // show a disclaimer if we are administering someone eleses advert
    const showRightsDisclaimer =
        !meta.isMine && (meta.canEdit || meta.canRemove || meta.canManageClaims)

    const factory = ContentService({
        advert,
        categories,
        fields,
        error,
        onUpdate,
    })

    return (
        <Stack spacing={2}>
            <Card>
                <CardContent key="mobile" sx={{ display: { sm: 'none' } }}>
                    {ReduceLayout(layout, factory, true)}
                </CardContent>
                <CardContent
                    key="desktop"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    {ReduceLayout(layout, factory, false)}
                </CardContent>
            </Card>

            <ArchivedPanel advert={advert} onUpdate={onUpdate} />

            <PickPanel advert={advert} onUpdate={onUpdate} />

            <ReturnPanel advert={advert} onUpdate={onUpdate} />

            <ClaimsPanel advert={advert} terms={terms} onUpdate={onUpdate} />

            {showRightsDisclaimer && (
                <Editorial
                    phraseKey="ADVERT_IMPERSONATION_EDITORIAL"
                    severity="warning"
                >
                    Du har givits rättigheter att adminstrera denna annons trots
                    att den tillhör någon annan.
                </Editorial>
            )}
            {meta.canEdit && <QRCodePanel advert={advert} />}
            <EditorButtonsPanel advert={advert} onUpdate={onUpdate} />
            <HistoryPanel advert={advert} />
        </Stack>
    )
}
