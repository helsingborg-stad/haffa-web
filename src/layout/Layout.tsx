import React, {
    FC,
    PropsWithChildren,
    ReactNode,
    useContext,
    useMemo,
    useState,
} from 'react'
import {
    AppBar,
    Box,
    Button,
    ButtonProps,
    Container,
    Divider,
    Drawer,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Toolbar,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { NavLink } from 'react-router-dom'
import { AdminButton } from 'admin'
import MenuIcon from '@mui/icons-material/Menu'
import { AuthContext } from 'auth'
import { QrCodeNavButton } from 'qr-code-navigation'
import { PhraseContext } from '../phrases/PhraseContext'
import { HaffaLink, createNavLinks } from './nav-links'
import { SlowFetchWarning } from './SlowFetchWarning'
import { NotificationsSnackbar } from './NotificationSnackbar'

/*
const PendingIndicator: FC = () => {
    const pending = usePendingFetch()
    const [visible, setVisible] = useState(false)
    useTimeout(1000, () => setVisible(pending), [pending, setVisible])
    return visible && pending ? <LinearProgress color="primary" /> : null
}
*/

export const DefaultRenderAppbarControls = (): React.JSX.Element => {
    const { ADVERT_CREATE: CREATE_ADVERT } = useContext(PhraseContext)
    const {
        roles: { canEditOwnAdverts },
    } = useContext(AuthContext)
    return (
        <>
            {canEditOwnAdverts && (
                <Button
                    color="inherit"
                    component={NavLink}
                    to="/advert/create"
                    startIcon={<AddIcon />}
                >
                    {CREATE_ADVERT}
                </Button>
            )}
            <QrCodeNavButton />
            <AdminButton />
        </>
    )
}

const NavIconLink: FC<{
    label: string
    icon: ReactNode
    button: ButtonProps
}> = ({ label, icon, button }) => (
    <Button
        color="inherit"
        sx={{ fontSize: { xs: 'xx-small', sm: '' } }}
        {...button}
    >
        <Stack direction="column" sx={{ alignItems: 'center' }}>
            {icon}
            <Box>{label}</Box>
        </Stack>
    </Button>
)

const insideToolbarLinkFactory: Record<
    HaffaLink['type'],
    (link: HaffaLink) => JSX.Element | null
> = {
    button: () => null,
    link: ({ label, href, icon }) => (
        <NavIconLink key={href} label={label} icon={icon} button={{ href }} />
    ),
    menuitem: () => null,
}

const insideDrawerLinkFactory: Record<
    HaffaLink['type'],
    (link: HaffaLink) => ReactNode | null
> = {
    button: () => null,
    link: () => null,
    menuitem: ({ label, href, icon }) => (
        <ListItem key={href} disablePadding>
            <ListItemButton href={href}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
            </ListItemButton>
        </ListItem>
    ),
}

export const Layout: FC<
    {
        hideNavigation?: boolean
    } & PropsWithChildren
> = ({ hideNavigation, children }) => {
    const theme = useTheme()
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))
    const phrases = useContext(PhraseContext)
    const { roles } = useContext(AuthContext)
    const { APP_TITLE } = phrases
    const [drawer, setDrawer] = useState(false)
    const links = useMemo(
        () =>
            hideNavigation
                ? []
                : createNavLinks({
                      mobile: !isDesktop,
                      desktop: isDesktop,
                      roles,
                      phrases,
                  }),
        [isDesktop, roles, phrases, hideNavigation]
    )

    const insideToolbarLinks = links
        .map((link) => insideToolbarLinkFactory[link.type](link))
        .filter((c) => c)
    const insideDrawerLinks = links
        .map((link) => insideDrawerLinkFactory[link.type](link))
        .filter((c) => c)

    return (
        <Box>
            <AppBar key="ab">
                <Toolbar>
                    <Button color="inherit" component="a" href="/">
                        {APP_TITLE}
                    </Button>

                    {insideToolbarLinks}
                    {insideDrawerLinks.length > 0 && (
                        <IconButton
                            color="inherit"
                            edge="end"
                            onClick={() => setDrawer(!drawer)}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={drawer}
                onClose={() => setDrawer(false)}
            >
                <Toolbar>
                    <Box flex={1} />
                    <IconButton
                        color="inherit"
                        edge="end"
                        onClick={() => setDrawer(!drawer)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List>{insideDrawerLinks}</List>
            </Drawer>

            <Toolbar /* for pushing down content */ />
            <Grid key="c" item xs={12} md={8} sx={{}}>
                <SlowFetchWarning key="sf" />
                <Container key="c" sx={{ position: 'relative' }}>
                    {children}
                </Container>
            </Grid>
            <NotificationsSnackbar />
        </Box>
    )
}
