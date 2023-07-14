import { useContext, useEffect, useState } from 'react'
import { FetchContext } from './FetchContext'

export default function useSomeFetchIsSlow(): boolean {
    const [slow, setSlow] = useState(false)
    const { addSlowListener } = useContext(FetchContext)

    useEffect(() => {
        const unregister = addSlowListener(setSlow)
        return unregister
    }, [addSlowListener, slow])
    return slow
}
