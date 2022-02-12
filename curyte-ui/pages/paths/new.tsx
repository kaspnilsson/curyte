import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import LoadingSpinner from '../../components/LoadingSpinner'
import { loginRoute, editPathRoute } from '../../utils/routes'
import { createPath } from '../../firebase/api'
import { Path } from '../../interfaces/path'
import { Timestamp } from 'firebase/firestore'
import supabase from '../../supabase/client'

const NewPathView = () => {
  const router = useRouter()
  const user = supabase.auth.user()

  useEffect(() => {
    if (!user) {
      router.push(loginRoute(router.asPath))
      return
    }
    const createNewPath = async () => {
      const newUid = await createPath({
        authorId: user.id,
        created: Timestamp.now().toDate().toISOString(),
        updated: Timestamp.now().toDate().toISOString(),
      } as Path)
      router.replace(editPathRoute(newUid))
    }
    createNewPath()
  }, [router, router.query.copyFrom, user])

  return <LoadingSpinner message="Building path..." />
}

export default NewPathView
