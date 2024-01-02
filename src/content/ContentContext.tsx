import { PropsWithChildren, createContext } from 'react'
import { ContentRepository } from './types'

const notProvided = (method: string) => () => {
    throw new Error(`ContentContext::${method} is not provided`)
}

export const ContentContext = createContext<ContentRepository>({
    getComposition: notProvided('getComposition'),
    updateComposition: notProvided('updateComposition'),
})

export const ContentProvider = (
    props: PropsWithChildren<{ repository: ContentRepository }>
) => {
    const { children, repository } = props

    return (
        <ContentContext.Provider value={repository}>
            {children}
        </ContentContext.Provider>
    )
}
