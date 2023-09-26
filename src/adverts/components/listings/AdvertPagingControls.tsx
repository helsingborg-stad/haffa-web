import { Container, Button } from '@mui/material'
import { FC, useContext } from 'react'
import { PhraseContext } from '../../../phrases/PhraseContext'

export const AdvertPagingControls: FC<{
    onLoadMore: () => void
    nextCursor?: string | null
}> = ({ nextCursor, onLoadMore }) => {
    const { LIST_NO_MORE_ADVERTS } = useContext(PhraseContext)
    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
            }}
        >
            {nextCursor ? (
                <Button variant="text" onClick={onLoadMore}>
                    Ladda Fler
                </Button>
            ) : (
                <span>{LIST_NO_MORE_ADVERTS}</span>
            )}
        </Container>
    )
}
