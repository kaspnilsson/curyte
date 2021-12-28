export const lessonRoute = (uid: string) => `/lessons/${uid}`
export const lessonRouteHrefPath = '/lessons/[id]'

export const editLessonRoute = (uid: string) => `/lessons/edit/${uid}`
export const editLessonRouteHrefPath = '/lessons/edit/[id]'

export const draftRoute = (uid: string) => `/drafts/${uid}`
export const draftRouteHrefPath = '/drafts/[id]'

export const pathRoute = (uid: string) => `/paths/${uid}`
export const pathRouteHrefPath = '/paths/[id]'

export const pathEditRoute = (uid: string) => `/paths/edit/${uid}`
export const pathEditRouteHrefPath = '/paths/edit/[id]'

export const draftPreviewRoute = (uid: string) => `/drafts/preview/${uid}`
export const draftPreviewRouteHrefPath = '/drafts/preview/[id]'

export const accountRoute = (uid: string) => `/accounts/${uid}`
export const accountRouteHrefPath = '/accounts/[id]'

export const loginRoute = (referrer = '') => {
  let out = '/login'
  if (referrer) {
    out = `${out}?referrer=${referrer}`
  }
  return out
}

export const signupRoute = (referrer = '') => {
  let out = '/signup'
  if (referrer) {
    out = `${out}?referrer=${referrer}`
  }
  return out
}

export const indexRoute = '/'

export const newLessonRoute = (copyFrom?: string) => {
  let out = '/lessons/new'
  if (copyFrom) out += `?copyFrom=${copyFrom}`
  return out
}

export const tagRoute = (tag: string) => `/tags/${tag}`
export const tagRouteHrefPath = '/tags/[tag]'

export const lessonSearchRoute = (query?: string) => {
  let out = '/lessons'
  if (query) out += `?query=${query}`
  return out
}

export const newPathRoute = '/paths/new'
