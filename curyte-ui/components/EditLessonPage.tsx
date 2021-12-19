import firebase from '../firebase/clientApp'
import React, { SyntheticEvent, useState } from 'react'
import { JSONContent } from '@tiptap/react'
import { UploadIcon } from '@heroicons/react/solid'
import { Button } from '@chakra-ui/react'

import Layout from './Layout'
import { Lesson } from '../interfaces/lesson'
import { Author } from '../interfaces/author'
import LoadingSpinner from './LoadingSpinner'
import { SaveIcon } from '@heroicons/react/outline'
import { computeClassesForTitle } from './LessonTitle'
import TextareaAutosize from 'react-textarea-autosize'
import FancyEditor from './FancyEditor'
import { useDebounceCallback } from '@react-hook/debounce'
import { draftPreviewRoute, draftRoute } from '../utils/routes'
// import * as api from '../firebase/api'
import EditableCoverImage from './EditableCoverImage'
import { useRouter } from 'next/router'
import useCuryteEditor from '../hooks/useCuryteEditor'
import LessonOutline from './LessonOutline'

type Props = {
  lesson?: Lesson
  user: Author
  handleSubmit: (l: Lesson) => Promise<void>
  handleSaveDraft?: (l: Lesson) => Promise<string>
}

const EditLessonPage = ({
  lesson,
  user,
  handleSubmit,
  handleSaveDraft,
}: Props) => {
  const router = useRouter()
  const [title, setTitle] = useState(lesson?.title.trim() || '')
  const [description, setDescription] = useState(
    lesson?.description.trim() || ''
  )
  const [tagsStr, setTagsStr] = useState(lesson?.tags?.join(', ') || '')
  const [content, setContent] = useState(lesson?.content || null)
  const [coverImageUrl, setCoverImageUrl] = useState(
    lesson?.coverImageUrl || ''
  )
  const [saving, setSaving] = useState(false)

  const canSubmit = !!(title && description && content)

  const makeNewLessonLocally = () => ({
    ...lesson,
    title,
    tags: tagsStr.split(',').map((t) => t.trim()),
    description,
    authorName: user?.displayName || '',
    authorId: user?.uid || '',
    content,
    created:
      lesson?.created ||
      firebase.firestore.Timestamp.now().toDate().toISOString(),
    updated: firebase.firestore.Timestamp.now().toDate().toISOString(),
    saveCount: 0,
    viewCount: 0,
    uid: lesson?.uid || '',
    coverImageUrl,
  })

  const localHandleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    if (!user || !content) return
    try {
      setSaving(true)
      await handleSubmit(makeNewLessonLocally())
    } finally {
      setSaving(false)
    }
  }

  const localHandleSaveDraft = async (event: SyntheticEvent) => {
    event.preventDefault()
    if (!user || !handleSaveDraft) return
    // UID set by API module
    const uid = await handleSaveDraft(makeNewLessonLocally())
    router.push(draftRoute(uid))
  }

  const localHandlePreview = async (event: SyntheticEvent) => {
    event.preventDefault()
    if (!user || !handleSaveDraft) return
    try {
      const uid = await handleSaveDraft(makeNewLessonLocally())
      router.push(draftPreviewRoute(uid))
    } finally {
      setSaving(false)
    }
  }

  const onUpdate = useDebounceCallback((json: JSONContent) => {
    setContent(json)
  }, 100)

  const onCoverImageUpload = (url: string) => {
    // Unawaited
    setCoverImageUrl(url)
  }

  const editor = useCuryteEditor({ content, onUpdate }, [lesson, onUpdate])

  if (saving) return <LoadingSpinner />
  return (
    <Layout
      withFooter={false}
      isSticky={false}
      sidebar={<LessonOutline editor={editor} />}
    >
      <div className="flex">
        <div className="flex flex-col flex-grow px-5 md:px-0 overflow-hidden">
          <div className="flex items-center justify-between w-full">
            <TextareaAutosize
              autoFocus
              className={`${computeClassesForTitle(
                title
              )} font-semibold flex-grow resize-none tracking-tight leading-tight border-0`}
              placeholder="Enter title..."
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <TextareaAutosize
            className="text-2xl mt-1 text-gray-500 resize-none border-0"
            placeholder="Enter description..."
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          />
          <TextareaAutosize
            className="text-xl mt-4 resize-none border-0"
            placeholder="Enter a comma separated list of tags..."
            value={tagsStr}
            onChange={({ target }) => setTagsStr(target.value)}
          />
          <EditableCoverImage
            title={lesson?.title || ''}
            src={coverImageUrl}
            onEditUrl={onCoverImageUpload}
          />
          <div className="flex py-8">
            <FancyEditor editor={editor} />
          </div>
        </div>
      </div>
      <footer className="bg-white border-t border-accent-2 bottom-0 left-0 fixed w-full h-24 z-20">
        <div className="h-full m-auto w-full lg:w-2/3 flex items-center justify-end">
          {handleSaveDraft && (
            <Button
              variant="link"
              size="sm"
              onClick={localHandlePreview}
              colorScheme="purple"
              className="disabled:opacity-50 font-semibold flex items-center justify-between mr-4"
            >
              Preview
            </Button>
          )}
          {handleSaveDraft && (
            <Button
              variant="outline"
              className="disabled:opacity-50 font-semibold flex items-center justify-between mr-4"
              disabled={!title}
              onClick={localHandleSaveDraft}
            >
              <SaveIcon className="h-5 w-5 mr-2" />
              Save as draft
            </Button>
          )}
          <Button
            colorScheme="purple"
            disabled={!canSubmit}
            className="disabled:opacity-50 font-semibold flex items-center justify-between"
            onClick={localHandleSubmit}
          >
            <UploadIcon className="h-5 w-5 mr-2" />
            Publish
          </Button>
        </div>
      </footer>
    </Layout>
  )
}

export default EditLessonPage
