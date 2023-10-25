import {
    Button,
    CardActions,
    CardContent,
    Grid,
    Typography,
} from '@mui/material'
import { FC, useCallback, useContext, useState } from 'react'
import { Editorial } from 'editorials'
import { SwatchesPicker } from 'react-color'
import SaveIcon from '@mui/icons-material/Save'

import { PhraseContext } from 'phrases'

import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import { getOption } from 'options'
import {
    defaultThemeColors,
    normalizeThemeColors,
} from 'branding/theme-factory'
import { BrandingOptions } from 'branding/types'
import { Card } from 'antd'
import type { Option } from '../../../options/types'

const NS = 'THEME'

function ColorIcon(props: SvgIconProps) {
    return (
        <SvgIcon {...props}>
            <ellipse cx="12" cy="12" rx="12" ry="12" />
        </SvgIcon>
    )
}

export const EditThemeForm: FC<{
    options: Option<BrandingOptions>[]
    onUpdate: (options: Option<BrandingOptions>[]) => void
}> = ({ options, onUpdate }) => {
    const { phrase } = useContext(PhraseContext)

    const colors = normalizeThemeColors(options)

    interface Model {
        key: BrandingOptions
        id: string
        label: string
        color?: string
        isOpen: boolean
    }
    const [hasChanged, setHasChanged] = useState<boolean>(false)

    const [model, setModel] = useState<Model[]>([
        {
            key: 'primary',
            id: `${NS}_FIELD_PRIMARY_COLOR`,
            label: 'Primär färg',
            color: getOption('primary', colors),
            isOpen: false,
        },
        {
            key: 'secondary',
            id: `${NS}_FIELD_SECONDARY_COLOR`,
            label: 'Sekundär färg',
            color: getOption('secondary', colors),
            isOpen: false,
        },
        {
            key: 'info',
            id: `${NS}_FIELD_INFO_COLOR`,
            label: 'Information',
            color: getOption('info', colors),
            isOpen: false,
        },
        {
            key: 'warning',
            id: `${NS}_FIELD_WARNING_COLOR`,
            label: 'Varning',
            color: getOption('warning', colors),
            isOpen: false,
        },
        {
            key: 'error',
            id: `${NS}_FIELD_ERROR_COLOR`,
            label: 'Fel',
            color: getOption('error', colors),
            isOpen: false,
        },
        {
            key: 'success',
            id: `${NS}_FIELD_SUCCESS_COLOR`,
            label: 'Genomfört',
            color: getOption('success', colors),
            isOpen: false,
        },
    ])

    const resetOptions = useCallback(() => {
        setModel(
            model.map((item) => ({
                ...item,
                color: getOption(item.key, defaultThemeColors),
                isOpen: false,
            }))
        )
        setHasChanged(true)
    }, [model, setModel, hasChanged])

    const mutateItem = useCallback(
        (index: number, patch: Partial<Model>) => {
            setModel([
                ...model.slice(0, index),
                {
                    ...model[index],
                    ...patch,
                },
                ...model.slice(index + 1),
            ])
            setHasChanged(true)
        },
        [model, setModel]
    )

    const createOptions = () =>
        model.map(({ key, color: value = '#000' }) => ({
            key,
            value,
        }))

    return (
        <Card>
            <Editorial>
                {phrase(`${NS}_SECTION_EDITORIAL`, 'Definitioner för tema')}
            </Editorial>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {phrase(`${NS}_SECTION_COLORS`, 'Färger')}
                </Typography>
                <Grid container direction="row" sx={{ paddingBottom: 5 }}>
                    {model.map((item, i) => (
                        <Grid key={item.key} item xs={12} sm={4} sx={{ p: 1 }}>
                            <Button
                                fullWidth
                                id={item.id}
                                variant="outlined"
                                startIcon={
                                    <ColorIcon sx={{ color: item.color }} />
                                }
                                onClick={() =>
                                    mutateItem(i, {
                                        isOpen: !item.isOpen,
                                    })
                                }
                            >
                                {phrase(item.id, item.label)}
                            </Button>
                            {item.isOpen ? (
                                <SwatchesPicker
                                    color={item.color}
                                    onChangeComplete={(color) => {
                                        mutateItem(i, {
                                            color: color.hex,
                                            isOpen: false,
                                        })
                                        setHasChanged(true)
                                    }}
                                />
                            ) : (
                                ''
                            )}
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
            <CardActions>
                <Button
                    type="submit"
                    disabled={hasChanged !== true}
                    id={`${NS}_ACTION_SAVE`}
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() => onUpdate(createOptions())}
                >
                    {phrase(`${NS}_ACTION_SAVE`, 'Spara')}
                </Button>
                <Button onClick={() => resetOptions()} id={`${NS}RESTORE`}>
                    {phrase(`${NS}_ACTION_RESTORE`, 'Återställ')}
                </Button>
            </CardActions>
        </Card>
    )
}
