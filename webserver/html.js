const { readFile } = require('fs/promises')
const { join } = require('path')
const handlebars = require('handlebars')
const { createMemoryCache } = require('./cache')

const backendUrl = `${process.env.HAFFA_BACKEND_URL}/api/v1/haffa/options/branding-html`

// Page cache
const page = createMemoryCache()

// Template handling
const readTemplate = async () =>
    await readFile(join(process.cwd(), '/build/index.html'), {
        encoding: 'utf8',
    }).catch(() => '<html />')

const compileTemplate = async (content, data) =>
    handlebars.compile(content)(data)

const transformHtmlOptions = (options) =>
    options.reduce(
        (p, c) => ({
            ...p,
            [c.key]: c.value,
        }),
        {
            title: 'Haffa',
            description: 'Haffa - appen för återbruk',
            image: '/logo512.png',
            url: 'https://haffa.helsingborg.se',
            favicon: '/favicon.ico',
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

// Converts a datastring to binary object
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
exports.getIndexHtml = async () => {
    if (!page.isValid()) {
        const file = await readTemplate()
        await fetchHtmlOptions()
            .then((options) => transformHtmlOptions(options))
            .then((data) =>
                compileTemplate(file, data).then((html) => {
                    page.set({
                        html,
                        data,
                    })
                })
            )
    }
    return page.get()
}

exports.sendBinaryImage = async (ctx, next) => {
    const cache = await this.getIndexHtml()
    if (/data:image/.test(cache.data.image)) {
        const [type, buffer] = await convertBase64toBinary(cache.data.image)
        ctx.set('Content-Type', type)
        ctx.body = buffer
    } else {
        return next()
    }
}
