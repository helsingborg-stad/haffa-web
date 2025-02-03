import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    DialogTitle,
    List,
    ListItem,
    ListItemIcon,
    ListSubheader,
    Slider,
    Stack,
} from '@mui/material'
import { range } from 'lib/range'
import { Func1 } from 'lib/types'
import { PickupLocation } from 'pickup-locations/types'
import { FC, useEffect, useMemo, useState } from 'react'
import StoreIcon from '@mui/icons-material/Store'

const TICK_COUNT: number = 5

export const canShowClaimDialog: Func1<
    {
        minCount: number
        maxCount: number
        pickupLocations: PickupLocation[]
    },
    boolean
> = ({ minCount, maxCount, pickupLocations }) =>
    pickupLocations.length > 0 || minCount < maxCount

export const ClaimDialog: FC<
    DialogProps & {
        title: string
        open: boolean
        count?: number
        minCount: number
        maxCount: number
        pickupLocations: PickupLocation[]
        renderConfirmButton: (
            n: number,
            pickupLocation?: PickupLocation
        ) => JSX.Element
        onClose: () => void
    }
> = (props) => {
    const {
        title,
        open,
        count,
        minCount,
        maxCount,
        pickupLocations,
        renderConfirmButton,
        onClose,
        ...dialogProps
    } = props

    const [selectedCount, setSelectedCount] = useState(
        Math.min(Math.max(count || 0, minCount), maxCount)
    )

    const [selectedPickupLocation, setSelectedPickupLocation] = useState<
        PickupLocation | undefined
    >()

    useEffect(() => {
        // force a valid selection
        !selectedPickupLocation ||
        !pickupLocations.includes(selectedPickupLocation)
            ? setSelectedPickupLocation(pickupLocations[0])
            : undefined
    }, [pickupLocations, selectedPickupLocation, setSelectedPickupLocation])

    const marks = useMemo(() => {
        const indices = range(minCount, maxCount)
        if (indices.length <= TICK_COUNT) {
            return indices.map((value) => ({ value, label: value.toString() }))
        }

        const setMark = (
            count: number,
            min: number,
            max: number,
            mark: (n: number) => void
        ) => {
            if (count > 0.5 && min < max) {
                const mid = Math.floor(min + (max - min) / 2)
                mark(mid)
                setMark((count - 1) / 2, min, mid - 1, mark)
                setMark(count - 1 - (count - 1) / 2, mid + 1, max, mark)
            }
        }
        const s = new Set<number>([minCount, maxCount])
        setMark(TICK_COUNT - 2, minCount + 1, maxCount - 1, (n) => s.add(n))
        return indices.map((value) => ({
            value,
            label: s.has(value) ? value.toString() : undefined,
        }))
    }, [minCount, maxCount])

    const showPickupLocations = pickupLocations.length > 0
    const showAmount = maxCount > minCount
    return (
        <Dialog
            onClose={() => onClose()}
            open={open}
            fullWidth
            maxWidth="xs"
            {...dialogProps}
        >
            <DialogTitle>{title}</DialogTitle>
            {showPickupLocations && (
                <DialogContent>
                    <List
                        subheader={
                            <ListSubheader>Välj utlämningsställe</ListSubheader>
                        }
                    >
                        {pickupLocations.map((l, index) => (
                            <ListItem
                                key={index}
                                secondaryAction={
                                    <Checkbox
                                        edge="end"
                                        onChange={() =>
                                            setSelectedPickupLocation(l)
                                        }
                                        checked={selectedPickupLocation === l}
                                    />
                                }
                                onClick={() => setSelectedPickupLocation(l)}
                            >
                                <ListItemIcon>
                                    <StoreIcon />
                                </ListItemIcon>
                                <Stack direction="column">
                                    {[l.name, l.adress, l.zipCode, l.city]
                                        .filter((v) => v)
                                        .map((s, i) => (
                                            <div key={i}>{s}</div>
                                        ))}
                                </Stack>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            )}
            {showAmount && (
                <DialogContent>
                    <List subheader={<ListSubheader>Välj antal</ListSubheader>}>
                        <ListItem>
                            <Slider
                                sx={{ my: 3, mx: 1 }}
                                aria-label="Always visible"
                                defaultValue={minCount}
                                getAriaValueText={(n) => n.toString()}
                                valueLabelDisplay="on"
                                step={1}
                                marks={marks}
                                min={minCount}
                                max={maxCount}
                                value={selectedCount}
                                onChange={(_, n) =>
                                    setSelectedCount(
                                        Array.isArray(n) ? n[0] : n
                                    )
                                }
                            />
                        </ListItem>
                    </List>
                </DialogContent>
            )}
            <DialogActions>
                <Button key="cancel" onClick={() => onClose()}>
                    Avbryt
                </Button>
                {renderConfirmButton(selectedCount, selectedPickupLocation)}
            </DialogActions>
        </Dialog>
    )
}
