import { Func1 } from 'lib/types'
import { ReactNode } from 'react'

export interface BulkActionDialogParams {
    action: BulkAction
    open: boolean
    closeDialog: () => void
}

export interface BulkAction {
    key: string
    label: string
    enabled: () => boolean
    action: () => any
    icon?: ReactNode
    dialogAction?: Func1<BulkActionDialogParams, ReactNode>
}
