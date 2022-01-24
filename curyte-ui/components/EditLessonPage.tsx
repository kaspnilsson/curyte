import React, { SyntheticEvent } from 'react'
import { UploadIcon, LockClosedIcon } from '@heroicons/react/solid'
import { Button, Spinner, Text } from '@chakra-ui/react'
import { Timestamp } from 'firebase/firestore'
import Container from './Container'

import { Lesson } from '../interfaces/lesson'
import { Author } from '../interfaces/author'
import LessonEditor from './LessonEditor'
import { CheckIcon, ExternalLinkIcon } from '@heroicons/react/outline'

type Props = {
  lesson?: Lesson
  user: Author
  saving: boolean
  dirty: boolean
  handleTogglePrivate: () => void
  handleUpdate: (l: Lesson) => void
  handlePreview?: () => void
}

const EditLessonPage = ({
  lesson,
  user,
  saving,
  dirty,
  handleTogglePrivate,
  handleUpdate,
  handlePreview,
}: Props) => {
  const makeNewLessonLocally = (l: Partial<Lesson>, u: Author): Lesson => ({
    ...lesson,
    content: l.content || null,
    description: l.description || '',
    tags: l.tags || [],
    title: l.title || '',
    authorName: u?.displayName || '',
    authorId: u?.uid || '',
    created: l?.created || Timestamp.now().toDate().toISOString(),
    updated: Timestamp.now().toDate().toISOString(),
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

  return (
    <LessonEditor lesson={lesson} handleUpdate={localHandleUpdate}>
      <footer className="fixed bottom-0 left-0 z-20 w-full h-16 bg-white border-t border-accent-2">
        <Container className="flex items-center justify-end h-full">
          <div className="flex items-center gap-2 mr-auto italic text-zinc-500">
            {saving && (
              <Text className="flex items-center gap-2">
                Saving... <Spinner />
              </Text>
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
          {handlePreview && (
            <Button
              variant="outline"
              onClick={() => handlePreview()}
              disabled={saving}
              colorScheme="black"
              className="flex items-center justify-between gap-2 mr-4 font-semibold disabled:opacity-50"
            >
              <ExternalLinkIcon className="w-5 h-5" />
              Preview
            </Button>
          )}
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
    </LessonEditor>
  )
}
export default EditLessonPage
