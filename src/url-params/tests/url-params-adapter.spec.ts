import { createUrlParamsAdapter } from 'url-params'

describe('createUrlParamsAdapter', () => {
    interface TestContext {
        hash: string
    }
    const createTestAdapter = (ctx: TestContext) =>
        createUrlParamsAdapter({
            getUrlParams: () => ctx.hash,
            setUrlParams: (p) => {
                ctx.hash = p
            },
        })

    it('parseUrlParams() can parse search params ', () => {
        const a = createTestAdapter({ hash: 'a=ABC&b=BCD' })
        expect(a.parseUrlParams('')).toMatchObject({
            a: 'ABC',
            b: 'BCD',
        })
    })
    it('parseUrlParams(prefix) can parse search params ', () => {
        const a = createTestAdapter({ hash: 'PREFIXa=ABC&PREFIXb=BCD' })
        expect(a.parseUrlParams('PREFIX')).toMatchObject({
            a: 'ABC',
            b: 'BCD',
        })
    })

    it('patchUrlParams() only touches affected', () => {
        const a = createTestAdapter({ hash: 'a=ABC&b=BCD&c=gizmo' })
        a.updateLocationWithUrlParams('', { c: 'CDE' })
        expect(a.parseUrlParams('')).toMatchObject({
            a: 'ABC',
            b: 'BCD',
            c: 'CDE',
        })
    })
    it('patchUrlParams() removed empty entries', () => {
        const a = createTestAdapter({ hash: 'a=ABC&b=BCD&c=gizmo' })
        a.updateLocationWithUrlParams('', { b: 0, c: '' })
        expect(a.parseUrlParams('')).toMatchObject({
            a: 'ABC',
        })
        expect(Object.keys(a.parseUrlParams(''))).toMatchObject(['a'])
    })
})
