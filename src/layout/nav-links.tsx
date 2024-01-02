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
import { HaffaUserRoles, hasSomeAdminRoles } from 'auth'
import { PhraseContextType } from 'phrases'
import { Func1 } from 'lib/types'

export interface HaffaLink {
    label: string
    href: string
    icon: ReactNode
    type: 'button' | 'link' | 'menuitem'
}

const link = (label: string, href: string, icon: ReactNode): HaffaLink => ({
    label,
    href,
    icon,
    type: 'link',
})
const menuitem = (label: string, href: string, icon: ReactNode): HaffaLink => ({
    label,
    href,
    icon,
    type: 'menuitem',
})

export const createNavLinks: Func1<
    {
        mobile: boolean
        guest: boolean
        roles: HaffaUserRoles
        phrases: PhraseContextType
    },
    HaffaLink[]
> = ({
    mobile,
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
    },
}) =>
    guest
        ? [link(SCAN_QR_CODE, '/scan', <QrCodeScannerIcon />)]
        : [
              link(NAV_BROWSE, '/browse', <SearchIcon />),
              link(NAV_CREATE, '/advert/create', <AddIcon />),
              link(SCAN_QR_CODE, '/scan', <QrCodeScannerIcon />),
              (mobile ? menuitem : link)(
                  'Bevakningar',
                  '/my-subscriptions',
                  <StarBorderIcon />
              ),
              (mobile ? menuitem : link)(
                  NAV_MY_RESERVATIONS,
                  '/my-reservations',
                  <CheckIcon />
              ),
              (mobile ? menuitem : link)(
                  NAV_MY_ADVERTS,
                  '/my-adverts',
                  <BookmarkBorderIcon />
              ),
              (mobile ? menuitem : link)(
                  NAV_PROFILE,
                  '/profile',
                  <PersonIcon />
              ),
              (mobile ? menuitem : link)(
                  NAV_ABOUT_HAFFA,
                  '/about',
                  <InfoOutlinedIcon />
              ),
              hasSomeAdminRoles(roles) &&
                  (mobile ? menuitem : link)(
                      phrase('NAV_ADMIN', 'Administration'),
                      '/admin',
                      <SettingsIcon />
                  ),
          ]
              .filter((v) => v)
              .map((v) => v as HaffaLink)
