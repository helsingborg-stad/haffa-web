export const isValidUrl = (urlString: string) => {
    try {
        return /^(http|https):$/.test(new URL(urlString).protocol)
    } catch (e) {
        return false
    }
}

export const isString = (value: any) =>
    typeof value === 'string' && value !== ''
