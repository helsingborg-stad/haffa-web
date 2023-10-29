import { ThemeProvider, createTheme } from '@mui/material'
import useAsync from 'hooks/use-async'
import { FC, PropsWithChildren, useMemo } from 'react'
import { PhraseContext } from 'phrases'
import { createPhraseContext } from 'phrases/create-phrase-context'
import { toMap } from 'lib/to-map'
import type { Option } from '../options/types'
import { createCustomTheme, createThemeModel } from './theme-factory'
import { BrandingOptions } from './types'

const BrandedView: FC<
    PropsWithChildren & {
        themeOptions: Option<BrandingOptions>[]
        phraseOptions: Option[]
    }
> = ({ children, themeOptions, phraseOptions }) => {
    const theme = useMemo(
        () => createTheme(createCustomTheme(createThemeModel(themeOptions))),
        [themeOptions]
    )

    return (
        <ThemeProvider theme={theme}>
            <PhraseContext.Provider
                value={createPhraseContext(
                    toMap(
                        phraseOptions,
                        ({ key }) => key,
                        ({ value }) => value
                    )
                )}
            >
                {children}
            </PhraseContext.Provider>
        </ThemeProvider>
    )
}

export const BrandingProvider: FC<PropsWithChildren> = ({ children }) => {
    const fetchOptions = (name: string) =>
        fetch(`/api/v1/haffa/options/${name}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .catch(() => [])

    const inspect = useAsync(() =>
        Promise.all([
            fetchOptions('branding-theme'),
            fetchOptions('branding-phrases'),
        ])
    )

    return inspect({
        pending: () => <div />,
        resolved: ([theme, phrases]) => (
            <BrandedView themeOptions={theme} phraseOptions={phrases}>
                {children}
            </BrandedView>
        ),
        rejected: () => (
            <BrandedView themeOptions={[]} phraseOptions={[]}>
                {children}
            </BrandedView>
        ),
    })
}
