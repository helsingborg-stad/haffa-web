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

const compileTemplate = (content, data) => ({
    html: handlebars.compile(content)(data),
    data,
})

const transformHtmlOptions = (options) => {
    const defaultOptions = {
        title: 'Haffa',
        description: 'Haffa - appen för återbruk',
        image: '/logo512.png',
        url: 'https://haffa.helsingborg.se',
        favicon: '/favicon.ico',
    }
    return options.reduce(
        (p, c) => ({
            ...p,
            [c.key]: c.value,
        }),
        defaultOptions
    )
}

// Data handling
const getHtmlOptions = async () =>
    (await fetch(backendUrl, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
        },
    })
        .then((response) => response.json())
        .catch(() => null)) ?? []

// Exports
exports.getIndexHtml = async () => {
    if (!page.isValid()) {
        const file = await readTemplate()
        await getHtmlOptions()
            .then((options) => transformHtmlOptions(options))
            .then((data) => compileTemplate(file, data))
            .then((content) => {
                page.set(content)
            })
    }
    return page.get()
}

exports.sendBinaryImage = async (ctx, next) => {
    const cache = await this.getIndexHtml()
    if (/data:image/.test(cache.data.image)) {
        await fetch(cache.data.image).then(async (response) =>
            response.blob().then(async (blob) => {
                ctx.set('Content-Type', blob.type)
                ctx.body = Buffer.from(await blob.arrayBuffer())
            })
        )
    } else {
        return next()
    }
}
