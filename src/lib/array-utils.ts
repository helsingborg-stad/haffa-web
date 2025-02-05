export const swapArrayItems = <T>(
    list: T[],
    index1: number,
    index2: number
): T[] => {
    const l = [...list]
    const e = l[index1]
    l[index1] = l[index2]
    l[index2] = e
    return l
}
