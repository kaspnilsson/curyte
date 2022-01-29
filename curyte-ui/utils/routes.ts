export const lessonRoute = (uid: string) => `/lessons/${uid}`
export const lessonRouteHrefPath = '/lessons/[id]'

export const editLessonRoute = (uid: string) => `/lessons/edit/${uid}`
export const editLessonRouteHrefPath = '/lessons/edit/[id]'

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

export const logOutRoute = '/logout'

export const newLessonRoute = (copyFrom?: string) => {
  let out = '/lessons/new'
  if (copyFrom) out += `?copyFrom=${copyFrom}`
  return out
}
export const newLessonRouteHref = '/lessons/new'

export const tagRoute = (tag: string) => `/tags/${tag}`
export const tagRouteHrefPath = '/tags/[tag]'

export const lessonSearchRoute = (query?: string) => {
  let out = '/explore'
  if (query) out += `?query=${query}`
  return out
}

export const newPathRoute = '/paths/new'

export const editPathRoute = (uid: string) => `/paths/edit/${uid}`
export const editPathRouteHrefPath = '/paths/edit/[id]'

export const pathRoute = (uid: string) => `/paths/${uid}`
export const pathRouteHrefPath = '/paths/[id]'

export const lessonInPathRoute = (pathId: string, lessonId: string) =>
  `/paths/${pathId}/${lessonId}`
export const lessonInPathRouteHrefPath = '/paths/[id]/[lessonId]'

export const workspaceRoute = '/accounts/workspace'

export const accountSettingsRoute = '/accounts/settings'
