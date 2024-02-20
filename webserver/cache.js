exports.createMemoryCache = (refresh = 30 /* Seconds */) => {
    let mem = {
        timestamp: null,
        content: null,
    }
    return {
        isValid: () =>
            !(new Date().getTime() - (mem.timestamp ?? 0) > refresh * 1000),

        set: (content) => {
            if (content && content.length > 0) {
                mem = {
                    timestamp: new Date().getTime(),
                    content,
                }
            }
        },
        get: () => mem.content,
    }
}
