export const GA_TRACKING_ID = 'G-DZN4F4RQ37'

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL) => {
  if (process.env.NODE_ENV === 'production') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  } else {
    console.log(`would have logged pageview: ${url}`)
  }
}

type GTagEvent = {
  action: string
  category: string
  label: string
  value: number
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = (event: GTagEvent) => {
  if (process.env.NODE_ENV === 'production') {
    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
    })
  } else {
    console.log(`would have logged event: ${event}`)
  }
}

export const exception = (description: string, fatal = false) => {
  if (process.env.NODE_ENV === 'production') {
    window.gtag('event', 'exception', {
      description,
      fatal,
    })
  } else {
    console.log(
      `would have logged exception. description: ${description} \nfatal: ${fatal}`
    )
  }
}
