import { useEffect } from 'react'

export default function useTimeout(
    ms: number,
    callback: () => any,
    deps?: React.DependencyList
) {
    useEffect(() => {
        const timer = setTimeout(callback, ms)
        return () => clearTimeout(timer)
    }, deps)
}
