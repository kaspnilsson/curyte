import React, { ReactNode, useState } from 'react'
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

const prepareTagStr = (str?: string): string[] =>
  (str || '').split(', ').map((s) => s.replace('#', '').trim())

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
    handleUpdate({ ...lesson, content: json })
  }, 100)

  const onCoverImageUpload = (url: string) => {
    setCoverImageUrl(url)
    handleUpdate({ ...lesson, coverImageUrl: url })
  }

  const editor = useCuryteEditor({ content, onUpdate: handleContentUpdate }, [
    lesson?.uid,
    handleContentUpdate,
  ])

  return (
    <Layout
      withFooter={false}
      withSearch={false}
      isSticky={false}
      sidebar={<LessonOutline editor={editor} />}
    >
      <div className="flex">
        <div className="flex flex-col flex-grow overflow-hidden">
          <div className="flex items-center justify-between w-full">
            <TextareaAutosize
              autoFocus
              className={`${computeClassesForTitle(
                title
              )} font-bold flex-grow resize-none tracking-tighter leading-tight border-0`}
              placeholder="Add a title..."
              value={title}
              onChange={({ target }) => {
                setTitle(target.value)
                handleUpdate({ ...lesson, title: target.value })
              }}
            />
          </div>
          <TextareaAutosize
            className="mt-1 text-2xl border-0 resize-none text-zinc-500"
            placeholder="Add a learning objective..."
            value={description}
            onChange={({ target }) => {
              setDescription(target.value)
              handleUpdate({ ...lesson, description: target.value })
            }}
          />
          <TextareaAutosize
            className="mt-4 text-xl border-0 resize-none"
            placeholder="Add a comma separated list of tags..."
            value={tagsStr}
            onChange={({ target }) => {
              setTagsStr(target.value)
              handleUpdate({
                ...lesson,
                tags: prepareTagStr(target.value),
              })
            }}
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
