import {
    Button,
    ButtonProps,
    Dialog,
    DialogActions,
    DialogContent,
    Slider,
} from '@mui/material'
import { FC, useId, useMemo, useState } from 'react'

export type SelectCountButtonProps = ButtonProps & {
    minCount: number
    maxCount: number
    onSelectCount: (n: number) => void
}

export const SelectCountButton: FC<SelectCountButtonProps> = (props) => {
    const { children, minCount, maxCount, onSelectCount, ...btnProps } = props
    const buttonId = useId()
    const dialogId = useId()
    const [open, setOpen] = useState(false)
    const [selectedCount, setSelectedCount] = useState(minCount)

    const marks = useMemo(
        () => [
            { value: minCount, label: minCount.toString() },
            { value: maxCount, label: maxCount.toString() },
        ],
        [minCount, maxCount]
    )
    return (
        <>
            <Button
                id={buttonId}
                aria-controls={open ? dialogId : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                {...btnProps}
                onClick={() =>
                    minCount < maxCount
                        ? setOpen(true)
                        : onSelectCount(minCount)
                }
            >
                {children}
            </Button>
            <Dialog
                onClose={() => setOpen(false)}
                open={open}
                fullWidth
                maxWidth="xs"
            >
                <DialogContent>
                    <Slider
                        sx={{ my: 4 }}
                        aria-label="Always visible"
                        defaultValue={minCount}
                        getAriaValueText={(n) => n.toString()}
                        valueLabelDisplay="on"
                        step={1}
                        min={minCount}
                        max={maxCount}
                        marks={marks}
                        value={selectedCount}
                        onChange={(_, n) =>
                            setSelectedCount(Array.isArray(n) ? n[0] : n)
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Avbryt</Button>
                    <Button
                        onClick={() => onSelectCount(selectedCount)}
                        {...{
                            ...btnProps,
                            fullWidth: false,
                            variant: 'contained',
                        }}
                    >
                        {children}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
