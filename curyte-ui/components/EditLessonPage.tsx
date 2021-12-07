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
import { draftPreviewRoute, draftPreviewRouteHrefPath } from '../utils/routes'
import Link from 'next/link'
import * as api from '../firebase/api'
import EditableCoverImage from './EditableCoverImage'

type Props = {
  lesson?: Lesson
  user: Author
  handleSubmit: (l: Lesson) => Promise<void>
  handleSaveDraft: (l: Lesson) => Promise<void>
}

const EditLessonPage = ({
  lesson,
  user,
  handleSubmit,
  handleSaveDraft,
}: Props) => {
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

  const localHandleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    if (!user || !content) return
    try {
      const newLesson = {
        ...lesson,
        title,
        tags: tagsStr.split(',').map((t) => t.trim()),
        description,
        authorName: user?.displayName || '',
        authorId: user?.uid || '',
        content,
        saveCount: 0,
        viewCount: 0,
        created:
          lesson?.created ||
          firebase.firestore.Timestamp.now().toDate().toISOString(),
        updated: firebase.firestore.Timestamp.now().toDate().toISOString(),
        uid: lesson?.uid || '',
        coverImageUrl,
      }
      setSaving(true)
      await handleSubmit(newLesson)
    } finally {
      setSaving(false)
    }
  }

  const localHandleSaveDraft = async (event: SyntheticEvent) => {
    event.preventDefault()
    if (!user) return
    const newLesson = {
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
    }
    // UID set by API module
    await handleSaveDraft(newLesson)
  }

  const onUpdate = useDebounceCallback((json: JSONContent) => {
    setContent(json)
  }, 100)

  const onCoverImageUpload = (url: string) => {
    // Unawaited
    if (coverImageUrl) api.deleteImageAtUrl(coverImageUrl)
    setCoverImageUrl(url)
  }

  if (saving) return <LoadingSpinner />
  return (
    <Layout withFooter={false}>
      <div className="flex flex-col flex-grow overflow-y-auto">
        <div className="flex items-center justify-between w-full">
          <TextareaAutosize
            autoFocus
            className={`${computeClassesForTitle(
              title
            )} focus:outline-none font-semibold flex-grow resize-none tracking-tight md:tracking-tighter leading-tight`}
            placeholder="Enter title..."
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <TextareaAutosize
          className="text-2xl focus:outline-none mt-1 text-gray-500 resize-none"
          placeholder="Enter description..."
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextareaAutosize
          className="text-xl focus:outline-none mt-4 resize-none"
          placeholder="Enter a comma separated list of tags..."
          value={tagsStr}
          onChange={({ target }) => setTagsStr(target.value)}
        />
        <EditableCoverImage
          title={lesson?.title || ''}
          src={coverImageUrl}
          onEditUrl={onCoverImageUpload}
        />
        <div className="flex flex-col py-8">
          <FancyEditor content={content} onUpdate={onUpdate} />
        </div>
      </div>
      <footer className="bg-white border-t border-accent-2 bottom-0 left-0 fixed w-full h-24 z-10">
        <div className="h-full m-auto w-full lg:w-2/3 flex items-center justify-end">
          {lesson?.uid && (
            <Link
              href={draftPreviewRouteHrefPath}
              as={draftPreviewRoute(lesson?.uid || '')}
              passHref
            >
              <Button
                variant="link"
                size="sm"
                colorScheme="purple"
                className="disabled:opacity-50 font-semibold flex items-center justify-between mr-4"
              >
                Preview
              </Button>
            </Link>
          )}
          <Button
            variant="outline"
            className="disabled:opacity-50 font-semibold flex items-center justify-between mr-4"
            disabled={!title}
            onClick={localHandleSaveDraft}
          >
            <SaveIcon className="h-5 w-5 mr-2" />
            Save as draft
          </Button>
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
