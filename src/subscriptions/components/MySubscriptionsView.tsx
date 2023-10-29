import {
    Button,
    Card,
    CardActions,
    CardContent,
    Checkbox,
    FormControlLabel,
    Grid,
    Stack,
    TextField,
} from '@mui/material'
import { CategoriesContext } from 'categories'
import { Category } from 'categories/types'
import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { PhraseContext } from 'phrases'
import { FC, Fragment, useCallback, useContext } from 'react'
import { SubscriptionsContext } from 'subscriptions'
import { AdvertSubscription } from 'subscriptions/types'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

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

const SubscriptionCategoryPreview: FC<{
    category: SubscriptionCategoryModel
}> = ({ category }) => (
    <Fragment key={`preview-${category.id}`}>
        <FormControlLabel
            key={`selected-${category.id}`}
            control={<Checkbox checked={category.selected} disabled />}
            label={category.label}
        />
        <SubscriptionCategoriesPreview
            key={`categories-${category.id}`}
            categories={category.categories}
        />
    </Fragment>
)

const SubscriptionCategoriesPreview: FC<{
    categories: SubscriptionCategoryModel[]
}> = ({ categories }) =>
    categories.length === 0 ? null : (
        <Stack
            key={`s-${categories[0].id}`}
            direction="column"
            sx={{ ml: 2, alignItems: 'stretch' }}
        >
            {categories.map((category) => (
                <SubscriptionCategoryPreview
                    key={category.id}
                    category={category}
                />
            ))}
        </Stack>
    )

export const SubscriptionsListing: FC<{
    subscriptions: SubscriptionModel[]
    onRemove: (subscription: SubscriptionModel) => void
}> = ({ subscriptions, onRemove }) => {
    const { phrase } = useContext(PhraseContext)
    return (
        <Grid container columns={{ xs: 1, sm: 3 }} gap={2} key="p">
            {subscriptions.map((subscription) => (
                <Grid item key={subscription.subscriptionId}>
                    <Card
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <CardContent key="c">
                            <TextField
                                key="s"
                                value={subscription.filter.search}
                                disabled
                            />
                            <SubscriptionCategoriesPreview
                                key="p"
                                categories={subscription.categories}
                            />
                        </CardContent>
                        <CardActions key="a" disableSpacing sx={{ mt: 'auto' }}>
                            <Button
                                variant="contained"
                                onClick={() => onRemove(subscription)}
                                startIcon={<DeleteForeverIcon />}
                            >
                                {phrase(
                                    'SUBSCRIPTIONS_UNSUBSCRIBE_TO_SEARCH',
                                    'Ta bort bevakning'
                                )}
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
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
