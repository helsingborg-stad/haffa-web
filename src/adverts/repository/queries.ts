export const getAdvertQuery = `
query Query($id: ID!) {
	getAdvert(id: $id) {
	  title
	  description
	}
  }
 `
/*
export const listAdvertsQuery = `
query Query {
	adverts {
	  id
	  title
	  description
	}
  }
`
*/
export const listAdvertsQuery = `
query Query($filter: FilterAdvertsInput) {
	adverts(filter: $filter) {
	  id
	  title
	  description
	}
  }
`

export const deleteAdvert = /* GraphQL */ `
  mutation DeleteAdvert(
    $input: DeleteAdvertInput!
    $condition: ModelAdvertConditionInput
  ) {
    deleteAdvert(input: $input, condition: $condition) {
      id
      title
`

export const createAdvertMutation = `
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
