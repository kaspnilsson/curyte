import React, { ReactNode, useEffect, useState } from 'react'
import { JSONContent } from '@tiptap/react'

import Layout from './Layout'
import { Lesson } from '../interfaces/lesson'
import { computeClassesForTitle } from './LessonTitle'
import TextareaAutosize from 'react-textarea-autosize'
import FancyEditor from './FancyEditor'
import { useDebounceCallback } from '@react-hook/debounce'
import EditableCoverImage from './EditableCoverImage'
import useCuryteEditor from '../hooks/useCuryteEditor'
import LessonOutline from './LessonOutline'

type Props = {
  lesson?: Lesson
  children?: ReactNode
  handleUpdate: (l: Partial<Lesson>) => void
}

const LessonEditor = ({ lesson, children, handleUpdate }: Props) => {
  const [title, setTitle] = useState(lesson?.title?.trim() || '')
  const [description, setDescription] = useState(
    lesson?.description?.trim() || ''
  )
  const [tagsStr, setTagsStr] = useState(lesson?.tags?.join(', ') || '')
  const [content, setContent] = useState(lesson?.content || null)
  const [coverImageUrl, setCoverImageUrl] = useState(
    lesson?.coverImageUrl || ''
  )

  const handleContentUpdate = useDebounceCallback((json: JSONContent) => {
    setContent(json)
  }, 100)

  const onCoverImageUpload = (url: string) => {
    // Unawaited
    setCoverImageUrl(url)
  }

  const editor = useCuryteEditor({ content, onUpdate: handleContentUpdate }, [
    lesson?.uid,
    handleContentUpdate,
  ])

  useEffect(() => {
    handleUpdate({
      ...lesson,
      title,
      description,
      tags: tagsStr.split(', '),
      content,
      coverImageUrl,
    })
    // Disable exhaustive deps so that we dont recompute lesson constantly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, coverImageUrl, description, tagsStr, title, lesson?.uid])

  return (
    <Layout
      withFooter={false}
      withSearch={false}
      isSticky={false}
      sidebar={<LessonOutline editor={editor} />}
    >
      <div className="flex">
        <div className="flex flex-col flex-grow px-5 overflow-hidden md:px-0">
          <div className="flex items-center justify-between w-full">
            <TextareaAutosize
              autoFocus
              className={`${computeClassesForTitle(
                title
              )} font-semibold flex-grow resize-none tracking-tight leading-tight border-0`}
              placeholder="Add a title..."
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <TextareaAutosize
            className="mt-1 text-2xl border-0 resize-none text-zinc-500"
            placeholder="Add a learning objective..."
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          />
          <TextareaAutosize
            className="mt-4 text-xl border-0 resize-none"
            placeholder="Add a comma separated list of tags..."
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
      {children}
    </Layout>
  )
}

export default LessonEditor
