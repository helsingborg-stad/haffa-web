import { createContext, FC, PropsWithChildren } from 'react'
import { TagsRepository } from './types'

const notProvided = (method: string) => () => {
    throw new Error(`TagsContext::${method} is not provided`)
}

export const TagsContext = createContext<TagsRepository>({
    getTagDescriptions: notProvided('getTagDescriptions'),
    updateTagDescriptions: notProvided('updateTagDescriptions'),
})

export const TagsProvider: FC<
    PropsWithChildren<{ repository: TagsRepository }>
> = ({ repository, children }) => (
    <TagsContext.Provider value={repository}>{children}</TagsContext.Provider>
)
