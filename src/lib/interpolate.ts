export const interpolate = (
    template: string,
    replacements: Record<string, string | number>
): string =>
    (template || '').replace(/{([^{}]*)}/g, (m, name) =>
        name in replacements ? replacements[name].toString() : m
    )
