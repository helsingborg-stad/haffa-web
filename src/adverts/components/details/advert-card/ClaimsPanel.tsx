import {
    Button,
    ButtonGroup,
    Card,
    CardActions,
    CardContent,
    ClickAwayListener,
    Grow,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    Popper,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, ReactNode, useCallback, useContext, useRef, useState } from 'react'
import { AdvertsContext } from 'adverts'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CancelIcon from '@mui/icons-material/Cancel'
import ConvertIcon from '@mui/icons-material/ChangeCircle'
import EventRepeatIcon from '@mui/icons-material/EventRepeat'
import { Terms } from 'terms/types'
import { ConfirmButton } from 'components/ConfirmButton'
import {
    Advert,
    AdvertClaim,
    AdvertClaimEventType,
    AdvertClaimType,
    AdvertMutationResult,
} from '../../../types'

type InferFCType<T> = T extends FC<infer P> ? P : never

const ActionButton: FC<{
    label: string
    icon: ReactNode
    action: () => void
}> = ({ label, icon, action }) => (
    <ConfirmButton
        fullWidth
        startIcon={icon}
        onClick={() => action()}
        variant="outlined"
    >
        {label}
    </ConfirmButton>
)

interface SplitActionOption {
    label: string
    icon: ReactNode
    action: () => void
}
const SplitActionButton: FC<{
    options: SplitActionOption[]
}> = ({ options }) => {
    const [open, setOpen] = useState(false)
    const anchorRef = useRef<HTMLDivElement>(null)
    const [selectedOption, setSelectedOption] = useState<SplitActionOption>(
        options[0]
    )

    const handleClose = (event: Event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return
        }

        setOpen(false)
    }

    return (
        <>
            <ButtonGroup ref={anchorRef} variant="outlined">
                <ConfirmButton
                    fullWidth
                    onClick={() => selectedOption.action()}
                    startIcon={selectedOption.icon}
                >
                    {selectedOption.label}
                </ConfirmButton>
                <Button
                    size="small"
                    sx={{ width: undefined }}
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={() => setOpen(!open)}
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Popper
                sx={{ zIndex: 1 }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom'
                                    ? 'center top'
                                    : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu" autoFocusItem>
                                    {options.map((option) => (
                                        <MenuItem
                                            key={option.label}
                                            selected={option === selectedOption}
                                            onClick={() => {
                                                setSelectedOption(option)
                                                setOpen(false)
                                            }}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    )
}

const OganizationsAwareActionButton: FC<{
    label: string
    icon: ReactNode
    action: (organization: string | null) => void
    terms: Terms
}> = ({ label, icon, action, terms }) =>
    terms.organization.length > 0 ? (
        <SplitActionButton
            options={[
                {
                    label,
                    icon,
                    action: () => action(null),
                },
                ...terms.organization.map((org) => ({
                    label: `${label} - ${org}`,
                    icon,
                    action: () => action(org),
                })),
            ]}
        />
    ) : (
        <ActionButton label={label} icon={icon} action={() => action(null)} />
    )

const ActionButtons: FC<{
    advert: Advert
    claim: AdvertClaim
    terms: Terms
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, claim, terms, onUpdate }) => {
    const { phrase } = useContext(PhraseContext)
    const { cancelAdvertClaim, convertAdvertClaim, renewAdvertClaim } =
        useContext(AdvertsContext)
    const makeButton = ({
        label,
        icon,
        action,
    }: Omit<InferFCType<typeof OganizationsAwareActionButton>, 'terms'>) => (
        <OganizationsAwareActionButton
            label={label}
            icon={icon}
            action={action}
            terms={terms}
        />
    )

    const theme = useTheme()
    const horizontalGroup = useMediaQuery(theme.breakpoints.up('md'))

    const createButtons = useCallback(
        () =>
            [
                claim.canCancel && claim.type === AdvertClaimType.reserved
                    ? makeButton({
                          label: phrase(
                              'ADVERT_CLAIMS_CANCEL_RESERVATION',
                              'Ångra reservation'
                          ),
                          icon: <CancelIcon color="primary" />,
                          action: (organization) =>
                              onUpdate(
                                  cancelAdvertClaim(
                                      advert.id,
                                      claim,
                                      organization ? { organization } : null
                                  )
                              ),
                      })
                    : null,
                claim.canCancel && claim.type === AdvertClaimType.collected
                    ? makeButton({
                          label: phrase(
                              'ADVERT_CLAIMS_CANCEL_COLLECT',
                              'Ångra hämtning'
                          ),
                          icon: <CancelIcon color="primary" />,
                          action: (organization) =>
                              onUpdate(
                                  cancelAdvertClaim(
                                      advert.id,
                                      claim,
                                      organization ? { organization } : null
                                  )
                              ),
                      })
                    : null,
                claim.canConvert && claim.type === AdvertClaimType.collected
                    ? makeButton({
                          label: phrase(
                              'ADVERT_CLAIMS_CHANGE_TO_RESERVED',
                              'Ändra till reservation'
                          ),
                          icon: <ConvertIcon color="primary" />,
                          action: (organization) =>
                              onUpdate(
                                  convertAdvertClaim(
                                      advert.id,
                                      claim,
                                      AdvertClaimType.reserved,
                                      organization ? { organization } : null
                                  )
                              ),
                      })
                    : null,

                claim.canConvert && claim.type === AdvertClaimType.reserved
                    ? makeButton({
                          label: phrase(
                              'ADVERT_CLAIMS_EXTEND_RESERVATION',
                              'Förnya reservation'
                          ),
                          icon: <EventRepeatIcon color="primary" />,
                          action: (organization) =>
                              onUpdate(
                                  renewAdvertClaim(
                                      advert.id,
                                      claim,
                                      organization ? { organization } : null
                                  )
                              ),
                      })
                    : null,
                claim.canConvert &&
                claim.type === AdvertClaimType.collected &&
                advert.lendingPeriod > 0
                    ? makeButton({
                          label: phrase(
                              'ADVERT_CLAIMS_EXTEND_COLLECT',
                              'Förnya utlåning'
                          ),
                          icon: <EventRepeatIcon color="primary" />,
                          action: (organization) =>
                              onUpdate(
                                  renewAdvertClaim(
                                      advert.id,
                                      claim,
                                      organization ? { organization } : null
                                  )
                              ),
                      })
                    : null,

                claim.canConvert && claim.type !== AdvertClaimType.collected
                    ? makeButton({
                          label: phrase(
                              'ADVERT_CLAIMS_COLLECT_MANUALLY',
                              'Lämna ut manuellt'
                          ),
                          icon: <ConvertIcon color="primary" />,
                          action: (organization) =>
                              onUpdate(
                                  convertAdvertClaim(
                                      advert.id,
                                      claim,
                                      AdvertClaimType.collected,
                                      organization ? { organization } : null
                                  )
                              ),
                      })
                    : null,
            ]
                .filter((v) => v)
                .map((v) => v!),
        [
            claim,
            advert,
            onUpdate,
            cancelAdvertClaim,
            convertAdvertClaim,
            renewAdvertClaim,
        ]
    )
    const buttons = createButtons()

    return (
        <Stack
            direction={horizontalGroup ? 'row' : 'column'}
            spacing={1}
            width="100%"
        >
            {buttons}
        </Stack>
    )
}

export const ClaimCard: FC<{
    terms: Terms
    advert: Advert
    claim: AdvertClaim
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ terms, advert, claim, onUpdate }) => {
    const { phrase } = useContext(PhraseContext)
    const { fromNow } = useContext(PhraseContext)
    const { quantity, type } = claim
    const { unit } = advert
    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="subtitle1">
                    {type === AdvertClaimType.reserved &&
                        phrase(
                            'ADVERT_CLAIM_IS_RESERVED',
                            '{by} reserverade {quantity} {unit} {at}',
                            {
                                by: claim.by,
                                unit,
                                quantity,
                                at: fromNow(claim.at),
                            }
                        )}
                    {type === AdvertClaimType.collected &&
                        phrase(
                            'ADVERT_CLAIM_IS_COLLECTED',
                            '{by} hämtade {quantity} {unit} {at}',
                            {
                                by: claim.by,
                                unit,
                                quantity,
                                at: fromNow(claim.at),
                            }
                        )}
                </Typography>
                <List dense>
                    {claim.events
                        .filter((c) => c.type === AdvertClaimEventType.reminder)
                        .map((event, i) => (
                            <ListItem key={i}>
                                <ListItemIcon>
                                    <NotificationsActiveOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={phrase(
                                        claim.type === AdvertClaimType.reserved
                                            ? 'ADVERT_CLAIM_RESERVE_REMINDER'
                                            : 'ADVERT_CLAIM_COLLECT_REMINDER',
                                        'Påminnelse skickad'
                                    )}
                                    secondary={new Date(
                                        event.at
                                    ).toLocaleDateString()}
                                />
                            </ListItem>
                        ))}
                </List>
            </CardContent>
            <CardActions>
                <ActionButtons
                    terms={terms}
                    advert={advert}
                    claim={claim}
                    onUpdate={onUpdate}
                />
            </CardActions>
        </Card>
    )
}

export const ClaimsPanel: FC<{
    advert: Advert
    terms: Terms
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, terms, onUpdate }) => {
    const {
        meta: { claims, canManageClaims },
    } = advert
    interface ClaimModel {
        claim: AdvertClaim
        key: string
        editMode: false
    }
    const [claimsModel] = useState<ClaimModel[]>(
        claims.map((claim) => ({
            claim,
            key: `${claim.at}-${claim.by}-${claim.type}-${claim.quantity}`,
            editMode: false,
        }))
    )

    return (
        canManageClaims && (
            <>
                {claimsModel.map(({ key, claim }) => (
                    <ClaimCard
                        key={key}
                        advert={advert}
                        terms={terms}
                        claim={claim}
                        onUpdate={onUpdate}
                    />
                ))}
            </>
        )
    )
}
