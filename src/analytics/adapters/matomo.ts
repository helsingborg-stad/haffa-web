export const MatomoAdapter = (config: string) => {
    // @ts-expect-error
    // biome-ignore lint/suspicious/noAssignInExpressions: Matomo initialization pattern
    const _mtm = (window._mtm = window._mtm || [])
    _mtm.push({ 'mtm.startTime': Date.now(), event: 'mtm.Start' })
    const d = document
    const g = d.createElement('script')
    const s = d.getElementsByTagName('script')[0]
    g.async = true
    g.src = config
    s.parentNode?.insertBefore(g, s)
}
