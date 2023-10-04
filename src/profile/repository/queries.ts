const profileProps = `
	email
	phone
	adress
	zipCode
	city
	country
	organization
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
