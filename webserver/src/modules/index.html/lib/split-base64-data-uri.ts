export const splitBase64DataUri = (
    dataUri: string
): {
    mimeType: string
    buffer: Buffer
} | null => {
    const [, mimeType = null, content = null] =
        /^data:([^;]*);base64,(.+$)$/m.exec(dataUri || '') || []

    return mimeType && content
        ? {
              mimeType,
              buffer: Buffer.from(content, 'base64'),
          }
        : null
}
