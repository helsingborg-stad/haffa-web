import React, { FC, PropsWithChildren, useContext } from 'react'
import {
    Alert,
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
import useSomeFetchIsSlow from 'hooks/fetch/use-some-fetch-is-slow'
import { Navbar } from './Navbar'
import { PhraseContext } from '../phrases/PhraseContext'

interface LayoutProps {
    hideNavbar?: boolean
    renderAppbarControls?: () => React.JSX.Element | null
}

const SlowFetchWarning: FC = () => {
    const hasSlowFetch = useSomeFetchIsSlow()
    const { INFO_SLOW_CONNECTION } = useContext(PhraseContext)
    return hasSlowFetch ? (
        <Container key="sf">
            <Alert severity="warning">{INFO_SLOW_CONNECTION}</Alert>
        </Container>
    ) : null
}

export const DefaultRenderAppbarControls = (): React.JSX.Element => {
    const { CREATE_ADVERT } = useContext(PhraseContext)
    return (
        <Button color="inherit" component={NavLink} to="/advert/create">
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
            <AppBar key="ab">
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
                key="c"
                item
                xs={12}
                md={8}
                sx={{
                    pt: 10,
                }}
            >
                <SlowFetchWarning key="sf" />
                <Container key="c">{children}</Container>
            </Grid>
            {!hideNavbar && <Navbar key="nb" />}
        </Box>
    )
}
