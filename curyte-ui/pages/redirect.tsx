import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import LoadingSpinner from '../components/LoadingSpinner'
import { useUserAndProfile } from '../contexts/user'
import { nextStepsRoute, workspaceRoute } from '../utils/routes'

const NewPathView = () => {
  const router = useRouter()
  const { referrer } = router.query
  const { userAndProfile, loading } = useUserAndProfile()

  useEffect(() => {
    if (loading || !userAndProfile) return
    if (userAndProfile?.profile?.displayName) {
      // If user has name, they probably went thru the walkthrough
      router.push(referrer ? (referrer as string) : workspaceRoute)
    } else {
      // Drop referrer if user is new.
      router.push(nextStepsRoute())
    }
  }, [loading, referrer, router, userAndProfile])

  return <LoadingSpinner />
}

export default NewPathView
