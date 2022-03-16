import React, { useMemo, useState } from 'react'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { debounce } from 'ts-debounce'
import ErrorPage from 'next/error'

import { loginRoute } from '../../../utils/routes'
import EditPathPage from '../../../components/EditPathPage'

import { withAuthRequired } from '@supabase/supabase-auth-helpers/nextjs'
import { Path } from '@prisma/client'
import prismaClient from '../../../lib/prisma'
import { useUserAndProfile } from '../../../contexts/user'

type Props = {
  id: string
  path?: Path
}

const EditPathView = (props: Props) => {
  const { userAndProfile, loading } = useUserAndProfile()
  const [path, setPath] = useState<Path | undefined>(props.path)
  const [savingPromise, setSavingPromise] = useState<Promise<unknown> | null>(
    null
  )
  const [dirty, setDirty] = useState(false)

  const debouncedUpdatePath = useMemo(
    () =>
      debounce(async (p: Path) => {
        if (!path?.uid) return
        p = {
          ...p,
          created: p?.created || new Date(),
          updated: new Date(),
        }
        const pathPromise = fetch(`/api/paths/${path.uid}`, {
          method: 'POST',
          body: JSON.stringify(p),
        })
        setSavingPromise(pathPromise)
        await pathPromise
        setPath(p)
        setSavingPromise(null)
      }, 500),
    [path]
  )

  const handleUpdate = async (l: Path) => {
    if (!l.uid) return
    if (savingPromise) await savingPromise
    setDirty(true)
    await debouncedUpdatePath(l)
    setDirty(false)
  }

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (!path || !userAndProfile?.profile) && (
        <ErrorPage statusCode={404} />
      )}
      {!loading && path && userAndProfile?.profile && (
        <EditPathPage
          path={path}
          saving={!!savingPromise}
          dirty={dirty}
          user={userAndProfile.profile}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  )
}

export const getServerSideProps = withAuthRequired({
  redirectTo: loginRoute(),
  getServerSideProps: async ({ query }) => {
    const id = query.id as string

    const path = await prismaClient.path.findFirst({
      where: { uid: id },
    })

    return {
      props: { id, path },
    }
  },
})

export default EditPathView
