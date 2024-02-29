const handlebars = require('handlebars')
const { createMemoryCache } = require('./cache')

const PATTERN_BASE64 = /data:image/
const backendUrl = `${process.env.HAFFA_BACKEND_URL}/api/v1/haffa/options/branding-html`

// Page cache
const page = createMemoryCache()

// Template handling
const compileTemplate = async (content, data = {}) =>
    handlebars.compile(content)(data)

const transformHtmlOptions = (options) =>
    options.reduce(
        (p, c) => ({
            ...p,
            [c.key]: c.value,
        }),
        {
            // Default value
            title: 'Haffa',
            description: 'Haffa - appen för återbruk',
            url: 'https://haffa.helsingborg.se',
            imageLogo192: '/image-logo192.png',
            imageLogo512: '/image-logo512.png',
            imageFavicon: '/image-favicon.png',
        }
    )

// Data handling
const fetchHtmlOptions = async () =>
    fetch(backendUrl, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
        },
    })
        .then((response) => response.json())
        .catch(() => [])

// Converts a datastring to a binary object
const convertBase64toBinary = async (base64) =>
    fetch(base64).then(async (response) =>
        response.blob().then((blob) =>
            blob
                .arrayBuffer()
                .then((data) => Buffer.from(data))
                .then((buffer) => [blob.type, buffer])
        )
    )

// Exports
exports.generateHtml = async (source) => {
    if (!page.isValid()) {
        await fetchHtmlOptions()
            .then((options) => transformHtmlOptions(options))
            .then((data) =>
                compileTemplate(source, data).then((html) => {
                    page.set({
                        html,
                        data,
                    })
                })
            )
    }
    return page.get()
}

exports.fetchBinaryImage = async (ctx, [, match], next) => {
    const cache = await this.generateHtml(ctx.htmlSource)

    let image
    // Get cached image data
    switch (match) {
        case 'image-favicon':
            image = cache.data.imageFavicon
            break
        case 'image-logo192':
            image = cache.data.imageLogo192
            break
        case 'image-logo512':
            image = cache.data.imageLogo512
            break
    }
    // Image cached as base64 string
    if (PATTERN_BASE64.test(image)) {
        const [type, buffer] = await convertBase64toBinary(image)

        ctx.set('Content-Type', type)
        ctx.body = buffer
        return
    }
    // Image cached as relative url (Try load image from filesystem)
    return next()
}
