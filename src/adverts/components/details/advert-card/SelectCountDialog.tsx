import {
    Button,
    ButtonProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
    Slider,
} from '@mui/material'
import { range } from 'lib/range'
import { FC, useMemo, useState } from 'react'

export type SelectCountButtonProps = ButtonProps & {
    minCount: number
    maxCount: number
    onSelectCount: (n: number) => void
}

const TICK_COUNT: number = 5

export const SelectCountDialog: FC<
    DialogProps & {
        open: boolean
        minCount: number
        maxCount: number
        renderConfirmButton: (n: number) => JSX.Element
        onSelectCount: (n: number) => void
        onClose: () => void
    }
> = (props) => {
    const {
        open,
        minCount,
        maxCount,
        renderConfirmButton,
        onSelectCount,
        onClose,
        ...dialogProps
    } = props
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
        <Dialog
            onClose={() => onClose()}
            open={open}
            fullWidth
            maxWidth="xs"
            {...dialogProps}
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
                <Button key="cancel" onClick={() => onClose()}>
                    Avbryt
                </Button>
                {renderConfirmButton(selectedCount)}
            </DialogActions>
        </Dialog>
    )
}
