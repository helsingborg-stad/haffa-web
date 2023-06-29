import React, { FC, PropsWithChildren, useContext } from 'react'
import {
    AppBar,
    Box,
    Button,
    Container,
    Grid,
    Toolbar,
    Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { NavLink } from 'react-router-dom'
import { Navbar } from './Navbar'
import { PhraseContext } from '../phrases/PhraseContext'

interface LayoutProps {
    hideNavbar?: boolean
    renderAppbarControls?: () => React.JSX.Element | null
}

export const DefaultRenderAppbarControls = (): React.JSX.Element => {
    const { CREATE_ADVERT } = useContext(PhraseContext)
    return (
        <Button color="inherit" component={NavLink} to="/new-advert">
            <AddIcon />
            {CREATE_ADVERT}
        </Button>
    )
}

export const Layout: FC<LayoutProps & PropsWithChildren> = ({
    hideNavbar,
    renderAppbarControls = DefaultRenderAppbarControls,
    children,
}) => {
    const { APP_TITLE } = useContext(PhraseContext)
    return (
        <Box sx={{ pb: 7 }}>
            <AppBar>
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        {APP_TITLE}
                    </Typography>
                    {renderAppbarControls?.()}
                </Toolbar>
            </AppBar>
            <Grid
                item
                xs={12}
                md={8}
                sx={{
                    pt: 10,
                }}
            >
                <Container>{children}</Container>
            </Grid>
            {!hideNavbar && <Navbar />}
        </Box>
    )
}
