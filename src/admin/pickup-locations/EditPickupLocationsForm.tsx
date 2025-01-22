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
import { createEmptyPickupLocation } from 'pickup-locations/repository/mappers'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import { PickupLocationEditor } from './PickupLocationEditor'

export interface PickupLocationWithIndex {
    position: number
    location: PickupLocation
}

export const EditPickupLocationsForm: FC<{
    locations: PickupLocation[]
    tags: string[]
    onUpdate: PickupLocationRepository['updatePickupLocations']
}> = ({ locations, tags, onUpdate }) => {
    const [list, setList] = useState<PickupLocation[]>(locations)
    const [cache, setCache] = useState<PickupLocationWithIndex | undefined>()
    const [disabled, setDisabled] = useState(false)

    const saveLocations = useCallback(() => {
        setDisabled(true)
        onUpdate(list).then((result) => {
            setDisabled(false)
            setList(result)
        })
    }, [list])

    const cacheUpdate = useCallback(
        (module: PickupLocation) => {
            cache
                ? setCache({
                      ...cache,
                      location: module,
                  })
                : undefined
        },
        [cache, setCache]
    )

    const applyFromCache = useCallback(() => {
        if (cache) {
            if (cache.position === -1) {
                setList([cache.location, ...list])
            } else {
                const copy = [...list]
                copy[cache.position] = { ...cache.location }
                setList(copy)
            }
            setCache(undefined)
        }
    }, [cache])

    const deleteRow = (index: number) =>
        setList([...list.slice(0, index), ...list.slice(index + 1)])

    return (
        <>
            <AdminEditorialPanel
                headline="ADMIN_PICKUPLOCATIONS_HEADLINE"
                body="ADMIN_PICKUPLOCATIONS_BODY"
            />
            <AdminActionPanel onSave={saveLocations} disabled={disabled}>
                <Button
                    startIcon={<AddIcon />}
                    disabled={disabled}
                    onClick={() =>
                        setCache({
                            position: -1,
                            location: createEmptyPickupLocation(),
                        })
                    }
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
                {cache && (
                    <PickupLocationEditor
                        onUpdate={(e) => cacheUpdate(e)}
                        onClose={() => setCache(undefined)}
                        onApply={applyFromCache}
                        location={cache.location}
                        tags={tags}
                    />
                )}
                {list.length > 0 && (
                    <List>
                        {list.map((e, i) => (
                            <ListItem
                                divider={i < list.length - 1}
                                key={i}
                                disablePadding
                                secondaryAction={
                                    <IconButton
                                        disabled={disabled}
                                        edge="end"
                                        aria-label="comment"
                                        onClick={() => deleteRow(i)}
                                    >
                                        <Delete />
                                    </IconButton>
                                }
                            >
                                <ListItemButton
                                    disabled={disabled}
                                    onClick={() =>
                                        setCache({
                                            position: i,
                                            location: { ...e },
                                        })
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <LocalShippingIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={e.name}
                                        secondary={
                                            <ul>
                                                {[
                                                    [
                                                        e.adress,
                                                        e.zipCode,
                                                        e.city,
                                                    ],
                                                    [e.notifyEmail],
                                                    e.tags,
                                                ]
                                                    .map((l) =>
                                                        l
                                                            .map((s) =>
                                                                s?.trim()
                                                            )
                                                            .filter((s) => s)
                                                            .join(', ')
                                                    )
                                                    .filter((s) => s)
                                                    .map((s) => (
                                                        <li>{s}</li>
                                                    ))}
                                            </ul>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                )}
                {list.length === 0 && (
                    <Editorial phraseKey="ADMIN_PICKUPLOCATIONS_EMPTY" />
                )}
            </Box>
        </>
    )
}
