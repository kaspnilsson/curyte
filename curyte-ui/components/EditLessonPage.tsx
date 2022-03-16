import React, { SyntheticEvent, useEffect, useState } from 'react'
import { UploadIcon, LockClosedIcon } from '@heroicons/react/solid'
import { Button, IconButton, Spinner, Text, Tooltip } from '@chakra-ui/react'

import Container from './Container'
import LessonEditor, { initialLessonContent } from './LessonEditor'
import { CheckIcon, TrashIcon, EyeIcon } from '@heroicons/react/outline'
import useConfirmDialog from '../hooks/useConfirmDialog'
import { Lesson, Profile } from '@prisma/client'
import LessonEditorHints from './LessonEditorHints'
import EditorHelpMenu from './EditorHelpMenu'

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
  const [shouldShowHints, setShowHints] = useState(false)
  const makeNewLessonLocally = (l: Partial<Lesson>, u: Profile): Lesson => ({
    ...lesson,
    private: l.private || true,
    featured: false,
    template: false,
    parentLessonId: '',
    content: l.content || initialLessonContent,
    description: l.description || '',
    tags: l.tags || [],
    title: l.title || '',
    authorId: u?.uid || '',
    created: l?.created || new Date(),
    updated: new Date(),
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

  useEffect(() => {
    const hideShowHints = localStorage.getItem('hideEditorHints')
    setShowHints(!hideShowHints)
  }, [])

  const hideHints = () => {
    setShowHints(false)
    localStorage.setItem('hideEditorHints', 'true')
  }

  const showHints = () => {
    setShowHints(true)
    localStorage.removeItem('hideEditorHints')
  }

  return (
    <LessonEditor
      lesson={lesson}
      handleUpdate={localHandleUpdate}
      stickyFooter={
        <footer className="sticky bottom-0 z-20 self-start w-full pl-0 ml-0 bg-white border-t">
          {shouldShowHints && (
            <div className="w-full">
              <LessonEditorHints onHide={hideHints} />
            </div>
          )}
          <Container className="flex items-center justify-end h-16 gap-1">
            <div className="flex flex-wrap items-center gap-2 mr-auto italic text-zinc-600">
              {saving && (
                <>
                  <Spinner />
                  <Text>Saving...</Text>
                </>
              )}
              {dirty && !saving && (
                <>
                  <Text>Unsaved changes...</Text>
                </>
              )}
              {!dirty && !saving && (
                <>
                  <CheckIcon className="w-6 h-6" />
                  <Text>Autosaved!</Text>
                </>
              )}
            </div>
            {handlePreview && (
              <Tooltip label="Preview lesson">
                <IconButton
                  variant="ghost"
                  icon={<EyeIcon className="w-6 h-6 text-zinc-900" />}
                  onClick={() => handlePreview()}
                  disabled={saving}
                  label="Preview"
                  aria-label="Preview"
                ></IconButton>
              </Tooltip>
            )}
            {handleDelete && (
              <Tooltip label="Delete lesson">
                <IconButton
                  variant="ghost"
                  icon={<TrashIcon className="w-6 h-6 text-zinc-900" />}
                  onClick={onOpen}
                  disabled={saving}
                  label="Delete lesson"
                  aria-label="Delete lesson"
                ></IconButton>
              </Tooltip>
            )}
            <EditorHelpMenu showHints={showHints} />
            {lesson?.private && (
              <Tooltip label="Publish">
                <Button
                  colorScheme="black"
                  disabled={saving || !canPublish}
                  className="flex items-center justify-between gap-2 font-semibold disabled:opacity-60"
                  onClick={localHandleSubmit}
                >
                  <UploadIcon className="w-5 h-5" />
                  <div className="hidden md:flex">Publish</div>
                </Button>
              </Tooltip>
            )}
            {!lesson?.private && (
              <Tooltip label="Make private">
                <Button
                  colorScheme="black"
                  disabled={saving}
                  className="flex items-center justify-between gap-2 font-semibold disabled:opacity-60"
                  onClick={localHandleSubmit}
                >
                  <LockClosedIcon className="w-5 h-5" />
                  <div className="hidden md:flex">Make private</div>
                </Button>
              </Tooltip>
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
