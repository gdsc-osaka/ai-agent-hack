// Analytics utilities for performance monitoring
export const analytics = {
  // Track page views
  trackPageView: (page: string) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Integration with Google Analytics, Mixpanel, etc.
      console.log(`Page view: ${page}`)
    }
  },

  // Track user interactions
  trackEvent: (eventName: string, properties?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      console.log(`Event: ${eventName}`, properties)
    }
  },

  // Track performance metrics
  trackPerformance: (metric: {
    name: string
    value: number
    unit: string
  }) => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      console.log(`Performance metric: ${metric.name} = ${metric.value}${metric.unit}`)
    }
  },

  // Track errors
  trackError: (error: Error, context?: Record<string, unknown>) => {
    if (typeof window !== 'undefined') {
      console.error('Tracked error:', error, context)
      // Send to error tracking service (Sentry, Bugsnag, etc.)
    }
  }
}

// Web Vitals integration
export const reportWebVitals = (metric: { name: string; value: number }) => {
  analytics.trackPerformance({
    name: metric.name,
    value: metric.value,
    unit: 'ms'
  })
}