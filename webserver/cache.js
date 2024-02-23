exports.createMemoryCache = (refresh = 30 /* Seconds */) => {
    let mem = {
        timestamp: null,
        html: null,
        data: null,
    }
    return {
        isValid: () =>
            !(new Date().getTime() - (mem.timestamp ?? 0) > refresh * 1000),

        set: ({ html, data }) => {
            if (html && html.length > 0 && data) {
                mem = {
                    timestamp: new Date().getTime(),
                    html,
                    data,
                }
            }
        },
        get: () => ({ html: mem.html, data: mem.data }),
    }
}
