import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import LoadingSpinner from '../components/LoadingSpinner'
import { useUserAndProfile } from '../contexts/user'
import { loginRoute, nextStepsRoute, workspaceRoute } from '../utils/routes'

const Redirect = () => {
  const router = useRouter()
  const { referrer } = router.query
  const { userAndProfile, loading, logout } = useUserAndProfile()

  useEffect(() => {
    if (loading) return
    debugger
    if (!userAndProfile) {
      console.log('not logged in')
      if (logout) {
        logout()
        console.log('logout fn found, logging out')
      }
      router.push(loginRoute())
      return
    }
    if (userAndProfile?.profile?.displayName) {
      // If user has name, they probably went thru the walkthrough
      router.push(referrer ? (referrer as string) : workspaceRoute)
    } else {
      // Drop referrer if user is new.
      router.push(nextStepsRoute())
    }
  }, [loading, logout, referrer, router, userAndProfile])

  return <LoadingSpinner />
}

export default Redirect
