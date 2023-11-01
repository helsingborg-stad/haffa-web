import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { OptionsContext } from 'options/OptionsContext'
import { FC, useContext } from 'react'
import { EditPhrasesForm } from './EditPhrasesForm'

export const EditPhrasesView: FC = () => {
    const { getPhraseOptions, updatePhraseOptions } = useContext(OptionsContext)
    const inspect = useAsync(getPhraseOptions)
    return inspect({
        resolved: (options, _, update) => (
            <EditPhrasesForm
                options={options}
                onUpdate={(t) => update(updatePhraseOptions(t))}
            />
        ),
        rejected: (error) => <ErrorView error={error} />,
        pending: () => null,
    })
}
