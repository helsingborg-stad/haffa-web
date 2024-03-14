export const isValidUrl = (urlString: string) => {
    try {
        return /^(http|https):$/.test(new URL(urlString).protocol)
    } catch (e) {
        return false
    }
}

export const isValidString = (value: any): boolean =>
    typeof value === 'string' && value.length > 0

export const isValidStringOr = (value: any, fallback: string): string =>
    isValidString(value) ? value : fallback
