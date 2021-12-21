import React, { useEffect, useState } from 'react'
import { Author } from '../interfaces/author'
import AuthorLink from './AuthorLink'
import DateFormatter from './DateFormatter'
import LessonTitle from './LessonTitle'
import { auth } from '../firebase/clientApp'
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
  Portal,
} from '@chakra-ui/react'
import { useAuthState } from 'react-firebase-hooks/auth'
import {
  BookmarkIcon,
  DocumentRemoveIcon,
  PencilAltIcon,
  DuplicateIcon,
  MenuIcon,
  UploadIcon,
} from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import { loginRoute, newLessonRoute } from '../utils/routes'
import TagChip from './TagChip'
import CoverImage from './CoverImage'
import { indigo } from '../styles/theme/colors'
import {
  getCurrentUserHasSavedLesson,
  getLesson,
  removeSavedLessonForCurrentUser,
  saveLessonForCurrentUser,
} from '../firebase/api'

type Props = {
  lesson: Lesson
  coverImage?: string
  author: Author
  handleDelete?: () => void
  handleEdit?: () => void
  handlePublish?: () => void
  isDraft: boolean
}

const LessonHeader = ({
  author,
  lesson,
  handleDelete,
  handleEdit,
  handlePublish,
  isDraft,
}: Props) => {
  const router = useRouter()
  const [user, userLoading] = useAuthState(auth)
  const [, setLoading] = useState(false)
  const [parentLesson, setParentLesson] = useState<Lesson | null>(null)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    if (!user || userLoading) return
    setLoading(true)
    const fetchParent = async () => {
      if (lesson.parentLessonId) {
        setParentLesson(await getLesson(lesson.parentLessonId))
      }
    }
    const fetchIsSaved = async () => {
      setIsSaved(await getCurrentUserHasSavedLesson(lesson.uid))
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
      await removeSavedLessonForCurrentUser(lesson.uid)
    } else {
      await saveLessonForCurrentUser(lesson.uid)
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
      <LessonTitle title={lesson?.title || '(no title)'} />
      <div className="flex items-center mb-4 h-min">
        {parentLesson && (
          <div className="flex items-center h-min">
            <span className="mr-2">➜</span>
            <h1 className="mr-2 font-bold leading-tight tracking-tighter text-center md:leading-none md:text-left">
              Copied from
            </h1>
            <LessonLink lesson={parentLesson} />
          </div>
        )}
        {parentLesson && isDraft && (
          <Center className="w-4 h-4 mx-2">
            <Divider orientation="vertical" />
          </Center>
        )}
        {isDraft && (
          <Badge variant="subtle" colorScheme="orange" className="h-min">
            Draft
          </Badge>
        )}
      </div>
      <div className="mt-1 mb-8">
        <div className="mb-6 text-2xl focus:outline-none text-slate-500">
          {lesson.description}
        </div>
        {lesson.tags?.length && (
          <div className="flex flex-wrap items-center gap-2">
            {lesson.tags.map((t, index) => (
              <TagChip tagLabel={t} key={t + index} />
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm md:text-base">
          <AuthorLink author={author} />
          {lesson.created && <DateFormatter dateString={lesson.created} />}
          {!!lesson.viewCount && (
            <>
              <Center className="w-6 h-4">
                <Divider orientation="vertical" />
              </Center>
              {`${lesson.viewCount} views`}
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          {handlePublish && (
            <Button
              size="sm"
              colorScheme="indigo"
              className="flex items-center justify-between mr-2 font-semibold"
              onClick={handlePublish}
            >
              <UploadIcon className="w-5 h-5" />
              <div className="hidden ml-2 md:flex">Publish</div>
            </Button>
          )}
          {!isDraft && (
            <IconButton
              borderRadius="full"
              size="sm"
              aria-label={isSaved ? 'Saved' : 'Save'}
              colorScheme="indigo"
              variant="ghost"
              onClick={() => toggleSaveLesson()}
            >
              <BookmarkIcon
                className="w-5 h-5 text-inherit"
                style={{ fill: isSaved ? indigo[500] : 'transparent' }}
              />
            </IconButton>
          )}
          <Menu id="more-menu" isLazy>
            <MenuButton
              borderRadius="full"
              size="sm"
              as={IconButton}
              aria-label="Options"
              icon={<MenuIcon className="w-5 h-5 text-inherit" />}
              variant="subtle"
            />
            <Portal>
              <MenuList>
                {!isDraft && (
                  <MenuItem onClick={handleMakeCopy}>
                    <DuplicateIcon className="w-5 h-5 mr-4 text-inherit" />
                    Make a copy
                  </MenuItem>
                )}
                {handleEdit && (
                  <MenuItem onClick={handleEdit}>
                    <PencilAltIcon className="w-5 h-5 mr-4 text-inherit" />
                    Edit lesson
                  </MenuItem>
                )}
                {handleDelete && (
                  <MenuItem onClick={handleDelete}>
                    <DocumentRemoveIcon className="w-5 h-5 mr-4 text-inherit" />
                    Delete lesson
                  </MenuItem>
                )}
              </MenuList>
            </Portal>
          </Menu>
        </div>
      </div>
      {lesson.coverImageUrl && (
        <div className="mb-8 sm:mx-0">
          <CoverImage
            title={lesson?.title || '(no title)'}
            src={lesson.coverImageUrl}
          />
        </div>
      )}
    </>
  )
}

export default LessonHeader
