import { useContext, useEffect, useState } from 'react'
import { FetchContext } from './FetchContext'

export default function useSomeFetchIsSlow(): boolean {
    const [slow, setSlow] = useState(false)
    const { addListener } = useContext(FetchContext)

    useEffect(() => {
        const unregister = addListener(setSlow)
        return unregister
    }, [addListener])
    return slow
}
