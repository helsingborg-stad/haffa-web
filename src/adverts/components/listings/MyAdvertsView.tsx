import { FC, useContext } from 'react'
import { AdvertFilterInput } from 'adverts'
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material'
import { PhraseContext } from 'phrases/PhraseContext'
import { AdvertsListWithSearch } from './AdvertsListWithSearch'

const ToggleArchived: FC<{
    searchParams: AdvertFilterInput
    setSearchParams: (p: AdvertFilterInput) => void
}> = ({ searchParams, setSearchParams }) => {
    const { phrase } = useContext(PhraseContext)

    return (
        <FormGroup>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={searchParams?.restrictions?.isArchived}
                        onChange={(e) =>
                            setSearchParams({
                                ...searchParams,
                                restrictions: {
                                    ...searchParams.restrictions,
                                    isArchived: e.target.checked,
                                },
                            })
                        }
                    />
                }
                label={phrase('', 'Visa arkiverade')}
            />
        </FormGroup>
    )
}

export const MyAdvertsView: FC = () => (
    <AdvertsListWithSearch
        cacheName="my-adverts"
        defaultSearchParams={{
            restrictions: { createdByMe: true },
            sorting: { field: 'createdAt', ascending: false },
        }}
        renderControls={(searchParams, setSearchParams) => (
            <ToggleArchived
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />
        )}
    />
)
