import { Button, Stack, SxProps, Theme } from '@mui/material'
import { AdvertFilterInput } from 'adverts'
import { PhraseContext } from 'phrases'
import { FC, useContext } from 'react'
import {
    SubscriptionsContext,
    convertAdvertFilterToSubscriptionFilter,
} from 'subscriptions'
import NotificationAddIcon from '@mui/icons-material/NotificationAdd'
import SubscriptionsIcon from '@mui/icons-material/Subscriptions'

export const AdvertSubscriptionControls: FC<{
    searchParams: AdvertFilterInput
    sx?: SxProps<Theme>
}> = ({ searchParams, sx }) => {
    const {
        canManageSubscriptions,
        canSubscribeToFilter,
        addAdvertSubscription,
    } = useContext(SubscriptionsContext)
    const { phrase } = useContext(PhraseContext)
    const filter = convertAdvertFilterToSubscriptionFilter(searchParams)
    const buttons = canManageSubscriptions()
        ? [
              <Button
                  key="subscribe"
                  variant="outlined"
                  startIcon={<NotificationAddIcon />}
                  disabled={!canSubscribeToFilter(filter)}
                  onClick={() => addAdvertSubscription(filter).catch(() => {})}
              >
                  {phrase(
                      'SUBSCRIPTIONS_SUBSCRIBE_TO_SEARCH',
                      'Bevaka denna sökning'
                  )}
              </Button>,
              <Button
                  key="nav"
                  variant="outlined"
                  component={Button}
                  startIcon={<SubscriptionsIcon />}
                  href="/my-subscriptions"
              >
                  {phrase('NAV_SUBSCRIPTIONS', 'Visa mina bevakningar')}
              </Button>,
          ]
        : []
    return buttons.length > 0 ? (
        <Stack
            useFlexGap
            justifyContent="end"
            direction={{ xs: 'column', sm: 'row' }}
            sx={{ gap: 1, ...sx }}
        >
            {buttons}
        </Stack>
    ) : null
}
