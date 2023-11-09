import {
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
import MenuIcon from '@mui/icons-material/Menu'
import { AuthContext } from 'auth'
import { NavLink, NavLinkProps } from 'react-router-dom'
import { PhraseContext } from '../phrases/PhraseContext'
import { HaffaLink, createNavLinks } from './nav-links'
import { SlowFetchWarning } from './SlowFetchWarning'
import { NotificationsSnackbar } from './NotificationSnackbar'

const NavIconButton: FC<{
    label: string
    icon: ReactNode
    button: ButtonProps
}> = ({ label, icon, button }) => (
    <Button color="inherit" {...button}>
        <Stack
            direction="column"
            sx={{
                alignItems: 'center',
                fontSize: { xs: 'x-small', sm: '' },
                fontWeight: 'initial',
                textTransform: 'none',
            }}
        >
            {icon}
            <Box>{label}</Box>
        </Stack>
    </Button>
)

const NavIconLink: FC<{
    label: string
    icon: ReactNode
    link: NavLinkProps
}> = ({ label, icon, link }) => (
    <Button color="inherit" component={NavLink} to={link.to}>
        <Stack
            direction="column"
            sx={{
                alignItems: 'center',
                fontSize: { xs: 'x-small', sm: '' },
                fontWeight: 'initial',
                textTransform: 'none',
                m: 1,
            }}
        >
            {icon}
            <Box>{label}</Box>
        </Stack>
    </Button>
)

const insideToolbarLinkFactory: Record<
    HaffaLink['type'],
    (link: HaffaLink) => JSX.Element | null
> = {
    button: ({ label, href, icon }) => (
        <Button
            key={href}
            color="primary"
            variant="contained"
            startIcon={icon}
            to={href}
            component={NavLink}
        >
            {label}
        </Button>
    ),
    link: ({ label, href, icon }) => (
        <NavIconLink key={href} label={label} icon={icon} link={{ to: href }} />
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
            <ListItemButton to={href} component={NavLink}>
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
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
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
            <AppBar key="ab" color="default">
                <Container disableGutters>
                    <Toolbar>
                        <Button
                            color="inherit"
                            component="a"
                            href="/"
                            sx={{
                                textTransform: 'none',
                            }}
                        >
                            {APP_TITLE}
                        </Button>
                        <Box flex={1} />
                        {insideToolbarLinks}
                        {insideDrawerLinks.length > 0 && (
                            <NavIconButton
                                label="Meny"
                                icon={<MenuIcon />}
                                button={{ onClick: () => setDrawer(!drawer) }}
                            />
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            <Drawer
                anchor="right"
                open={drawer}
                onClose={() => setDrawer(false)}
            >
                <Toolbar>
                    <Box flex={1} />
                    <NavIconButton
                        label="Meny"
                        icon={<MenuIcon />}
                        button={{ onClick: () => setDrawer(!drawer) }}
                    />
                </Toolbar>
                <Divider />
                <List>{insideDrawerLinks}</List>
            </Drawer>

            <Toolbar /* for pushing down content */ />
            <Grid key="c" item xs={12} md={8} sx={{}}>
                <Container key="c" sx={{ position: 'relative', mt: 4, mb: 8 }}>
                    <SlowFetchWarning key="sf" sx={{ mb: 2 }} />
                    {children}
                </Container>
            </Grid>
            <NotificationsSnackbar />
        </Box>
    )
}
