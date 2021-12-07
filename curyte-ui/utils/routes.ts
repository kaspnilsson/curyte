export const lessonRoute = (uid: string) => `/lessons/${uid}`
export const lessonRouteHrefPath = '/lessons/[id]'

export const draftRoute = (uid: string) => `/drafts/${uid}`
export const draftRouteHrefPath = '/drafts/[id]'

export const draftPreviewRoute = (uid: string) => `/drafts/preview/${uid}`
export const draftPreviewRouteHrefPath = '/drafts/preview/[id]'

export const accountRoute = (uid: string) => `/accounts/${uid}`
export const accountRouteHrefPath = '/accounts/[id]'

export const loginRoute = '/login'

export const indexRoute = '/'

export const newLessonRoute = (copyFrom?: string) => {
  let out = '/lessons/new'
  if (copyFrom) out += `?copyFrom=${copyFrom}`
  return out
}

export const tagRoute = (tag: string) => `/tags/${tag}`
export const tagRouteHrefPath = '/tags/[tag]'
