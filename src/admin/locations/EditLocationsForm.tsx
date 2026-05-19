import AddIcon from '@mui/icons-material/Add'
import Delete from '@mui/icons-material/Delete'
import PlaceIcon from '@mui/icons-material/Place'
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
import type { AdvertLocation } from 'adverts'
import { AdminActionPanel } from 'components/AdminActionPanel'
import { AdminEditorialPanel } from 'components/AdminEditorialPanel'
import { Editorial } from 'editorials'
import { createEmptyLocation } from 'locations'
import type { LocationRepository } from 'locations/types'
import { useCallback, useState } from 'react'
import { LocationEditor } from './LocationEditor'

export interface LocationWithIndex {
    position: number
    module: AdvertLocation
}
export const EditLocationsForm = (props: {
    locations: AdvertLocation[]
    onUpdate: LocationRepository['updateLocations']
}) => {
    const { locations, onUpdate } = props

    const [list, setList] = useState<AdvertLocation[]>(locations)
    const [cache, setCache] = useState<LocationWithIndex | undefined>()
    const [disabled, setDisabled] = useState(false)

    const saveLocations = useCallback(() => {
        setDisabled(true)
        onUpdate(list).then((result) => {
            setDisabled(false)
            setList(result)
        })
    }, [list, onUpdate])

    const cacheUpdate = useCallback(
        (module: AdvertLocation) => {
            cache
                ? setCache({
                      ...cache,
                      module,
                  })
                : undefined
        },
        [cache]
    )

    const applyFromCache = useCallback(() => {
        if (cache) {
            if (cache.position === -1) {
                setList([cache.module, ...list])
            } else {
                const copy = [...list]
                copy[cache.position] = { ...cache.module }
                setList(copy)
            }
            setCache(undefined)
        }
    }, [cache, list])

    const deleteRow = (index: number) =>
        setList([...list.slice(0, index), ...list.slice(index + 1)])

    return (
        <>
            <AdminEditorialPanel
                headline="ADMIN_LOCATIONS_HEADLINE"
                body="ADMIN_LOCATIONS_BODY"
            />
            <AdminActionPanel onSave={saveLocations} disabled={disabled}>
                <Button
                    startIcon={<AddIcon />}
                    disabled={disabled}
                    onClick={() =>
                        setCache({
                            position: -1,
                            module: createEmptyLocation(),
                        })
                    }
                >
                    Ny Adress
                </Button>
            </AdminActionPanel>
            <Box
                sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                }}
            >
                {cache && (
                    <LocationEditor
                        onUpdate={(e) => cacheUpdate(e)}
                        onClose={() => setCache(undefined)}
                        onApply={applyFromCache}
                        module={cache.module}
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
                                            module: { ...e },
                                        })
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar>
                                            <PlaceIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={e.name}
                                        secondary={`${e.adress}, ${e.zipCode} ${e.city}`}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                )}
                {list.length === 0 && (
                    <Editorial phraseKey="ADMIN_LOCATIONS_EMPTY" />
                )}
            </Box>
        </>
    )
}
