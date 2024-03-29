import { isServerSideRendering } from '../hooks/useWindowSize'

export const lessonRoute = (uid: string) => `/lessons/${uid}`
export const lessonRouteHrefPath = '/lessons/[id]'

export const presentLessonRoute = (uid: string) => `/lessons/present/${uid}`
export const presentLessonRouteHrefPath = '/lessons/present/[id]'

export const editLessonRoute = (uid: string) => `/lessons/edit/${uid}`
export const editLessonRouteHrefPath = '/lessons/edit/[id]'

export const accountRoute = (uid: string) => `/accounts/${uid}`
export const accountRouteHrefPath = '/accounts/[id]'

export const loginRoute = (referrer = '') => {
  let out = '/login'
  // Always refer in prod, but referring is broken in dev due to
  // https://github.com/supabase/auth-elements/issues/12#issuecomment-864768979

  if (!isServerSideRendering && window.location.hostname === PROD_HOST_NAME) {
    referrer = window.location.pathname
  }
  if (referrer) {
    out = `${out}?referrer=${referrer}`
  }
  return out
}

export const indexRoute = '/'

export const logOutRoute = '/api/auth/logout'

export const newLessonRoute = (copyFrom?: string) => {
  let out = '/lessons/new'
  if (copyFrom) out += `?copyFrom=${copyFrom}`
  return out
}
export const newLessonRouteHref = '/lessons/new'

export const tagRoute = (tag: string) => `/tags/${tag}`
export const tagRouteHrefPath = '/tags/[tag]'

export const exploreRoute = '/'

export const notebooksRoute = '/accounts/notebooks'

export const newPathRoute = '/paths/new'

export const editPathRoute = (uid: string) => `/paths/edit/${uid}`
export const editPathRouteHrefPath = '/paths/edit/[id]'

export const pathRoute = (uid: string) => `/paths/${uid}`
export const pathRouteHrefPath = '/paths/[id]'

export const lessonInPathRoute = (pathId: string, lessonId: string) =>
  `/paths/${pathId}/${lessonId}`
export const lessonInPathRouteHrefPath = '/paths/[id]/[lessonId]'

export const presentLessonInPathRoute = (pathId: string, lessonId: string) =>
  `/paths/${pathId}/present/${lessonId}`
export const presentLessonInPathRouteHrefPath = '/paths/[id]/present/[lessonId]'

export const workspaceRoute = '/accounts/workspace'

export const accountSettingsRoute = '/accounts/settings'

export const whatIsCuryteRoute = '/what-is-curyte'

export const privacyPolicyRoute = '/lessons/7VVYBD7pm450RvCG'

export const dataDeletionInstructionsRoute = '/lessons/HL9wDt63rC04bL2M'

export const discordInviteHref = 'https://discord.gg/Axd7QgGYF9'

export const searchRoute = (q: string) => `/search?q=${q}`
export const searchRouteHrefPath = `/search`

export const nextStepsRoute = (referrer = '') => {
  let out = '/next-steps'
  if (referrer) {
    out = `${out}?referrer=${referrer}`
  }
  return out
}

export const successRoute = '/success'

// -------------

export const getLessonLinkExternal = (uid: string) =>
  `http://${PROD_HOST_NAME}${lessonRoute(uid)}`

export const PROD_HOST_NAME = 'www.curyte.com'
