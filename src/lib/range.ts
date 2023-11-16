export const range = (min: number, max: number): number[] =>
    max >= min ? [...Array(max - min + 1).keys()].map((i) => min + i) : []
