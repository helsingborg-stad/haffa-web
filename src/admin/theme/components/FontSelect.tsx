import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material'

import { FC, useState } from 'react'
import { isValidUrl } from 'lib/string-utils'
import { CreateMenuItems, RegularSelect } from './RegularSelect'

export interface FontProperties {
    src: string
    fontFamily: string
}

export const FontSelect: FC<{
    initialValue: FontProperties
    open: boolean
    onClose: () => void
    onUpdate: (value: FontProperties) => void
}> = ({ initialValue, open, onUpdate, onClose }) => {
    const [font, setFont] = useState<FontProperties>(initialValue)

    const isCustomFont = (): boolean => font.fontFamily === 'Extern'

    const isFontUrlVisible = (): string =>
        isCustomFont() ? 'visible' : 'hidden'

    const isFontUrlValid = (): boolean =>
        !isCustomFont() || isValidUrl(font.src)

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Välj typsnitt</DialogTitle>
            <DialogContent dividers>
                <RegularSelect
                    value={font.fontFamily}
                    onChange={({ target: { value } }) => {
                        setFont({
                            fontFamily: value,
                            src: value === 'Extern' ? font.src : '',
                        })
                    }}
                    sx={{
                        mb: 2,
                    }}
                >
                    {CreateMenuItems([
                        ['Roboto'],
                        ['Tahoma'],
                        ['Arial'],
                        ['Verdana'],
                        ['Extern'],
                    ])}
                </RegularSelect>
                <TextField
                    label="Url"
                    fullWidth
                    focused={isCustomFont()}
                    required={isCustomFont()}
                    error={!isFontUrlValid()}
                    value={font.src}
                    onChange={({ target: { value } }) =>
                        setFont({
                            ...font,
                            src: value,
                        })
                    }
                    sx={{
                        visibility: isFontUrlVisible(),
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={!isFontUrlValid()}
                    onClick={() => onUpdate(font)}
                >
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    )
}
