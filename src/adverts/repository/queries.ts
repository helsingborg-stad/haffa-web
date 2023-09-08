const advertProps = `
	id
	createdAt
	title
	description
	quantity
	meta {
		reservableQuantity
		collectableQuantity
		isMine
		canEdit
		canArchive
		canUnarchive
		canRemove
		canBook
		canReserve
		canCancelReservation
		canCollect
		canCancelClaim
    reservedyMe
    collectedByMe
		claims {
			by
			at
			quantity
			type
		}
	}
	images {
		url
	}
	unit
	material
	condition
	usage
	category

	location {
		adress
		zipCode
		city
		country
	}
	contact {
		email
		phone
	}
`

const mutationProps = `
	advert {
		${advertProps}
	}
	status {
		code
		message
		field
	}
`

export const getAdvertQuery = /* GraphQL */ `
query Query($id: ID!) {
	getAdvert(id: $id) {
		${advertProps}
	}
  }
 `

export const listAdvertsQuery = /* GraphQL */ `
query Query($filter: AdvertFilterInput) {
	adverts(filter: $filter) {
		${advertProps}
	}
  }
`

export const createAdvertMutation = /* GraphQL */ `
mutation Mutation(
	$input: AdvertInput!
) {
	createAdvert(input: $input) {
		${mutationProps}
	}
}
`

export const updateAdvertMutation = /* GraphQL */ `
mutation Mutation(
	$id: ID!
	$input: AdvertInput!
) {
	updateAdvert(id: $id, input: $input) {
		${mutationProps}
	}
}
`

export const removeAdvertMutation = /* GraphQL */ `
mutation Mutation(
	$id: ID!
) {
	removeAdvert(id: $id) {
		${mutationProps}
	}
}
`

export const archiveAdvertMutation = /* GraphQL */ `
mutation Mutation(
	$id: ID!
) {
	archiveAdvert(id: $id) {
		${mutationProps}
	}
}
`

export const unarchiveAdvertMutation = /* GraphQL */ `
mutation Mutation(
	$id: ID!
) {
	unarchiveAdvert(id: $id) {
		${mutationProps}
	}
}
`

export const reserveAdvertMutation = /* GraphQL */ `
mutation Mutation(
	$id: ID!
	$quantity: Int!
) {
	reserveAdvert(id: $id, quantity: $quantity) {
		${mutationProps}
	}
}
`

export const cancelAdvertReservationMutation = /* GraphQL */ `
mutation Mutation(
	$id: ID!
) {
	cancelAdvertReservation(id: $id) {
		${mutationProps}
	}
}
`

export const collectAdvertMutation = /* GraphQL */ `
mutation Mutation(
	$id: ID!
	$quantity: Int!
) {
	collectAdvert(id: $id, quantity: $quantity) {
		${mutationProps}
	}
}
`

export const cancelAdvertClaimMutation = /* GraphQL */ `
mutation Mutation(
	$id: ID!,
	$by: String!,
	$type: AdvertClaimType!
) {
	cancelAdvertClaim(id: $id, by: $by, type: $type) {
		${mutationProps}
	}
}
`

export const getTermsQuery = /* GraphQL */ `
    query Query {
        terms {
            unit
            material
            condition
            usage
        }
    }
`
