const profileProps = `
	email
	phone
	adress
	zipCode
	city
	country
`

export const getProfileQuery = /* GraphQL */ `
    query Query {
        profile {
					${profileProps}
        }
    }
`

export const updateProfileMutation = /* GraphQL */ `
	mutation Mutation(
		$input: ProfileInput!
	) {
		updateProfile(input: $input) {
			${profileProps}
		}
	}
`
