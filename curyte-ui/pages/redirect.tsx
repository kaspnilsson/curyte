import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import LoadingSpinner from '../components/LoadingSpinner'
import { useUser } from '../contexts/user'
import { exploreRoute, nextStepsRoute } from '../utils/routes'

const NewPathView = () => {
  const router = useRouter()
  const { userAndProfile, loading } = useUser()

  useEffect(() => {
    if (loading) return
    if (userAndProfile?.profile?.displayName) {
      // If user has name, they probably went thru the walkthrough
      router.push(exploreRoute)
    } else {
      router.push(nextStepsRoute)
    }
  }, [loading, router, userAndProfile])

  return <LoadingSpinner />
}

export default NewPathView
