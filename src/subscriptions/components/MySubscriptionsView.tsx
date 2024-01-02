import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    IconButton,
    Typography,
} from '@mui/material'
import { CategoriesContext } from 'categories'
import { Category } from 'categories/types'
import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { PhraseContext } from 'phrases'
import { FC, useCallback, useContext } from 'react'
import { SubscriptionsContext } from 'subscriptions'
import { AdvertSubscription } from 'subscriptions/types'
import { UrlParamsContext } from 'url-params'
import SubscriptionsIcon from '@mui/icons-material/Subscriptions'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { Editorial } from 'editorials'

interface SubscriptionModel extends AdvertSubscription {
    categories: SubscriptionCategoryModel[]
}

interface SubscriptionCategoryModel extends Category {
    categories: SubscriptionCategoryModel[]
    selected: boolean
}

const pruneCategoryTreeSelectedTree = (
    categories: Category[],
    selected: Set<string>
): SubscriptionCategoryModel[] =>
    categories
        .map((c) => ({
            ...c,
            selected: selected.has(c.id),
            categories: pruneCategoryTreeSelectedTree(c.categories, selected),
        }))
        .filter((c) => c.selected || c.categories.length > 0)

const flattenCategories = (categories: SubscriptionCategoryModel[]): string =>
    categories
        .map((c) =>
            c.categories.length > 0 ? flattenCategories(c.categories) : c.label
        )
        .join(', ')

export const SubscriptionsListing: FC<{
    subscriptions: SubscriptionModel[]
    onRemove: (subscription: SubscriptionModel) => void
}> = ({ subscriptions, onRemove }) => {
    const { phrase } = useContext(PhraseContext)
    const { makeAdvertSubscriptionUrl } = useContext(UrlParamsContext)
    return (
        <>
            <Typography variant="h5" gutterBottom>
                {phrase('SUBSCRIPTIONS_HEADING', '')}
            </Typography>
            <Typography paragraph>
                {phrase('SUNSCRIPTIONS_EDITORIAL', '')}
            </Typography>
            <Grid container spacing={2} key="p">
                {subscriptions.map((subscription) => (
                    <Grid item key={subscription.subscriptionId} xs={12} sm={4}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <CardHeader
                                avatar={
                                    <Avatar>
                                        <SubscriptionsIcon />
                                    </Avatar>
                                }
                                title="Bevakning"
                                action={
                                    <IconButton
                                        onClick={() => onRemove(subscription)}
                                    >
                                        <RemoveCircleOutlineIcon />
                                    </IconButton>
                                }
                            />
                            <CardContent key="c" sx={{ pt: 0, px: 4 }}>
                                {subscription.filter.search && (
                                    <Box py={1}>
                                        <Typography>Sökord </Typography>
                                        <Typography variant="subtitle2">
                                            {subscription.filter.search}
                                        </Typography>
                                    </Box>
                                )}

                                {subscription.categories.length > 0 && (
                                    <Box py={1}>
                                        <Typography>Kategorier</Typography>
                                        <Typography variant="subtitle2">
                                            {flattenCategories(
                                                subscription.categories
                                            )}
                                        </Typography>
                                    </Box>
                                )}
                                {(subscription.filter.tags?.length ?? 0) >
                                    0 && (
                                    <Box py={1}>
                                        <Typography>Taggar</Typography>
                                        <Typography variant="subtitle2">
                                            {subscription.filter.tags?.join(
                                                ', '
                                            ) ?? ''}
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                            <CardActions
                                key="a"
                                disableSpacing
                                sx={{ mt: 'auto', width: '100%' }}
                            >
                                <Button
                                    variant="text"
                                    color="primary"
                                    fullWidth
                                    href={makeAdvertSubscriptionUrl(
                                        '/subscription',
                                        subscription.filter
                                    )}
                                >
                                    {phrase(
                                        'SUBSCRIPTIONS_NAVIGATE_TO_SEARCH',
                                        'Visa'
                                    )}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {subscriptions.length === 0 && (
                <Box sx={{ pt: 2 }}>
                    <Editorial phraseKey="SUBSCRIPTIONS_NO_CONTENT" />
                </Box>
            )}
        </>
    )
}

export const MySubscriptionsView: FC = () => {
    const { getAdvertSubscriptions, removeAdvertSubscription } =
        useContext(SubscriptionsContext)
    const { getCategories } = useContext(CategoriesContext)

    const loadModel = useCallback(
        () =>
            Promise.all([getAdvertSubscriptions(), getCategories()]).then(
                ([subscriptions, categories]) =>
                    subscriptions.map((subscription) => ({
                        ...subscription,
                        categories: pruneCategoryTreeSelectedTree(
                            categories,
                            new Set<string>(
                                subscription.filter.categories || []
                            )
                        ),
                    }))
            ),
        [getAdvertSubscriptions, getCategories]
    )

    const view = useAsync<SubscriptionModel[]>(() => loadModel())

    return view({
        rejected: (error) => <ErrorView error={error} />,
        pending: () => <span />,
        resolved: (model, _, update) => (
            <SubscriptionsListing
                subscriptions={model}
                onRemove={({ subscriptionId }) =>
                    update(
                        removeAdvertSubscription(subscriptionId).then(() =>
                            loadModel()
                        )
                    )
                }
            />
        ),
    })
}
