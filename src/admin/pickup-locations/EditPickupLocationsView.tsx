import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { PickupLocationContext } from 'pickup-locations'
import { type FC, useContext } from 'react'
import { TermsContext } from 'terms'
import { EditPickupLocationsForm } from './EditPickupLocationsForm'

export const EditPickupLocationsView: FC = () => {
    const { getPickupLocations, updatePickupLocations } = useContext(
        PickupLocationContext
    )
    const { getTerms } = useContext(TermsContext)

    const inspect = useAsync(() =>
        Promise.all([getPickupLocations(), getTerms()])
    )

    return inspect({
        resolved: ([locations, terms]) => (
            <EditPickupLocationsForm
                locations={locations}
                tags={terms.tags}
                onUpdate={(locations) => updatePickupLocations(locations)}
            />
        ),
        rejected: (error) => <ErrorView error={error} />,
        pending: () => null,
    })
}
