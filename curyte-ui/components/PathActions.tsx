import { Button, Spinner, Tooltip } from '@chakra-ui/react'
import { TrashIcon, PencilAltIcon, EyeIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { deletePath } from '../firebase/api'
import { auth } from '../firebase/clientApp'
import { Path } from '../interfaces/path'
import { userIsAdmin } from '../utils/hacks'
import { editPathRoute, myAccountRoute, pathRoute } from '../utils/routes'

interface Props {
  path: Path
  isReadOnlyView?: boolean
}

const PathActions = ({ path, isReadOnlyView }: Props) => {
  const [loading, setLoading] = useState(false)
  const [user, userLoading] = useAuthState(auth)
  const router = useRouter()

  const handleDelete = async () => {
    if (!user || !user.uid) return
    try {
      setLoading(true)
      await deletePath(path.uid)

      router.push(myAccountRoute)
    } finally {
      setLoading(false)
    }
  }
  const handleEdit = () => {
    router.push(editPathRoute(path.uid))
  }
  const handleView = () => {
    router.push(pathRoute(path.uid))
  }

  if (userLoading) return <Spinner />
  return (
    <>
      {user && user.uid === path.authorId && isReadOnlyView && (
        <>
          <Tooltip label="Edit path">
            <Button
              className="flex items-center gap-2"
              disabled={loading}
              colorScheme="black"
              aria-label="Edit lesson"
              onClick={handleEdit}
            >
              <PencilAltIcon className="w-5 h-5" />
              Edit path
            </Button>
          </Tooltip>
        </>
      )}
      {!isReadOnlyView && (
        <Tooltip label="View path">
          <Button
            className="flex items-center gap-2"
            disabled={loading}
            colorScheme="black"
            aria-label="View path"
            onClick={handleView}
          >
            <EyeIcon className="w-5 h-5" />
            View path
          </Button>
        </Tooltip>
      )}
      {user && (user.uid === path.authorId || userIsAdmin(user.uid)) && (
        <>
          <Tooltip label="Delete path">
            <Button
              className="flex items-center gap-2"
              disabled={loading}
              colorScheme="black"
              aria-label="Delete path"
              onClick={handleDelete}
            >
              <TrashIcon className="w-5 h-5" />
              Delete path
            </Button>
          </Tooltip>
        </>
      )}
    </>
  )
}

export default PathActions
