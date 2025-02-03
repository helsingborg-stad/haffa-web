import {
    Avatar,
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material'
import { AdminActionPanel } from 'components/AdminActionPanel'
import { AdminEditorialPanel } from 'components/AdminEditorialPanel'
import { FC, useCallback, useState } from 'react'
import Delete from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { Editorial } from 'editorials'
import {
    PickupLocation,
    PickupLocationRepository,
} from 'pickup-locations/types'
import {
    createEmptyPickupLocation,
    normalizePickupLocations,
} from 'pickup-locations/repository/mappers'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { swapArrayItems } from 'lib/array-utils'
import { PickupLocationDialog } from './PickupLocationDialog'

export interface PickupLocationWithIndex {
    position: number
    location: PickupLocation
}

export const EditPickupLocationsForm: FC<{
    locations: PickupLocation[]
    tags: string[]
    onUpdate: PickupLocationRepository['updatePickupLocations']
}> = ({ locations, tags, onUpdate }) => {
    const [memo, setMemo] = useState<PickupLocation[]>(
        normalizePickupLocations(locations)
    )
    const [editLocation, setEditLocation] = useState<PickupLocation | null>(
        null
    )
    const [disabled, setDisabled] = useState(false)

    const saveLocations = useCallback(() => {
        setDisabled(true)
        onUpdate(memo).then((result) => {
            setDisabled(false)
            setMemo(result)
        })
    }, [memo, setMemo, setDisabled])

    return (
        <>
            <AdminEditorialPanel
                key="editorial-panel"
                headline="ADMIN_PICKUPLOCATIONS_HEADLINE"
                body="ADMIN_PICKUPLOCATIONS_BODY"
            />
            <AdminActionPanel
                key="action-panel"
                onSave={saveLocations}
                disabled={disabled}
            >
                <Button
                    startIcon={<AddIcon />}
                    disabled={disabled}
                    onClick={() => setEditLocation(createEmptyPickupLocation())}
                >
                    Ny utlämningsplats
                </Button>
            </AdminActionPanel>
            <Box
                sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                }}
            >
                {editLocation && (
                    <PickupLocationDialog
                        key="edit-location-dialog"
                        onUpdate={(u) => {
                            setMemo(
                                memo.includes(editLocation)
                                    ? memo.map((l) =>
                                          l === editLocation ? u : l
                                      )
                                    : [...memo, u]
                            )
                            setEditLocation(null)
                        }}
                        onClose={() => setEditLocation(null)}
                        location={editLocation}
                        tags={tags}
                    />
                )}
                {memo.length > 0 && (
                    <List key="list">
                        {memo.map((location, index) => (
                            <ListItem
                                divider={index < memo.length - 1}
                                key={index}
                                disablePadding
                                secondaryAction={
                                    <>
                                        <IconButton
                                            disabled={index === 0}
                                            onClick={() =>
                                                setMemo(
                                                    swapArrayItems(
                                                        memo,
                                                        index,
                                                        index - 1
                                                    )
                                                )
                                            }
                                        >
                                            <ArrowUpwardIcon />
                                        </IconButton>
                                        <IconButton
                                            disabled={index === memo.length - 1}
                                            onClick={() =>
                                                setMemo(
                                                    swapArrayItems(
                                                        memo,
                                                        index,
                                                        index + 1
                                                    )
                                                )
                                            }
                                        >
                                            <ArrowDownwardIcon />
                                        </IconButton>
                                        <IconButton
                                            disabled={disabled}
                                            edge="end"
                                            aria-label="comment"
                                            onClick={() =>
                                                setMemo(
                                                    memo.filter(
                                                        (l) => l !== location
                                                    )
                                                )
                                            }
                                        >
                                            <Delete />
                                        </IconButton>
                                    </>
                                }
                            >
                                <ListItemButton
                                    disabled={disabled}
                                    onClick={() => setEditLocation(location)}
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <LocalShippingIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={location.name}
                                        secondary={
                                            <Typography component="div">
                                                <ul>
                                                    {[
                                                        [
                                                            location.adress,
                                                            location.zipCode,
                                                            location.city,
                                                        ],
                                                        [location.notifyEmail],
                                                        location.tags,
                                                    ]
                                                        .map((l) =>
                                                            l
                                                                .map((s) =>
                                                                    s?.trim()
                                                                )
                                                                .filter(
                                                                    (s) => s
                                                                )
                                                                .join(', ')
                                                        )
                                                        .filter((s) => s)
                                                        .map((s, i) => (
                                                            <li key={i}>{s}</li>
                                                        ))}
                                                </ul>
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                )}
                {memo.length === 0 && (
                    <Editorial phraseKey="ADMIN_PICKUPLOCATIONS_EMPTY" />
                )}
            </Box>
        </>
    )
}
