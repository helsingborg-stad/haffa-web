import { CssBaseline, ThemeProvider } from '@mui/material'
import useAsync from 'hooks/use-async'
import useLocalStorage from 'hooks/use-local-storage'
import { toMap } from 'lib/to-map'
import { PhraseContext } from 'phrases'
import { createPhraseContext } from 'phrases/create-phrase-context'
import { type FC, type PropsWithChildren, useMemo } from 'react'
import type { Option } from '../options/types'
import { AdvertImageSettingsContext } from './AdvertImageSettingsContext'
import { DarkModeContext } from './DarkModeContext'
import { createCustomTheme, createThemeModel } from './theme-factory'

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
    const [storedDarkMode, setStoredDarkMode] = useLocalStorage<boolean>(
        'haffa_dark_mode',
        false
    )
    const themeModel = useMemo(
        () => createThemeModel(themeOptions),
        [themeOptions]
    )
    const darkModeAllowed = themeModel['darkmode.enabled'] !== 'false'
    const darkMode = darkModeAllowed && storedDarkMode
    const theme = useMemo(
        () => createCustomTheme(themeModel, darkMode ? 'dark' : 'light'),
        [themeModel, darkMode]
    )

    const advertImageAspectRatio =
        parseAspectRatio(themeModel['advert.image.aspectRatio']) || 4 / 3

    return (
        <ThemeProvider theme={theme}>
            <DarkModeContext.Provider
                value={{
                    darkMode,
                    setDarkMode: setStoredDarkMode,
                    darkModeAllowed,
                }}
            >
                <PhraseContext.Provider
                    value={createPhraseContext(
                        toMap(
                            phraseOptions,
                            ({ key }) => key,
                            ({ value }) => value
                        )
                    )}
                >
                    <AdvertImageSettingsContext.Provider
                        value={{ advertImageAspectRatio }}
                    >
                        {children}
                    </AdvertImageSettingsContext.Provider>
                </PhraseContext.Provider>
            </DarkModeContext.Provider>
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
