import AddIcon from '@mui/icons-material/AddCircleOutline'
import SearchIcon from '@mui/icons-material/Search'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import { ReactNode } from 'react'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import CheckIcon from '@mui/icons-material/Check'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import { HaffaUserRoles, hasSomeAdminRoles } from 'auth'
import { PhraseContextType } from 'phrases'
import { Func1 } from 'lib/types'

export interface HaffaLink {
    label: string
    href: string
    icon: ReactNode
    onClick?: () => any
    type: 'button' | 'link' | 'menuitem'
}

const link = (
    label: string,
    href: string,
    icon: ReactNode,
    onClick?: () => any
): HaffaLink => ({
    label,
    href,
    icon,
    onClick,
    type: 'link',
})
const menuitem = (
    label: string,
    href: string,
    icon: ReactNode,
    onClick?: () => any
): HaffaLink => ({
    label,
    href,
    icon,
    onClick,
    type: 'menuitem',
})

export const createNavLinks: Func1<
    {
        mobile: boolean
        guest: boolean
        roles: HaffaUserRoles
        phrases: PhraseContextType
        signout: () => any
    },
    HaffaLink[]
> = ({
    guest,
    roles,
    phrases: {
        phrase,
        NAV_CREATE,
        NAV_BROWSE,
        NAV_MY_ADVERTS,
        NAV_MY_RESERVATIONS,
        NAV_PROFILE,
        SCAN_QR_CODE,
        NAV_ABOUT_HAFFA,
        SIGNOUT,
    },
    signout,
}) =>
    guest
        ? [
              link(NAV_BROWSE, '/browse', <SearchIcon />),
              link(SCAN_QR_CODE, '/scan', <QrCodeScannerIcon />),
          ]
        : [
              link(NAV_BROWSE, '/browse', <SearchIcon />),
              link(SCAN_QR_CODE, '/scan', <QrCodeScannerIcon />),
              roles.canEditOwnAdverts &&
                  menuitem(NAV_CREATE, '/advert/create', <AddIcon />),
              roles.canSubscribe &&
                  menuitem(
                      'Bevakningar',
                      '/my-subscriptions',
                      <StarBorderIcon />
                  ),
              roles.canReserveAdverts &&
                  menuitem(
                      NAV_MY_RESERVATIONS,
                      '/my-reservations',
                      <CheckIcon />
                  ),
              roles.canEditOwnAdverts &&
                  menuitem(
                      NAV_MY_ADVERTS,
                      '/my-adverts',
                      <BookmarkBorderIcon />
                  ),
              menuitem(NAV_ABOUT_HAFFA, '/about', <InfoOutlinedIcon />),
              hasSomeAdminRoles(roles) &&
                  menuitem(
                      phrase('NAV_ADMIN', 'Administration'),
                      '/admin',
                      <SettingsIcon />
                  ),
              roles.canManageProfile &&
                  menuitem(NAV_PROFILE, '/profile', <PersonIcon />),
              menuitem(SIGNOUT, '/logout', <LogoutIcon />, signout),
          ]
              .filter((v) => v)
              .map((v) => v as HaffaLink)
