import {
    FC,
    PropsWithChildren,
    ReactNode,
    Ref,
    forwardRef,
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
    Dialog,
    DialogContent,
    Divider,
    Drawer,
    Grid,
    Link,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Stack,
    Toolbar,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { AuthContext, AuthenticatePanel } from 'auth'
import { NavLink, NavLinkProps } from 'react-router-dom'
import LoginIcon from '@mui/icons-material/Login'
import { PhraseContext } from '../phrases/PhraseContext'
import { HaffaLink, createAdminNavLinks, createNavLinks } from './nav-links'
import { SlowFetchWarning } from './SlowFetchWarning'
import { NotificationsSnackbar } from './NotificationSnackbar'

const NavIconButton: FC<
    ButtonProps & {
        label: string
        icon: ReactNode
    }
> = ({ label, icon, ...buttonProps }) => (
    <Button color="inherit" {...buttonProps}>
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

const NavLinkCustom = forwardRef(
    (props: NavLinkProps, ref: Ref<HTMLAnchorElement>) => (
        <NavLink
            {...props}
            ref={ref}
            style={({ isActive }) =>
                isActive
                    ? {
                          textDecoration: 'underline',
                          textDecorationThickness: 2,
                          textUnderlineOffset: 10,
                      }
                    : {}
            }
        />
    )
)

const NavIconLink: FC<{
    label: string
    icon: ReactNode
    to: string
    onClick?: () => any
}> = ({ label, icon, to, onClick }) => (
    <Button
        color="inherit"
        component={NavLinkCustom}
        to={to}
        {...(onClick ? { onClick: () => onClick() } : {})}
    >
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
    button: ({ label, href, icon, onClick }) => (
        <Button
            key={href}
            color="primary"
            variant="contained"
            startIcon={icon}
            to={href}
            component={NavLinkCustom}
            {...(onClick ? { onClick: () => onClick() } : {})}
        >
            {label}
        </Button>
    ),
    link: ({ label, href, icon, onClick }) => (
        <NavIconLink
            key={href}
            label={label}
            icon={icon}
            to={href}
            onClick={onClick}
        />
    ),
    menuitem: () => null,
}

const insideDrawerLinkFactory: Record<
    HaffaLink['type'],
    (link: HaffaLink) => ReactNode | null
> = {
    button: () => null,
    link: () => null,
    menuitem: ({ label, href, icon, onClick }) => (
        <ListItem key={href} disablePadding>
            <ListItemButton
                {...(onClick ? { onClick: () => onClick() } : {})}
                to={href}
                component={NavLinkCustom}
            >
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
    const { isGuest, roles, signout } = useContext(AuthContext)
    const { APP_TITLE, phrase } = phrases
    const [drawer, setDrawer] = useState(false)
    const [authenticateDialog, setAuthenticateDialog] = useState(false)
    const links = useMemo(
        () =>
            hideNavigation
                ? []
                : createNavLinks({
                      mobile: !isDesktop,
                      guest: isGuest,
                      roles,
                      phrases,
                      signout: () =>
                          signout().then(() => window.location.assign('/')),
                  }),
        [isDesktop, isGuest, roles, phrases, hideNavigation, signout]
    )
    const adminLinks = useMemo(
        () =>
            hideNavigation
                ? []
                : createAdminNavLinks({
                      mobile: !isDesktop,
                      guest: isGuest,
                      roles,
                      phrases,
                  }),
        [isDesktop, isGuest, roles, phrases, hideNavigation]
    )

    const insideToolbarLinks = links
        .map((link) => insideToolbarLinkFactory[link.type](link))
        .filter((c) => c)
    const insideDrawerLinks = links
        .map((link) => insideDrawerLinkFactory[link.type](link))
        .filter((c) => c)
    const insideDrawerAdminLinks = adminLinks
        .map((link) => insideDrawerLinkFactory[link.type](link))
        .filter((c) => c)

    return (
        <Box>
            <AppBar key="ab">
                <Container disableGutters>
                    <Toolbar>
                        <Link
                            color="inherit"
                            component="a"
                            href="/"
                            sx={{
                                textTransform: 'none',
                            }}
                        >
                            <Box
                                component="img"
                                height={32}
                                src={theme.logotype}
                                alt={APP_TITLE}
                            />
                        </Link>
                        <Box flex={1} />
                        {insideToolbarLinks}
                        {isGuest && false && (
                            <NavIconButton
                                label="Logga in"
                                icon={<LoginIcon />}
                                color="primary"
                                variant="contained"
                                onClick={() => setAuthenticateDialog(true)}
                            />
                        )}
                        {insideDrawerLinks.length +
                            insideDrawerAdminLinks.length >
                            0 && (
                            <NavIconButton
                                label="Meny"
                                icon={<MenuIcon />}
                                onClick={() => setDrawer(!drawer)}
                            />
                        )}
                    </Toolbar>
                </Container>
            </AppBar>

            {isGuest && (
                <AppBar
                    position="fixed"
                    color="primary"
                    sx={{ top: 'auto', bottom: 0 }}
                >
                    <Container>
                        <Toolbar>
                            {phrase('AUTH_NAVBAR_INSPIRATION', '')}
                            <Box flex={1} />
                            <NavIconButton
                                label="Logga in"
                                icon={<LoginIcon />}
                                color="primary"
                                variant="contained"
                                onClick={() => setAuthenticateDialog(true)}
                            />
                        </Toolbar>
                    </Container>
                </AppBar>
            )}

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
                        onClick={() => setDrawer(!drawer)}
                    />
                </Toolbar>
                <Divider />
                <List key="links">{insideDrawerLinks}</List>
                {insideDrawerLinks.length > 0 &&
                    insideDrawerAdminLinks.length > 0 && (
                        <Divider key="divider" />
                    )}

                {insideDrawerAdminLinks.length > 0 && (
                    <List key="admin-links">
                        <ListSubheader>
                            {phrase('NAV_ADMIN', 'Administration')}
                        </ListSubheader>
                        {insideDrawerAdminLinks}
                    </List>
                )}
            </Drawer>

            <Toolbar /* for pushing down content */ />
            <Grid key="c" item xs={12} md={8} sx={{}}>
                <Container key="c" sx={{ position: 'relative', mt: 4, mb: 16 }}>
                    <SlowFetchWarning key="sf" sx={{ mb: 2 }} />
                    {children}
                </Container>
            </Grid>
            <NotificationsSnackbar />

            <Dialog
                open={authenticateDialog}
                onClose={() => setAuthenticateDialog(false)}
            >
                <DialogContent>
                    <AuthenticatePanel
                        onAuthenticated={() => {
                            setAuthenticateDialog(false)
                            window.location.reload()
                        }}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    )
}
