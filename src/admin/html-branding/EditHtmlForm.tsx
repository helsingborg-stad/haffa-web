import { Card, CardContent, TextField, Typography } from '@mui/material'
import { FC, useCallback, useState } from 'react'
import { AdminActionPanel } from 'components/AdminActionPanel'
import { AdminEditorialPanel } from 'components/AdminEditorialPanel'
import { objectToOptions, optionsToObject } from 'options/mappers'
import { ImageThumbnail } from 'admin/content/components/ImageThumbnail'
import { ImageBrowseButton } from 'admin/content/components/ImageBrowseButton'
import {
    HtmlOptions,
    type HtmlOptionKeys,
    type Option,
} from '../../options/types'
import { getDefaultHtmlOptions } from './mappers'

export const EditHtmlForm: FC<{
    options: Option<HtmlOptionKeys>[]
    onUpdate: (
        options: Option<HtmlOptionKeys>[]
    ) => Promise<Option<HtmlOptionKeys>[]>
}> = ({ options, onUpdate }) => {
    // Transform and cache
    const [state, setState] = useState<HtmlOptions>({
        ...getDefaultHtmlOptions(),
        ...optionsToObject<HtmlOptionKeys>(options),
    })

    const patch = useCallback(
        (property: Partial<HtmlOptions>) =>
            setState({
                ...state,
                ...property,
            }),
        [state]
    )

    return (
        <>
            <AdminEditorialPanel
                headline="ADMIN_HTML_HEADLINE"
                body="ADMIN_HTML_BODY"
            />
            <AdminActionPanel
                disabled={false}
                onSave={() => onUpdate(objectToOptions<HtmlOptionKeys>(state))}
                onRestore={() => setState(getDefaultHtmlOptions())}
            />
            <Card>
                <CardContent>
                    <TextField
                        fullWidth
                        sx={{ mt: 2 }}
                        value={state.title}
                        label="Titel"
                        helperText="Detta är texten som visas i webbläsarens flikrad"
                        inputProps={{
                            maxLength: 32,
                        }}
                        onChange={({ target: { value: title } }) =>
                            patch({ title })
                        }
                    />
                    <TextField
                        fullWidth
                        sx={{ mt: 2 }}
                        value={state.description}
                        label="Beskrivning"
                        helperText="Beskrivningstext som visas om du delar länken till appen med någon annan"
                        inputProps={{
                            maxLength: 128,
                        }}
                        onChange={({ target: { value: description } }) =>
                            patch({ description })
                        }
                    />
                    <TextField
                        fullWidth
                        sx={{ mt: 2 }}
                        value={state.url}
                        label="Url"
                        helperText="URL som visas om du delar länken till appen med någon annan."
                        onChange={({ target: { value: url } }) =>
                            patch({ url })
                        }
                    />
                    <>
                        <Typography sx={{ my: 2 }}>
                            Liten bild som visas när du delar länken till appen
                            med någon annan. Bilden skall vara i formatet .png
                            och ha dimensionen 192x192 för bästa resultat. Den
                            maximala filstorleken är 32kb
                        </Typography>
                        {state.imageLogo192 !== '' && (
                            <ImageThumbnail
                                height={192}
                                url={state.imageLogo192}
                                onDelete={() =>
                                    patch({
                                        imageLogo192:
                                            getDefaultHtmlOptions()
                                                .imageLogo192,
                                    })
                                }
                            />
                        )}
                        <ImageBrowseButton
                            maxSize={32 * 1024}
                            onUpdate={(imageLogo192) => patch({ imageLogo192 })}
                            filter="png"
                        />
                    </>
                    <>
                        <Typography sx={{ my: 2 }}>
                            Stor bild som visas när du delar länken till appen
                            med någon annan. Bilden skall vara i formatet .png
                            och ha dimensionen 512x512 för bästa resultat. Den
                            maximala filstorleken är 32kb
                        </Typography>
                        {state.imageLogo512 !== '' && (
                            <ImageThumbnail
                                height={512}
                                url={state.imageLogo512}
                                onDelete={() =>
                                    patch({
                                        imageLogo512:
                                            getDefaultHtmlOptions()
                                                .imageLogo512,
                                    })
                                }
                            />
                        )}
                        <ImageBrowseButton
                            maxSize={32 * 1024}
                            onUpdate={(imageLogo512) => patch({ imageLogo512 })}
                            filter="png"
                        />
                    </>
                    <>
                        <Typography sx={{ my: 2 }}>
                            Bild som visas i webbläsarens flikrad. Bilden skall
                            vara i formatet .png och ha dimensionerna 16x16
                            eller 32x32 för bästa resultat. Den maximala
                            filstorleken är 16kb
                        </Typography>
                        {state.imageFavicon !== '' && (
                            <ImageThumbnail
                                height={32}
                                url={state.imageFavicon}
                                onDelete={() =>
                                    patch({
                                        imageFavicon:
                                            getDefaultHtmlOptions()
                                                .imageFavicon,
                                    })
                                }
                            />
                        )}
                        <ImageBrowseButton
                            maxSize={16 * 1024}
                            onUpdate={(imageFavicon) => patch({ imageFavicon })}
                            filter="png"
                        />
                    </>
                </CardContent>
            </Card>
        </>
    )
}
