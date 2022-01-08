import React, { useEffect, useState } from 'react'
import { auth } from '../../../firebase/clientApp'
import { GetServerSideProps } from 'next'
import { Author } from '../../../interfaces/author'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/router'
import LoadingSpinner from '../../../components/LoadingSpinner'
import { debounce } from 'ts-debounce'
import ErrorPage from 'next/error'

import { loginRoute, newPathRoute } from '../../../utils/routes'
import { getPath, updatePath } from '../../../firebase/api'
import { Path } from '../../../interfaces/path'
import EditPathPage from '../../../components/EditPathPage'
import { exception } from '../../../utils/gtag'

type Props = {
  id: string
}

const EditPathView = ({ id }: Props) => {
  const router = useRouter()
  const [user, userLoading] = useAuthState(auth)
  const [loading, setLoading] = useState(true)
  const [path, setPath] = useState<Path | undefined>()
  const [savingPromise, setSavingPromise] = useState<Promise<void> | null>(null)

  useEffect(() => {
    if (!user && !userLoading) {
      router.push(loginRoute(router.asPath))
      return
    }
  })

  useEffect(() => {
    if (!user || userLoading) return
    const fetchPath = async () => {
      let d
      try {
        d = await getPath(id)
        if (!d) {
          router.replace(newPathRoute)
        }
      } catch (e) {
        exception(e as string)
      } finally {
        setPath(d)
        setLoading(false)
      }
    }
    setLoading(true)
    fetchPath()
  }, [id, router, user, userLoading])

  //   const handleSubmit = async () => {
  //     if (savingPromise) await savingPromise
  //     if (!path) return
  //     const uid = await publishPath(path, path.uid)
  //     router.push(lessonRoute(uid))
  //   }

  const debouncedUpdatePath = debounce(async (l: Path) => {
    const p = updatePath(l)
    setSavingPromise(p)
    await p
    setPath(l)
    setSavingPromise(null)
  }, 500)

  const handleUpdate = async (l: Path) => {
    if (loading || !l.uid) return
    if (savingPromise) await savingPromise
    await debouncedUpdatePath(l)
  }

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && !path && <ErrorPage statusCode={404} />}
      {!loading && path && (
        <EditPathPage
          path={path}
          saving={!!savingPromise}
          user={user as unknown as Author}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: { id: query.id as string },
  }
}

export default EditPathView