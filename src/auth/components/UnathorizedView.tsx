import { Alert, Button, Card, CardActions, CardContent } from '@mui/material'
import { AuthContext } from 'auth'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useContext } from 'react'

export const UnauthorizedView: FC = () => {
    const { signout } = useContext(AuthContext)
    const { ERROR_UNAUTHORIZED, SIGNOUT } = useContext(PhraseContext)

    return (
        <Card sx={{ p: 2 }}>
            <CardContent>
                <Alert severity="error">{ERROR_UNAUTHORIZED}</Alert>
            </CardContent>
            <CardActions>
                <Button
                    variant="outlined"
                    sx={{ ml: 'auto' }}
                    onClick={() => signout()}
                >
                    {SIGNOUT}
                </Button>
            </CardActions>
        </Card>
    )
}
