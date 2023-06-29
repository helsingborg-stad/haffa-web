import { FC, useContext, useMemo } from 'react'
import { Box, Button } from '@mui/material'
import jwtDecode from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../auth'
import { Layout } from '../layout'

export const ProfileRouteView: FC = () => {
    const { signout, token } = useContext(AuthContext)
    const navigate = useNavigate()
    const decoded = useMemo(() => jwtDecode(token), [token])
    return (
        <Layout>
            <Box>
                <pre>
                    <code>{JSON.stringify(decoded, null, 2)}</code>
                </pre>
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={() => {
                        navigate('/')
                        signout()
                    }}
                >
                    Logga ut
                </Button>
            </Box>
        </Layout>
    )
}
