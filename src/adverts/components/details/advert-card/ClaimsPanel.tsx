import {
    Button,
    ButtonGroup,
    ButtonProps,
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
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, ReactNode, useContext, useMemo, useRef, useState } from 'react'
import { AdvertsContext } from 'adverts'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CancelIcon from '@mui/icons-material/Cancel'
import ConvertIcon from '@mui/icons-material/ChangeCircle'
import EventRepeatIcon from '@mui/icons-material/EventRepeat'
import {
    Advert,
    AdvertClaim,
    AdvertClaimEventType,
    AdvertClaimType,
    AdvertMutationResult,
} from '../../../types'

const ActionsButton: FC<{
    advert: Advert
    claim: AdvertClaim
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, claim, onUpdate }) => {
    const { cancelAdvertClaim, convertAdvertClaim, renewAdvertClaim } =
        useContext(AdvertsContext)
    const { phrase } = useContext(PhraseContext)

    const anchorRef = useRef<HTMLDivElement>(null)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [open, setOpen] = useState(false)

    interface Option {
        label: string
        icon?: ReactNode
        action: () => void
        disabled?: boolean
        variant?: ButtonProps['variant']
    }

    const makeOption = (o: Option): Option => ({ variant: 'contained', ...o })

    const options = useMemo<Option[]>(
        () =>
            [
                makeOption({
                    label: phrase(
                        'ADVERT_CLAIMS_MANAGE_TITLE',
                        'Välj hantering'
                    ),
                    action: () => {},
                    disabled: true,
                    variant: 'outlined',
                }),
                claim.canCancel && claim.type === AdvertClaimType.reserved
                    ? makeOption({
                          label: phrase(
                              'ADVERT_CLAIMS_CANCEL_RESERVATION',
                              'Ångra reservation'
                          ),
                          icon: <CancelIcon color="primary" />,
                          action: () =>
                              onUpdate(cancelAdvertClaim(advert.id, claim)),
                      })
                    : null,
                claim.canCancel && claim.type === AdvertClaimType.collected
                    ? makeOption({
                          label: phrase(
                              'ADVERT_CLAIMS_CANCEL_COLLECT',
                              'Ångra hämtning'
                          ),
                          icon: <CancelIcon color="primary" />,
                          action: () =>
                              onUpdate(cancelAdvertClaim(advert.id, claim)),
                      })
                    : null,
                claim.canConvert && claim.type !== AdvertClaimType.collected
                    ? makeOption({
                          label: phrase(
                              'ADVERT_CLAIMS_COLLECT_MANUALLY',
                              'Lämna ut manuellt'
                          ),
                          icon: <ConvertIcon color="primary" />,
                          action: () =>
                              onUpdate(
                                  convertAdvertClaim(
                                      advert.id,
                                      claim,
                                      AdvertClaimType.collected
                                  )
                              ),
                      })
                    : null,
                claim.canConvert && claim.type === AdvertClaimType.collected
                    ? makeOption({
                          label: phrase(
                              'ADVERT_CLAIMS_CHANGE_TO_RESERVED',
                              'Ändra till reservation'
                          ),
                          icon: <ConvertIcon color="primary" />,
                          action: () =>
                              onUpdate(
                                  convertAdvertClaim(
                                      advert.id,
                                      claim,
                                      AdvertClaimType.reserved
                                  )
                              ),
                      })
                    : null,

                claim.canConvert && claim.type === AdvertClaimType.reserved
                    ? makeOption({
                          label: phrase(
                              'ADVERT_CLAIMS_EXTEND_RESERVATION',
                              'Förnya reservation'
                          ),
                          icon: <EventRepeatIcon color="primary" />,
                          action: () =>
                              onUpdate(renewAdvertClaim(advert.id, claim)),
                      })
                    : null,
                claim.canConvert &&
                claim.type === AdvertClaimType.collected &&
                advert.lendingPeriod > 0
                    ? makeOption({
                          label: phrase(
                              'ADVERT_CLAIMS_EXTEND_COLLECT',
                              'Förnya utlåning'
                          ),
                          icon: <EventRepeatIcon color="primary" />,
                          action: () =>
                              onUpdate(renewAdvertClaim(advert.id, claim)),
                      })
                    : null,
            ]
                .filter((o) => o)
                .map((o) => o!),
        [onUpdate, advert, claim]
    )

    const theme = useTheme()
    const largeScreen = useMediaQuery(theme.breakpoints.up('md'))

    const selectedOption = options[selectedIndex]

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen)
    }

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
            <ButtonGroup
                variant="outlined"
                ref={anchorRef}
                aria-label="split button"
                fullWidth={!largeScreen}
            >
                <Button
                    onClick={selectedOption.action}
                    fullWidth={!largeScreen}
                    startIcon={selectedOption.icon}
                    variant={selectedOption.variant}
                >
                    {selectedOption.label}
                </Button>
                <Button
                    size="small"
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="Välj hantering"
                    aria-haspopup="menu"
                    fullWidth={false}
                    onClick={handleToggle}
                    variant={selectedOption.variant}
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Popper
                sx={{
                    zIndex: 1,
                }}
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
                                <MenuList autoFocusItem>
                                    {options
                                        .filter(({ disabled }) => !disabled)
                                        .map((option) => (
                                            <MenuItem
                                                key={option.label}
                                                selected={
                                                    option === selectedOption
                                                }
                                                onClick={() => {
                                                    setSelectedIndex(
                                                        options.indexOf(option)
                                                    )
                                                    setOpen(false)
                                                }}
                                            >
                                                <ListItemIcon>
                                                    {option.icon}
                                                </ListItemIcon>
                                                <ListItemText>
                                                    {option.label}
                                                </ListItemText>
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

export const ClaimCard: FC<{
    advert: Advert
    claim: AdvertClaim
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, claim, onUpdate }) => {
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
                <ActionsButton
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
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, onUpdate }) => {
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
                        claim={claim}
                        onUpdate={onUpdate}
                    />
                ))}
            </>
        )
    )
}
