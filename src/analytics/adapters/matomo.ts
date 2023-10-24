export const MatomoAdapter = (config: string) => {
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle, no-multi-assign
    const _mtm = (window._mtm = window._mtm || [])
    _mtm.push({ 'mtm.startTime': new Date().getTime(), event: 'mtm.Start' })
    const d = document
    const g = d.createElement('script')
    const s = d.getElementsByTagName('script')[0]
    g.async = true
    g.src = config
    s.parentNode?.insertBefore(g, s)
}
