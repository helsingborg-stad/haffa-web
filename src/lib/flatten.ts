export const flatten = <T>(aoa: T[][]) => aoa.reduce((f, l) => f.concat(l), [])
