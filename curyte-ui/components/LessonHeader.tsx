import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Author } from '../interfaces/author'
import AuthorLink from './AuthorLink'
import DateFormatter from './DateFormatter'
import LessonTitle from './LessonTitle'
import * as api from '../firebase/api'
import firebase from '../firebase/clientApp'
import { LessonStorageModel } from '../interfaces/lesson'
import LessonLink from './LessonLink'
import {
  IconButton,
  Badge,
  Center,
  Divider,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
} from '@chakra-ui/react'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
  BookmarkIcon,
  DocumentRemoveIcon,
  DuplicateIcon,
  MenuIcon,
} from '@heroicons/react/outline'

type Props = {
  lesson: LessonStorageModel
  coverImage?: string
  author: Author
  handleDelete?: () => void
}

const LessonHeader = ({ author, lesson, handleDelete }: Props) => {
  const [user, userLoading] = useAuthState(firebase.auth())
  const [, setLoading] = useState(false)
  const [parentLesson, setParentLesson] = useState<LessonStorageModel | null>(
    null
  )
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (userLoading) return
    setLoading(true)
    const fetchParent = async () => {
      if (lesson.parentLessonId) {
        setParentLesson(await api.getLesson(lesson.parentLessonId))
      }
    }
    const fetchIsSaved = async () => {
      setIsSaved(await api.getUserHasSavedLesson(lesson.uid))
    }
    Promise.all([fetchParent(), fetchIsSaved()]).then(() => {
      setLoading(false)
    })
  }, [lesson, user, userLoading])

  const toggleSaveLesson = async () => {
    setLoading(true)
    setIsSaved(!isSaved)
    if (isSaved) {
      await api.removeSavedLesson(lesson.uid)
    } else {
      await api.saveLesson(lesson.uid)
    }
    setLoading(false)
  }

  return (
    <>
      <LessonTitle title={lesson.title} />
      <div className="flex items-center mb-4 h-min">
        {parentLesson && (
          <div className="flex items-center h-min ">
            <span className="mr-2">➜</span>
            <h1 className="text-xl font-bold tracking-tighter leading-tight md:leading-none text-center md:text-left mr-2">
              Copied from
            </h1>
            <LessonLink lesson={parentLesson} />
          </div>
        )}
        {parentLesson && !lesson.published && (
          <Center className="h-6 w-6 mx-3">
            <Divider orientation="vertical" />
          </Center>
        )}
        {!lesson.published && (
          <Badge
            variant="subtle"
            size="xl"
            colorScheme="orange"
            fontSize="1em"
            className=" h-min"
          >
            Draft
          </Badge>
        )}
      </div>
      <div className="text-2xl focus:outline-none mt-1 text-gray-500 mb-8">
        {lesson.description}
      </div>
      {/* <div className="mb-8 md:mb-16 sm:mx-0">
        <CoverImage title={title} src={coverImage || ''} />
      </div> */}
      <div className="flex mb-6 items-center justify-between">
        <div className="flex gap-2 items-center">
          <AuthorLink author={author} />
          {lesson.created && <DateFormatter dateString={lesson.created} />}
          {!!lesson.viewCount && (
            <>
              <Center className="h-4 w-6">
                <Divider orientation="vertical" />
              </Center>
              {`${lesson.viewCount} views`}
            </>
          )}
        </div>
        <div className="flex gap-1">
          <IconButton
            borderRadius="full"
            size="sm"
            aria-label={isSaved ? 'Saved' : 'Save'}
            colorScheme="purple"
            variant="ghost"
            onClick={() => toggleSaveLesson()}
          >
            <BookmarkIcon
              className="h-5 w-5 text-inherit"
              style={{ fill: isSaved ? '#805AD5' : 'transparent' }}
            />
          </IconButton>
          <Menu id="more-menu" isLazy>
            <MenuButton
              borderRadius="full"
              size="sm"
              as={IconButton}
              aria-label="Options"
              icon={<MenuIcon className="h-5 w-5 text-inherit" />}
              variant="subtle"
            />
            <MenuList>
              <Link
                passHref
                as={`/lessons/edit/${lesson.uid}`}
                href="/lessons/edit/[id]"
              >
                <MenuItem>
                  <DuplicateIcon className="h-5 w-5 text-inherit mr-4" />
                  Make a copy
                </MenuItem>
              </Link>
              {handleDelete && (
                <MenuItem onClick={handleDelete}>
                  <DocumentRemoveIcon className="h-5 w-5 text-inherit mr-4" />
                  Delete lesson
                </MenuItem>
              )}
            </MenuList>
          </Menu>
        </div>
      </div>
    </>
  )
}

export default LessonHeader
