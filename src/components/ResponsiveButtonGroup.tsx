import {
    ButtonGroup,
    type ButtonGroupProps,
    useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { FC } from 'react'

export const ResponsiveButtonGroup: FC<ButtonGroupProps> = ({
    children,
    ...props
}) => {
    const theme = useTheme()
    const horizontalGroup = useMediaQuery(theme.breakpoints.up('md'))
    return (
        <ButtonGroup
            {...props}
            orientation={horizontalGroup ? 'horizontal' : 'vertical'}
            fullWidth
        >
            {children}
        </ButtonGroup>
    )
}
