import { interpolate } from 'lib/interpolate'
import dayjs from 'dayjs'
import { PhraseContextType } from './types'
import { defaultPhrases } from './default-phrases'

export const createProductionPhraseContext = (
    phrases: Record<string, string>
): PhraseContextType => {
    const phrase: PhraseContextType['phrase'] = (key, template, values) => {
        const t = phrases[key] || defaultPhrases[key] || template
        return values ? interpolate(t, values) : t
    }

    const convertToGetters = (o: Record<string, string>) =>
        Object.entries(o).reduce(
            (g, [key, value]) => ({
                ...g,
                get [key]() {
                    return phrase(key, value)
                },
            }),
            {}
        )

    return {
        ...defaultPhrases,
        ...convertToGetters({
            ...defaultPhrases,
            ...phrases,
        }),
        phrase,
        fromNow: (date) => dayjs(date).fromNow(),
        getConfig: () =>
            Object.entries(defaultPhrases).map(([key, template]) => ({
                key,
                template,
                actual: phrases[key] || '',
            })),
    }
}

export const createDevelopmentPhraseContext = (
    phrases: Record<string, string>
): PhraseContextType => {
    const recordings: Record<string, string> = {}
    const phrase: PhraseContextType['phrase'] = (key, template, values) => {
        const p = values
            ? interpolate(
                  phrases[key] || defaultPhrases[key] || template,
                  values
              )
            : template

        if (!key) {
            console.warn(`[phrases] use of unkeyed phrase ${template}`)
            return p
        }

        if (
            Object.hasOwn(defaultPhrases, key) &&
            defaultPhrases[key] !== template
        ) {
            console.warn(`[phrases] ${key} has different defaults`, {
                fromCode: template,
                fromDefinition: defaultPhrases[key],
            })
        }

        if (!recordings[key] && !Object.hasOwn(defaultPhrases, key)) {
            recordings[key] = template
            // console.log(`new phrase: ${key} => ${p}`)
            console.warn(
                `unknown phrase (${key},"${p}"). consider extending phrase config with `,
                recordings
            )
        }
        return p
    }
    const convertToGetters = (o: Record<string, string>) =>
        Object.entries(o).reduce(
            (g, [key, value]) => ({
                ...g,
                get [key]() {
                    return phrase(key, value)
                },
            }),
            {}
        )

    return {
        ...defaultPhrases,
        ...convertToGetters({
            ...defaultPhrases,
            ...phrases,
        }),
        phrase,
        fromNow: (date) => dayjs(date).fromNow(),
        getConfig: () =>
            Object.entries(defaultPhrases).map(([key, template]) => ({
                key,
                template,
                actual: phrases[key] || '',
            })),
    }
}

export const createPhraseContext = (phrases: Record<string, string>) =>
    process.env.NODE_ENV === 'production'
        ? createProductionPhraseContext(phrases)
        : createDevelopmentPhraseContext(phrases)
