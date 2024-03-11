export interface HtmlOptions {
    title: string
    description: string
    imageUrl: string
    url: string
    imageLogo192: string
    imageLogo512: string
    imageFavicon: string

    preview?: HtmlPreviewOptions
}

export interface HtmlPreviewOptions {
    title: string
    description: string
    imageUrl: string
}
