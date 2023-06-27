export const getAdvertQuery = /* GraphQL */`
query Query($id: ID!) {
	getAdvert(id: $id) {
		permissions {
			edit
			delete
			book
			claim
		}
		title
		description
	}
  }
 `

export const listAdvertsQuery = /* GraphQL */`
query Query($filter: FilterAdvertsInput) {
	adverts(filter: $filter) {
	  id
	  title
	  description
	}
  }
`

export const createAdvertMutation = /* GraphQL */`
mutation Mutation(
	$input: CreateAdvertInput!
) {
	createAdvert(input: $input) {
		id
	  	title
	  	description
	}
}
`
export const getTermsQuery = /* GraphQL */`
query Query {
	terms {
		unit
		material
		condition
		usage
	}
}`
