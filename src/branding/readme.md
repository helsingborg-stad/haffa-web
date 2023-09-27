# A guide to branding Haffa

Haffa facilitates a simple ad-hoc method for branding of certain aspects.

A custom branding configuration can be specified in a file on the webserver, say in `./.local/branding.json`.

To make the branding take effect, specify `BRANDING_PATH='./.local/branding.json'`

The contents in configuration file is merged into

-   the [Material UI Theme](https://mui.com/material-ui/customization/theming/)
-   the [Phrases](../phrases/create-phrase-context.ts) (i.e. texts used throughout the UX)

Below is the contents of an exemple branding file:

```
{
    "phrases": {
        "APP_TITLE": "Återbruket"
    },
    "theme": {
        "palette": {
            "primary": {
                "main": "rgb(255, 0, 0)"
            },
            "secondary": {
                "main": "rgb(225, 32, 32)"
            }
        }
    }
}
```
