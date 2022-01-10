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
import { black } from '../styles/theme/colors'
import {
  getCurrentUserHasSavedLesson,
  getLesson,
  removeSavedLessonForCurrentUser,
  saveLessonForCurrentUser,
} from '../firebase/api'
import useConfirmDialog from '../hooks/useConfirmDialog'

type Props = {
  lesson: Lesson
  coverImage?: string
  author: Author
  handleDelete?: () => void
  handleEdit?: () => void
  handlePublish?: () => void
  handleToggleFeatured?: () => void
}

const LessonHeader = ({
  author,
  lesson,
  handleDelete,
  handleEdit,
  handlePublish,
  handleToggleFeatured,
}: Props) => {
  const router = useRouter()
  const [user, userLoading] = useAuthState(auth)
  const [, setLoading] = useState(false)
  const [parentLesson, setParentLesson] = useState<Lesson | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [featured, setFeatured] = useState(lesson.featured || false)

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
      router.push(loginRoute(router.asPath))
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
      router.push(loginRoute(router.asPath))
      return
    }
    router.push(newLessonRoute(lesson.uid))
  }

  const { ConfirmDialog, onOpen } = useConfirmDialog({
    title: 'Delete lesson',
    body: 'Are you sure you want to delete this lesson?',
    confirmText: 'Delete lesson',
    onConfirmClick: handleDelete || (() => null),
  })

  return (
    <>
      <ConfirmDialog />
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
        {parentLesson && lesson.private && (
          <Center className="w-4 h-4 mx-2">
            <Divider orientation="vertical" />
          </Center>
        )}
        {lesson.private && (
          <Badge variant="subtle" colorScheme="orange" className="h-min">
            Private
          </Badge>
        )}
      </div>
      <div className="mt-1 mb-8">
        <div className="mb-6 text-2xl focus:outline-none text-zinc-500">
          {lesson.description}
        </div>
        {!!lesson.tags?.length && (
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
        </div>
        <div className="flex items-center gap-1">
          <div className="flex items-center mr-4">
            <div className="items-center hidden lg:flex">
              {lesson.created && (
                <>
                  <span className="text-sm">
                    {lesson.updated &&
                      lesson.created !== lesson.updated &&
                      'Created '}
                    <DateFormatter dateString={lesson.created} />{' '}
                  </span>
                  <Center className="w-6 h-4">
                    <Divider orientation="vertical" />
                  </Center>
                </>
              )}
              {lesson.updated && lesson.updated !== lesson.created && (
                <>
                  <span className="text-sm">
                    {'Updated '}
                    <DateFormatter dateString={lesson.updated} />
                  </span>
                  <Center className="w-6 h-4">
                    <Divider orientation="vertical" />
                  </Center>
                </>
              )}
            </div>
            <span className="text-sm">{`${lesson.viewCount || 0} views`}</span>
          </div>
          {handlePublish && (
            <Button
              size="sm"
              colorScheme="black"
              className="flex items-center justify-between mr-2 font-semibold"
              onClick={handlePublish}
            >
              <UploadIcon className="w-5 h-5" />
              <div className="hidden ml-2 md:flex">Publish</div>
            </Button>
          )}
          {!lesson.private && (
            <IconButton
              borderRadius="full"
              size="sm"
              aria-label={isSaved ? 'Saved' : 'Save'}
              onClick={() => toggleSaveLesson()}
            >
              <BookmarkIcon
                className="w-5 h-5 text-inherit"
                style={{ fill: isSaved ? black[900] : 'transparent' }}
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
            />
            <Portal>
              <MenuList>
                {!lesson.private && (
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
                {handleToggleFeatured && (
                  <MenuItem
                    onClick={() => {
                      setFeatured(!featured)
                      handleToggleFeatured()
                    }}
                  >
                    {featured ? (
                      <i className="mr-4 text-lg ri-lightbulb-flash-line text-inherit" />
                    ) : (
                      <i className="mr-4 text-lg ri-lightbulb-flash-fill text-inherit" />
                    )}
                    {featured ? 'Unfeature' : 'Feature'} lesson
                  </MenuItem>
                )}
                {handleDelete && (
                  <MenuItem onClick={onOpen}>
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
