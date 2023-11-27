import { CssBaseline, ThemeProvider } from '@mui/material'
import useAsync from 'hooks/use-async'
import { FC, PropsWithChildren, useMemo } from 'react'
import { PhraseContext } from 'phrases'
import { createPhraseContext } from 'phrases/create-phrase-context'
import { toMap } from 'lib/to-map'
import type { Option } from '../options/types'
import { createCustomTheme, createThemeModel } from './theme-factory'
import { BrandingContext } from './BrandingContext'

const parseAspectRatio = (ar: string): number | null => {
    const [w, h] = ar.split(':').map((v) => parseInt(v, 10))
    if (w > 0 && h > 0) {
        return w / h
    }
    return null
}

const BrandedView: FC<
    PropsWithChildren & {
        themeOptions: Option[]
        phraseOptions: Option[]
    }
> = ({ children, themeOptions, phraseOptions }) => {
    const themeModel = useMemo(
        () => createThemeModel(themeOptions),
        [themeOptions]
    )
    const theme = useMemo(() => createCustomTheme(themeModel), [themeModel])

    const advertImageAspectRatio =
        parseAspectRatio(themeModel['advert.image.aspectRatio']) || 4 / 3

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
                <BrandingContext.Provider value={{ advertImageAspectRatio }}>
                    {children}
                </BrandingContext.Provider>
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
                <CssBaseline />
                {children}
            </BrandedView>
        ),
        rejected: () => (
            <BrandedView themeOptions={[]} phraseOptions={[]}>
                <CssBaseline />
                {children}
            </BrandedView>
        ),
    })
}
