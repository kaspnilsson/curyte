import React, { SyntheticEvent } from 'react'
import { UploadIcon, LockClosedIcon } from '@heroicons/react/solid'
import {
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { Timestamp } from 'firebase/firestore'
import Container from './Container'
import LessonEditor from './LessonEditor'
import {
  CheckIcon,
  CogIcon,
  DocumentRemoveIcon,
  ExternalLinkIcon,
} from '@heroicons/react/outline'
import useConfirmDialog from '../hooks/useConfirmDialog'
import { Lesson, Profile } from '@prisma/client'

type Props = {
  lesson?: Lesson
  user: Profile
  saving: boolean
  dirty: boolean
  handleTogglePrivate: () => void
  handleUpdate: (l: Lesson) => void
  handlePreview?: () => void
  handleDelete?: () => void
}

const EditLessonPage = ({
  lesson,
  user,
  saving,
  dirty,
  handleTogglePrivate,
  handleUpdate,
  handlePreview,
  handleDelete,
}: Props) => {
  const makeNewLessonLocally = (l: Partial<Lesson>, u: Profile): Lesson => ({
    ...lesson,
    private: l.private || true,
    featured: false,
    template: false,
    parentLessonId: '',
    content: l.content || null,
    description: l.description || '',
    tags: l.tags || [],
    title: l.title || '',
    authorId: u?.uid || '',
    created: l?.created || Timestamp.now().toDate(),
    updated: Timestamp.now().toDate(),
    saveCount: 0,
    viewCount: 0,
    uid: l?.uid || '',
    coverImageUrl: l?.coverImageUrl || '',
  })

  const localHandleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    handleTogglePrivate()
  }

  const localHandleUpdate = async (l: Partial<Lesson>) => {
    const newLesson = makeNewLessonLocally(l, user)
    handleUpdate(newLesson)
  }

  const canPublish = lesson && lesson.content && lesson.title

  const { ConfirmDialog, onOpen } = useConfirmDialog({
    title: 'Delete lesson',
    body: 'Are you sure you want to delete this lesson?',
    confirmText: 'Delete lesson',
    onConfirmClick: handleDelete || (() => null),
  })

  return (
    <LessonEditor
      lesson={lesson}
      handleUpdate={localHandleUpdate}
      stickyFooter={
        <footer className="fixed bottom-0 left-0 z-20 w-full h-16 ml-0 bg-white border-t md:pl-48 xl:pl-64">
          <Container className="flex items-center justify-end h-full">
            <div className="flex items-center gap-2 mr-auto italic text-zinc-500">
              {saving && (
                <>
                  <Text className="flex items-center gap-2">Saving...</Text>
                  <Spinner />
                </>
              )}
              {dirty && !saving && (
                <>
                  <Text>Unsaved changes...</Text>
                </>
              )}
              {!dirty && !saving && (
                <>
                  <CheckIcon className="w-5 h-5" />
                  <Text>Autosaved!</Text>
                </>
              )}
            </div>
            <Menu>
              <MenuButton
                as={IconButton}
                className="mr-4"
                aria-label="Settings"
                icon={<CogIcon className="w-6 h-6" />}
                variant="ghost"
              />
              <MenuList>
                {handlePreview && (
                  <MenuItem
                    icon={
                      <ExternalLinkIcon className="w-5 h-5 text-zinc-700" />
                    }
                    onClick={() => handlePreview()}
                    disabled={saving}
                  >
                    Preview
                  </MenuItem>
                )}
                {handleDelete && (
                  <MenuItem
                    icon={
                      <DocumentRemoveIcon className="w-5 h-5 text-zinc-700" />
                    }
                    onClick={onOpen}
                    disabled={saving}
                  >
                    Delete lesson
                  </MenuItem>
                )}
                {/* <MenuItem icon={<ExternalLinkIcon />} command="⌘N">
                  New Window
                </MenuItem>
                <MenuItem icon={<RepeatIcon />} command="⌘⇧N">
                  Open Closed Tab
                </MenuItem>
                <MenuItem icon={<EditIcon />} command="⌘O">
                  Open File...
                </MenuItem> */}
              </MenuList>
            </Menu>
            {lesson?.private && (
              <Button
                colorScheme="black"
                disabled={saving || !canPublish}
                className="flex items-center justify-between font-semibold disabled:opacity-50"
                onClick={localHandleSubmit}
              >
                <UploadIcon className="w-5 h-5 mr-2" />
                Publish
              </Button>
            )}
            {!lesson?.private && (
              <Button
                colorScheme="black"
                disabled={saving}
                className="flex items-center justify-between font-semibold disabled:opacity-50"
                onClick={localHandleSubmit}
              >
                <LockClosedIcon className="w-5 h-5 mr-2" />
                Make private
              </Button>
            )}
          </Container>
        </footer>
      }
    >
      <ConfirmDialog />
    </LessonEditor>
  )
}
export default EditLessonPage
