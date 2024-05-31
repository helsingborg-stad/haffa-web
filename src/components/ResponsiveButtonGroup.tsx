import { useTheme } from '@mui/material/styles'
import { ButtonGroup, ButtonGroupProps, useMediaQuery } from '@mui/material'
import { FC } from 'react'

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
