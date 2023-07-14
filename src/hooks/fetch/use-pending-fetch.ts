import { useContext, useEffect, useState } from 'react'
import { FetchContext } from './FetchContext'

export default function usePendingFetch(): boolean {
    const [pending, setPending] = useState(false)
    const { addPendingListener } = useContext(FetchContext)

    useEffect(() => {
        const unregister = addPendingListener(setPending)
        return unregister
    }, [addPendingListener, pending])
    return pending
}
