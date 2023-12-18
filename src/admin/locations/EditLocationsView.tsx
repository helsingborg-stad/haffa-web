import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { LocationContext } from 'locations'
import { FC, useContext } from 'react'
import { EditLocationsForm } from './EditLocationsForm'

export const EditLocationsView: FC = () => {
    const { getLocations, updateLocations } = useContext(LocationContext)

    const inspect = useAsync(getLocations)

    return inspect({
        resolved: (locations) => (
            <EditLocationsForm
                locations={locations}
                onUpdate={(t) => updateLocations(t)}
            />
        ),
        rejected: (error) => <ErrorView error={error} />,
        pending: () => null,
    })
}
