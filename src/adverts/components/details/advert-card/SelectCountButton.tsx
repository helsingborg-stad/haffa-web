import {
    Button,
    ButtonProps,
    Dialog,
    DialogActions,
    DialogContent,
    Slider,
} from '@mui/material'
import { range } from 'lib/range'
import { FC, useId, useMemo, useState } from 'react'

export type SelectCountButtonProps = ButtonProps & {
    minCount: number
    maxCount: number
    onSelectCount: (n: number) => void
}

const TICK_COUNT: number = 5

export const SelectCountButton: FC<SelectCountButtonProps> = (props) => {
    const { children, minCount, maxCount, onSelectCount, ...btnProps } = props
    const buttonId = useId()
    const dialogId = useId()
    const [open, setOpen] = useState(false)
    const [selectedCount, setSelectedCount] = useState(minCount)

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
                id={dialogId}
                onClose={() => setOpen(false)}
                open={open}
                fullWidth
                maxWidth="xs"
            >
                <DialogContent>
                    <Slider
                        sx={{ my: 6 }}
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
