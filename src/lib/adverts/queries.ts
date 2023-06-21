export const getAdvertQuery = `
query Query($id: ID!) {
	getAdvert(id: $id) {
	  title
	  description
	}
  }
 `
export const listAdvertsQuery = `
query Query {
	adverts {
	  description
	  id
	  title
	}
  }
`
