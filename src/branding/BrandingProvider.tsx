import { ThemeProvider, createTheme } from '@mui/material'
import useAsync from 'hooks/use-async'
import { PhraseContext } from 'phrases/PhraseContext'
import { createPhraseContext } from 'phrases/create-phrase-context'
import { FC, PropsWithChildren, useMemo } from 'react'

const BrandedView: FC<PropsWithChildren & { branding: any }> = ({
    children,
    branding,
}) => {
    const theme = useMemo(
        () =>
            createTheme(
                branding?.theme || {
                    palette: {
                        primary: {
                            main: 'rgb(80, 129, 27)',
                        },
                        secondary: {
                            main: 'rgb(225, 233, 219)',
                        },
                    },
                }
            ),
        [branding]
    )
    const overridingPhrases = Object.fromEntries(
        Object.entries(branding?.phrases || {}).filter(
            ([_, value]) => typeof value === 'string'
        )
    ) as Record<string, string>
    return (
        <ThemeProvider theme={theme}>
            <PhraseContext.Provider
                value={createPhraseContext(overridingPhrases)}
            >
                {children}
            </PhraseContext.Provider>
        </ThemeProvider>
    )
}

export const BrandingProvider: FC<PropsWithChildren> = ({ children }) => {
    const inspect = useAsync<any>(() =>
        fetch('/branding.json')
            .then((response) => response.json())
            .catch(() => ({}))
    )

    return inspect({
        pending: () => <div />,
        resolved: (branding) => (
            <BrandedView branding={branding}>{children}</BrandedView>
        ),
        rejected: () => <BrandedView branding={{}}>{children}</BrandedView>,
    })
}
