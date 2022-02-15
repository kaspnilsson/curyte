import React, { ReactNode, useState } from 'react'
import { JSONContent } from '@tiptap/react'

import Layout from './Layout'
import { computeClassesForTitle } from './LessonTitle'
import TextareaAutosize from 'react-textarea-autosize'
import FancyEditor from './FancyEditor'
import { useDebounceCallback } from '@react-hook/debounce'
import EditableCoverImage from './EditableCoverImage'
import useCuryteEditor from '../hooks/useCuryteEditor'
import LessonOutline from './LessonOutline'
import { uuid } from '../utils/uuid'
import EditorHelpMenu from './EditorHelpMenu'
import {
  editLessonRoute,
  editLessonRouteHrefPath,
  workspaceRoute,
} from '../utils/routes'
import { Lesson } from '@prisma/client'

type Props = {
  lesson?: Lesson
  children?: ReactNode
  handleUpdate: (l: Partial<Lesson>) => void
  stickyFooter: ReactNode
}

const prepareTagStr = (str?: string): string[] =>
  (str || '').split(', ').map((s) => s.replace('#', '').trim())

const LessonEditor = ({
  lesson,
  children,
  handleUpdate,
  stickyFooter,
}: Props) => {
  const [title, setTitle] = useState(lesson?.title?.trim() || '')
  const [description, setDescription] = useState(
    lesson?.description?.trim() || ''
  )
  const [tagsStr, setTagsStr] = useState(lesson?.tags?.join(', ') || '')
  const [content, setContent] = useState(
    lesson?.content || {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { id: uuid(), level: 1 },
        },
        { type: 'paragraph' },
      ],
    }
  )
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

  const editor = useCuryteEditor(
    {
      content: content ? (content as JSONContent) : null,
      onUpdate: handleContentUpdate,
    },
    [lesson?.uid, handleContentUpdate]
  )

  return (
    <Layout
      footer={stickyFooter}
      rightContent={
        <div className="flex flex-col gap-8 mb-4">
          <LessonOutline editor={editor} />
          <div className="flex flex-col items-start w-full">
            <EditorHelpMenu />
          </div>
        </div>
      }
      rightContentWrapBehavior="reverse"
      breadcrumbs={[
        {
          label: 'Workspace',
          href: workspaceRoute,
          as: workspaceRoute,
        },
        {
          label: `Edit ${lesson?.title || 'lesson'}`,
          href: editLessonRouteHrefPath,
          as: editLessonRoute(lesson?.uid || ''),
        },
      ]}
    >
      <div className="flex">
        <div className="flex flex-col flex-grow min-w-0 md:ml-10 lg:ml-0">
          <div className="flex items-center justify-between w-full ">
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
          <div className="py-8">
            <FancyEditor editor={editor} />
          </div>
        </div>
      </div>
      {children}
    </Layout>
  )
}

export default LessonEditor
