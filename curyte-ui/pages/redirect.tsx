import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import LoadingSpinner from '../components/LoadingSpinner'
import { useUserAndProfile } from '../contexts/user'
import { nextStepsRoute, workspaceRoute } from '../utils/routes'
import { Button } from '@chakra-ui/react'

const Redirect = () => {
  const router = useRouter()
  const { referrer } = router.query
  const { userAndProfile, loading, logout, error } = useUserAndProfile()
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!userAndProfile && error) {
      setTimeout(() => setShowError(true), 5000)
    }
    if (userAndProfile?.profile?.displayName) {
      // If user has name, they probably went thru the walkthrough
      router.push(referrer ? (referrer as string) : workspaceRoute)
    } else {
      // Drop referrer if user is new.
      router.push(nextStepsRoute())
    }
  }, [error, loading, logout, referrer, router, userAndProfile])

  return (
    <div>
      <LoadingSpinner />
      {showError && logout && (
        <div className="fixed z-20 flex flex-col items-end gap-2 transition-all bottom-4 right-4">
          <span className="text-red-500">{error?.message}</span>
          <Button className="w-fit" onClick={logout}>
            Log out
          </Button>
        </div>
      )}
    </div>
  )
}

export default Redirect
