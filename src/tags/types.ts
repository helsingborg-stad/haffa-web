export interface TagDescription {
    tag: string
    label: string
    description: string
}

export interface TagsRepository {
    getTagDescriptions: () => Promise<TagDescription[]>
    updateTagDescriptions: (
        descriptions: TagDescription[]
    ) => Promise<TagDescription[]>
}
