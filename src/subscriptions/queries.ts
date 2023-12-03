const advertSubscriptionFields = `
	subscriptionId
	createdAt
	lastNotifiedAt
	filter {
		search
		categories
		tags
	}
`

export const getAdvertSubscriptionsQuery = /* GraphQL */ `
	query Query {
		advertSubscriptions {
			${advertSubscriptionFields}
		}
	}
`
export const addAdvertSubscriptionMutation = /* GraphQL */ `
	mutation Mutation($filter: AdvertSubscriptionFilterInput!) {
		addAdvertSubscription(filter: $filter) {
			${advertSubscriptionFields}
		}
	}
	`

export const removeAdvertSubscriptionMutation = /* GraphQL */ `
	mutation Mutation($subscriptionId: String!) {
		removeAdvertSubscription(subscriptionId: $subscriptionId) {
			${advertSubscriptionFields}
		}
	}
	`
