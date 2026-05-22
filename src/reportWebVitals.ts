import { onCLS } from 'web-vitals/onCLS.js'
import { onFCP } from 'web-vitals/onFCP.js'
import { onINP } from 'web-vitals/onINP.js'
import { onLCP } from 'web-vitals/onLCP.js'
import { onTTFB } from 'web-vitals/onTTFB.js'
import type { MetricType } from 'web-vitals'

type ReportCallback = (metric: MetricType) => void

const reportWebVitals = (onPerfEntry?: ReportCallback) => {
    if (onPerfEntry) {
        onCLS(onPerfEntry)
        onINP(onPerfEntry)
        onFCP(onPerfEntry)
        onLCP(onPerfEntry)
        onTTFB(onPerfEntry)
    }
}

export default reportWebVitals
