import { onCLS } from 'web-vitals/onCLS.js'
import { onFCP } from 'web-vitals/onFCP.js'
import { onINP } from 'web-vitals/onINP.js'
import { onLCP } from 'web-vitals/onLCP.js'
import { onTTFB } from 'web-vitals/onTTFB.js'

type ReportCallback = Parameters<typeof onCLS>[0]

const reportWebVitals = (onPerfEntry?: ReportCallback) => {
    if (onPerfEntry) {
        onCLS(onPerfEntry)
        onINP(onPerfEntry as unknown as Parameters<typeof onINP>[0])
        onFCP(onPerfEntry as unknown as Parameters<typeof onFCP>[0])
        onLCP(onPerfEntry as unknown as Parameters<typeof onLCP>[0])
        onTTFB(onPerfEntry as unknown as Parameters<typeof onTTFB>[0])
    }
}

export default reportWebVitals
