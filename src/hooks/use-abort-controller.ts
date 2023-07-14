import { useEffect, useState } from 'react'

export default function useAbortController(): AbortController {
    const [ac] = useState(new AbortController())
    useEffect(() => () => ac.abort(), [ac])
    return ac
}
