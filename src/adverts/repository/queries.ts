const advertProps = `
	id
	createdAt
	title
	description
	quantity
	meta {
		reservableQuantity
		canEdit
		canRemove
		canBook
		canReserve
		canCancelReservation
	}
	images {
		url
	}
	unit
	material
	condition
	usage

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
