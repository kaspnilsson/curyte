import { auth } from '../../firebase/clientApp'
import React, { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/router'
import LoadingSpinner from '../../components/LoadingSpinner'
import { loginRoute, pathEditRoute } from '../../utils/routes'
import { createPath } from '../../firebase/api'
import { Path } from '../../interfaces/path'

const NewPathView = () => {
  const router = useRouter()
  const [user, userLoading] = useAuthState(auth)

  useEffect(() => {
    if (userLoading) return
    if (!user) {
      router.push(loginRoute(router.asPath))
      return
    }
    const createNewPath = async () => {
      const newUid = await createPath({ authorId: user.uid } as Path)
      router.replace(pathEditRoute(newUid))
    }
    createNewPath()
  }, [router, router.query.copyFrom, user, userLoading])

  return <LoadingSpinner />
}

export default NewPathView
