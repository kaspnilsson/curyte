import React, { useEffect, useState } from 'react'
import { Author } from '../interfaces/author'
import AuthorLink from './AuthorLink'
import DateFormatter from './DateFormatter'
import LessonTitle from './LessonTitle'
import * as api from '../firebase/api'
import firebase from '../firebase/clientApp'
import { Lesson } from '../interfaces/lesson'
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
  Button,
} from '@chakra-ui/react'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
  BookmarkIcon,
  DocumentRemoveIcon,
  DuplicateIcon,
  MenuIcon,
  UploadIcon,
} from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import { loginRoute, newLessonRoute } from '../utils/routes'
import TagChip from './TagChip'
import CoverImage from './CoverImage'

type Props = {
  lesson: Lesson
  coverImage?: string
  author: Author
  handleDelete?: () => void
  handlePublish?: () => void
  isDraft: boolean
}

const LessonHeader = ({
  author,
  lesson,
  handleDelete,
  handlePublish,
  isDraft,
}: Props) => {
  const router = useRouter()
  const [user, userLoading] = useAuthState(firebase.auth())
  const [, setLoading] = useState(false)
  const [parentLesson, setParentLesson] = useState<Lesson | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (!user || userLoading) return
    setLoading(true)
    const fetchParent = async () => {
      if (lesson.parentLessonId) {
        setParentLesson(await api.getLesson(lesson.parentLessonId))
      }
    }
    const fetchIsSaved = async () => {
      setIsSaved(await api.getCurrentUserHasSavedLesson(lesson.uid))
    }
    Promise.all([fetchParent(), fetchIsSaved()]).then(() => {
      setLoading(false)
    })
  }, [lesson, user, userLoading])

  const toggleSaveLesson = async () => {
    if (!user) {
      // logged out!
      router.push(loginRoute)
      return
    }
    setLoading(true)
    setIsSaved(!isSaved)
    if (isSaved) {
      await api.removeSavedLessonForCurrentUser(lesson.uid)
    } else {
      await api.saveLessonForCurrentUser(lesson.uid)
    }
    setLoading(false)
  }

  const handleMakeCopy = async () => {
    if (!user) {
      // logged out!
      router.push(loginRoute)
      return
    }
    router.push(newLessonRoute(lesson.uid))
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
        {parentLesson && isDraft && (
          <Center className="h-6 w-6 mx-3">
            <Divider orientation="vertical" />
          </Center>
        )}
        {isDraft && (
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
      <div className="mt-1 mb-8">
        <div className="text-2xl focus:outline-none text-gray-500 mb-6">
          {lesson.description}
        </div>
        {lesson.tags?.length && (
          <div className="flex gap-2 flex-wrap items-center">
            {lesson.tags.map((t, index) => (
              <TagChip tagLabel={t} key={t + index} />
            ))}
          </div>
        )}
      </div>
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
        <div className="flex gap-1 items-center">
          {handlePublish && (
            <Button
              size="sm"
              colorScheme="purple"
              className="font-semibold flex items-center justify-between mr-2"
              onClick={handlePublish}
            >
              <UploadIcon className="h-5 w-5 mr-2" />
              Publish
            </Button>
          )}
          {!isDraft && (
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
          )}
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
              {!isDraft && (
                <MenuItem onClick={handleMakeCopy}>
                  <DuplicateIcon className="h-5 w-5 text-inherit mr-4" />
                  Make a copy
                </MenuItem>
              )}
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
      {lesson.coverImageUrl && (
        <div className="mb-8 md:mb-16 sm:mx-0">
          <CoverImage title={lesson.title} src={lesson.coverImageUrl} />
        </div>
      )}
    </>
  )
}

export default LessonHeader
