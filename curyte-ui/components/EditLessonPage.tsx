import firebase from '../firebase/clientApp'
import React, { SyntheticEvent, useReducer, useState } from 'react'
import { UploadIcon } from '@heroicons/react/solid'
import { Button } from '@chakra-ui/react'

import Container from './Container'
import Layout from './Layout'
import LessonSectionEditor from './LessonSectionEditor'
import { LessonSection, LessonStorageModel } from '../interfaces/lesson'
import { Author } from '../interfaces/author'
import LoadingSpinner from './LoadingSpinner'
import { SaveIcon } from '@heroicons/react/outline'
import { computeClassesForTitle } from './LessonTitle'
import TextareaAutosize from 'react-textarea-autosize'

type Props = {
  lesson?: LessonStorageModel
  user: Author
  handleSubmit: (l: LessonStorageModel) => Promise<void>
  handleSaveDraft: (l: LessonStorageModel) => Promise<void>
}

const initialState = { sections: [{ title: '', content: '' }] }

enum LessonSectionActionType {
  ADD = 'ADD',
  EDIT = 'EDIT',
  REMOVE = 'REMOVE',
}

// An interface for our actions
interface LessonSectionAction {
  type: LessonSectionActionType
  payload?: {
    index?: number
    section?: LessonSection
  }
}

interface LessonSectionState {
  sections: LessonSection[]
}

function reducer(state: LessonSectionState, action: LessonSectionAction) {
  switch (action.type) {
    case LessonSectionActionType.ADD: {
      return {
        ...state,
        sections: [...state.sections, { title: '', content: '' }],
      }
    }
    case LessonSectionActionType.EDIT: {
      if (
        !action.payload ||
        action.payload.index === undefined ||
        action.payload.section === undefined
      ) {
        throw new Error('Invalid payload for action: ' + action)
      }
      const sections = [...state.sections]
      sections[action.payload.index] = action.payload.section
      return {
        ...state,
        sections,
      }
    }
    case LessonSectionActionType.REMOVE: {
      if (!action.payload || action.payload.index === undefined) {
        throw new Error('Invalid payload for action: ' + action)
      }
      const sections = [...state.sections]
      sections.splice(action.payload.index, 1)
      return {
        ...state,
        sections,
      }
    }
    default:
      throw new Error()
  }
}

const EditLessonPage = ({
  lesson,
  user,
  handleSubmit,
  handleSaveDraft,
}: Props) => {
  const [title, setTitle] = useState(lesson?.title.trim() || '')
  const [saving, setSaving] = useState(false)
  const [description, setDescription] = useState(
    lesson?.description.trim() || ''
  )
  const [state, dispatch] = useReducer(reducer, lesson || initialState)

  const canSubmit = !!(
    title &&
    description &&
    state.sections.length &&
    state.sections.every((section) => section.content)
  )

  const localHandleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault()
    if (!user) return
    try {
      const newLesson = {
        ...lesson,
        title,
        description,
        authorName: user?.displayName || '',
        authorId: user?.uid || '',
        sections: state.sections,
        saveCount: 0,
        viewCount: 0,
        created:
          lesson?.created ||
          firebase.firestore.Timestamp.now().toDate().toISOString(),
        updated: firebase.firestore.Timestamp.now().toDate().toISOString(),
        published: true,
        uid: '',
      }
      setSaving(true)
      // UID set by API module
      await handleSubmit(newLesson)
    } finally {
      setSaving(false)
    }
  }

  const localHandleSaveDraft = async (event: SyntheticEvent) => {
    event.preventDefault()
    if (!user) return
    try {
      const newLesson = {
        ...lesson,
        title,
        description,
        authorName: user?.displayName || '',
        authorId: user?.uid || '',
        sections: state.sections,
        created:
          lesson?.created ||
          firebase.firestore.Timestamp.now().toDate().toISOString(),
        updated: firebase.firestore.Timestamp.now().toDate().toISOString(),
        published: false,
        uid: '',
        saveCount: 0,
        viewCount: 0,
      }
      setSaving(true)
      // UID set by API module
      await handleSaveDraft(newLesson)
    } finally {
      setSaving(false)
    }
  }

  if (saving) return <LoadingSpinner />
  return (
    <Layout withFooter={false}>
      <Container>
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
          <div className="flex flex-col pb-16">
            {state.sections.map((section, index) => (
              <div className="border-t border-gray-200 pt-8 mt-8" key={index}>
                <LessonSectionEditor
                  section={section}
                  onDelete={
                    index !== 0
                      ? () => {
                          dispatch({
                            type: LessonSectionActionType.REMOVE,
                            payload: { index },
                          })
                        }
                      : undefined
                  }
                  onChange={(section) => {
                    dispatch({
                      type: LessonSectionActionType.EDIT,
                      payload: { section, index },
                    })
                  }}
                />
              </div>
            ))}
            {/* <Button
              variant="outline"
              className="mt-4 font-semibold py-2 px-4 m-auto flex items-center justify-between"
              onClick={() =>
                dispatch({
                  type: LessonSectionActionType.ADD,
                })
              }
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add lesson section
            </Button> */}
          </div>
        </div>
      </Container>
      <footer className="bg-white border-t border-accent-2 bottom-0 left-0 fixed w-full h-24 z-10">
        <div className="h-full m-auto w-full lg:w-2/3 flex items-center justify-end">
          <Button
            variant="outline"
            className="disabled:opacity-50 font-semibold flex items-center justify-between mr-4"
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
