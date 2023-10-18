import { ThemeProvider, createTheme } from '@mui/material'
import useAsync from 'hooks/use-async'
import { FC, PropsWithChildren, useMemo } from 'react'
import type { Option } from '../options/types'
import { createCustomTheme } from './theme-factory'
import { BrandingOptions } from './types'

const BrandedView: FC<
    PropsWithChildren & { options: Option<BrandingOptions>[] }
> = ({ children, options }) => {
    const theme = useMemo(
        () => createTheme(createCustomTheme(options), [options]),
        [options]
    )
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export const BrandingProvider: FC<PropsWithChildren> = ({ children }) => {
    const inspect = useAsync<any>(() =>
        fetch('/api/v1/haffa/options/branding-theme', {
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
