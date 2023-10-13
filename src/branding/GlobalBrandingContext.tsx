import { ThemeProvider, createTheme } from '@mui/material'
import useAsync from 'hooks/use-async'
import { FC, PropsWithChildren, useMemo } from 'react'
import type { Option } from './types'
import { createCustomTheme } from './theme-factory'

const BrandedView: FC<PropsWithChildren & { options: Option[] }> = ({
    children,
    options,
}) => {
    const theme = useMemo(
        () => createTheme(createCustomTheme(options), [options]),
        [options]
    )
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export const GlobalBrandingProvider: FC<PropsWithChildren> = ({ children }) => {
    const inspect = useAsync<any>(() =>
        fetch('/api/v1/haffa/branding', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .catch(() => [])
    )

    return inspect({
        pending: () => <div />,
        resolved: (options) => (
            <BrandedView options={options}>{children}</BrandedView>
        ),
        rejected: () => <BrandedView options={[]}>{children}</BrandedView>,
    })
}
