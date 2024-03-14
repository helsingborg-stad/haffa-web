export const isValidUrl = (urlString: string) => {
    try {
        return /^(http|https):$/.test(new URL(urlString).protocol)
    } catch (e) {
        return false
    }
}

export const isValidString = (value: any): boolean =>
    typeof value === 'string' && value.trim().length > 0

export const isValidStringOr = (value: any, fallback: string): string =>
    isValidString(value) ? value : fallback

export const isValidColor = (value: any): boolean =>
    isValidString(value) && /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(value)

export const isValidColorOr = (value: any, fallback: string): boolean =>
    isValidColor(value) ? value : fallback
