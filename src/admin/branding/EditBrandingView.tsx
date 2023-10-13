import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { FC, useContext } from 'react'
import { BrandingContext } from 'branding/BrandingContext'
import { EditBrandingForm } from './EditBrandingForm'

export const EditBrandingView: FC = () => {
    const { getBrandingOptions, updateBrandingOptions } =
        useContext(BrandingContext)

    const inspect = useAsync(getBrandingOptions)

    return inspect({
        resolved: (options, _, update) => (
            <EditBrandingForm
                options={options}
                onUpdate={(t) => update(updateBrandingOptions(t))}
            />
        ),
        rejected: (error) => <ErrorView error={error} />,
        pending: () => null,
    })
}
