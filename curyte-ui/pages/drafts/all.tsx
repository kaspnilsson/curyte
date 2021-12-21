import { useAuthState } from 'react-firebase-hooks/auth'
import React, { useEffect, useState } from 'react'
import { Lesson } from '../../interfaces/lesson'
import LoadingSpinner from '../../components/LoadingSpinner'
import { auth } from '../../firebase/clientApp'
import DraftLink from '../../components/DraftLink'
import { getDrafts } from '../../firebase/api'

const DraftsPage = () => {
  const [user, userLoading] = useAuthState(auth)
  const [drafts, setDrafts] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(userLoading)

  useEffect(() => {
    if (!user) return
    setLoading(true)

    getDrafts([{ fieldPath: 'authorId', opStr: '==', value: user.uid }]).then(
      (res) => {
        setLoading(false)
        setDrafts(res)
      }
    )
  }, [user])

  return (
    <>
      {loading && <LoadingSpinner />}
      {!loading && (
        <>
          {drafts.map((draft) => (
            <div className="mb-1" key={draft.uid}>
              <DraftLink draft={draft} />
            </div>
          ))}
          {!drafts.length && 'No drafts!'}
        </>
      )}
    </>
  )
}

export default DraftsPage
