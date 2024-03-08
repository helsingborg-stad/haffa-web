import { readFile } from 'fs/promises'
import { ApplicationModule } from '../types'
import { join } from 'path'
import { once } from '../utils'

const revision = once(() =>
    readFile(join(process.cwd(), 'git_revision.txt'), {
        encoding: 'utf8',
    })
        .then(
            (text) =>
                (text || '')
                    .split('\n')
                    .map((v) => v.trim())
                    .filter((v) => v)[0] || ''
        )
        .catch(() => '')
)

export const gitRevisionModule: ApplicationModule = ({ app }) =>
    app.use(async (ctx, next) => {
        const r = await revision()
        r && ctx.set('x-git-rev', r)
        return next()
    })
