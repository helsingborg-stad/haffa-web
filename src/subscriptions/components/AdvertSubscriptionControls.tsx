import NotificationAddIcon from '@mui/icons-material/NotificationAdd'
import SubscriptionsIcon from '@mui/icons-material/Subscriptions'
import { Button, Stack, type SxProps, type Theme } from '@mui/material'
import type { AdvertFilterInput } from 'adverts'
import { PhraseContext } from 'phrases'
import { type FC, useContext } from 'react'
import {
    convertAdvertFilterToSubscriptionFilter,
    SubscriptionsContext,
} from 'subscriptions'

export const AdvertSubscriptionControls: FC<{
    searchParams: AdvertFilterInput
    hideIfEmptySearch?: boolean
    sx?: SxProps<Theme>
}> = ({ searchParams, hideIfEmptySearch, sx }) => {
    const {
        canManageSubscriptions,
        canSubscribeToFilter,
        addAdvertSubscription,
    } = useContext(SubscriptionsContext)
    const { phrase } = useContext(PhraseContext)
    const filter = convertAdvertFilterToSubscriptionFilter(searchParams)

    const canSubscribe = canSubscribeToFilter(filter)
    const showControls =
        canManageSubscriptions() && hideIfEmptySearch ? canSubscribe : true
    const stackSx: SxProps<Theme> = Array.isArray(sx)
        ? [{ justifyContent: 'end', gap: 1 }, ...sx]
        : sx
          ? [{ justifyContent: 'end', gap: 1 }, sx]
          : { justifyContent: 'end', gap: 1 }
    const buttons = showControls
        ? [
              <Button
                  key="subscribe"
                  variant="outlined"
                  startIcon={<NotificationAddIcon />}
                  disabled={!canSubscribe}
                  onClick={() => addAdvertSubscription(filter).catch(() => {})}
              >
                  {phrase(
                      'SUBSCRIPTIONS_SUBSCRIBE_TO_SEARCH',
                      'Bevaka denna sökning'
                  )}
              </Button>,
              false && (
                  <Button
                      key="nav"
                      variant="outlined"
                      component={Button}
                      startIcon={<SubscriptionsIcon />}
                      href="/my-subscriptions"
                  >
                      {phrase('NAV_SUBSCRIPTIONS', 'Visa mina bevakningar')}
                  </Button>
              ),
          ]
        : []
    return buttons.length > 0 ? (
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={stackSx}>
            {buttons}
        </Stack>
    ) : null
}
