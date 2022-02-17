import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import LoadingSpinner from '../../components/LoadingSpinner'
import { loginRoute, editPathRoute } from '../../utils/routes'

import supabase from '../../supabase/client'
import { Path } from '@prisma/client'
import { createPath } from '../../lib/apiHelpers'

const NewPathView = () => {
  const router = useRouter()
  const user = supabase.auth.user()

  useEffect(() => {
    if (!user) {
      router.push(loginRoute(router.asPath))
      return
    }
    const createNewPath = async () => {
      const { uid } = await createPath({
        authorId: user.id,
        created: new Date(),
        updated: new Date(),
      } as Path)
      router.replace(editPathRoute(uid))
    }
    createNewPath()
  }, [router, router.query.copyFrom, user])

  return <LoadingSpinner message="Building path..." />
}

export default NewPathView
