import { createContext } from 'react'

export const TagDescriptionsContext = createContext<{
    tagDescriptionByTag: Record<string, string>
}>({
    tagDescriptionByTag: {},
})
