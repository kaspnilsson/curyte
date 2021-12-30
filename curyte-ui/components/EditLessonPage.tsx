import React, { SyntheticEvent, useState } from 'react'
import { UploadIcon } from '@heroicons/react/solid'
import { Button, Text } from '@chakra-ui/react'
import { Timestamp } from 'firebase/firestore'

import { Lesson } from '../interfaces/lesson'
import { Author } from '../interfaces/author'
import LoadingSpinner from './LoadingSpinner'
import LessonEditor from './LessonEditor'
import { CheckIcon } from '@heroicons/react/outline'

type Props = {
  lesson?: Lesson
  user: Author
  handleSubmit: () => Promise<void>
  handleUpdate: (l: Lesson) => Promise<void>
  handlePreview?: () => Promise<void>
}

const EditLessonPage = ({
  lesson,
  user,
  handleSubmit,
  handleUpdate,
  handlePreview,
}: Props) => {
  const [saving, setSaving] = useState(false)
  const [autosaving, setAutosaving] = useState(false)

  const makeNewLessonLocally = (l: Partial<Lesson>, u: Author): Lesson => ({
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
    try {
      setSaving(true)
      await handleSubmit()
    } finally {
      setSaving(false)
    }
  }

  const localHandleUpdate = async (l: Partial<Lesson>) => {
    setAutosaving(true)
    const newLesson = makeNewLessonLocally(l, user)
    await handleUpdate(newLesson)
    setAutosaving(false)
  }

  const canPublish = lesson && lesson.content && lesson.title

  if (saving) return <LoadingSpinner />
  return (
    <LessonEditor lesson={lesson} handleUpdate={localHandleUpdate}>
      <footer className="fixed bottom-0 left-0 z-20 w-full h-16 bg-white border-t border-accent-2">
        <div className="flex items-center justify-end w-full h-full px-5 m-auto lg:w-2/3">
          <div className="flex items-center gap-2 mr-auto italic text-zinc-500">
            {autosaving && (
              <>
                <Text>Unsaved changes...</Text>
              </>
            )}
            {!autosaving && (
              <>
                <CheckIcon className="w-5 h-5" />
                <Text>Autosaved!</Text>
              </>
            )}
          </div>
          {handlePreview && (
            <Button
              variant="link"
              size="sm"
              onClick={() => handlePreview()}
              colorScheme="zinc"
              className="flex items-center justify-between mr-4 font-semibold disabled:opacity-50"
            >
              Preview
            </Button>
          )}
          <Button
            colorScheme="black"
            disabled={saving || !canPublish}
            className="flex items-center justify-between font-semibold disabled:opacity-50"
            onClick={localHandleSubmit}
          >
            <UploadIcon className="w-5 h-5 mr-2" />
            Publish
          </Button>
        </div>
      </footer>
    </LessonEditor>
  )
}
export default EditLessonPage
