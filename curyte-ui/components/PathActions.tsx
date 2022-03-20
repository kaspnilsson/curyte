import { IconButton, Tooltip } from '@chakra-ui/react'
import { TrashIcon, PencilAltIcon, EyeIcon } from '@heroicons/react/outline'
import { Path } from '@prisma/client'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useUserAndProfile } from '../contexts/user'
import useConfirmDialog from '../hooks/useConfirmDialog'
import { deletePath } from '../lib/apiHelpers'
import { userIsAdmin } from '../utils/hacks'
import { editPathRoute, workspaceRoute, pathRoute } from '../utils/routes'

interface Props {
  path: Path
  isReadOnlyView?: boolean
}

const PathActions = ({ path, isReadOnlyView }: Props) => {
  const [loading, setLoading] = useState(false)
  const { userAndProfile } = useUserAndProfile()
  const user = userAndProfile?.user
  const router = useRouter()

  const handleDelete = async () => {
    if (!userAndProfile || !userAndProfile?.user) return
    try {
      setLoading(true)
      await deletePath(path.uid)

      router.push(workspaceRoute)
    } finally {
      setLoading(false)
    }
  }

  const { ConfirmDialog, onOpen } = useConfirmDialog({
    title: 'Delete path',
    body: 'Are you sure you want to delete this path?',
    confirmText: 'Delete path',
    onConfirmClick: handleDelete,
  })
  const handleEdit = () => {
    router.push(editPathRoute(path.uid))
  }
  const handleView = () => {
    router.push(pathRoute(path.uid))
  }

  return (
    <>
      <ConfirmDialog />
      {user && user.id === path.authorId && isReadOnlyView && (
        <>
          <Tooltip label="Edit path">
            <IconButton
              borderRadius="full"
              size="sm"
              className="flex items-center gap-2"
              disabled={loading}
              aria-label="Edit lesson"
              onClick={handleEdit}
              icon={<PencilAltIcon className="w-5 h-5" />}
            ></IconButton>
          </Tooltip>
        </>
      )}
      {!isReadOnlyView && (
        <Tooltip label="View path">
          <IconButton
            borderRadius="full"
            size="sm"
            className="flex items-center gap-2"
            disabled={loading}
            aria-label="View path"
            onClick={handleView}
            icon={<EyeIcon className="w-5 h-5" />}
          ></IconButton>
        </Tooltip>
      )}
      {user && (user.id === path.authorId || userIsAdmin(user.id)) && (
        <>
          <Tooltip label="Delete path">
            <IconButton
              borderRadius="full"
              size="sm"
              className="flex items-center gap-2"
              disabled={loading}
              aria-label="Delete path"
              onClick={onOpen}
              icon={<TrashIcon className="w-5 h-5" />}
            ></IconButton>
          </Tooltip>
        </>
      )}
    </>
  )
}

export default PathActions
