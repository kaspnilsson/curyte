import React, { useEffect, useState } from 'react'
import AuthorLink from './AuthorLink'
import DateFormatter from './DateFormatter'
import LessonTitle from './LessonTitle'
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
import useConfirmDialog from '../hooks/useConfirmDialog'
import Present from './icons/Present'
import { Lesson } from '@prisma/client'
import { getLesson } from '../lib/apiHelpers'
import { LessonWithProfile } from '../interfaces/lesson_with_profile'
import { useUser } from '../contexts/user'

type Props = {
  lesson: LessonWithProfile
  coverImage?: string
  handleDelete?: () => void
  handleEdit?: () => void
  handlePublish?: () => void
  handleToggleFeatured?: () => void
  handleToggleTemplate?: () => void
  handlePresent?: () => void
}

const LessonHeader = ({
  lesson,
  handleDelete,
  handleEdit,
  handlePublish,
  handleToggleFeatured,
  handleToggleTemplate,
  handlePresent,
}: Props) => {
  const router = useRouter()
  const { userAndProfile } = useUser()
  const [, setLoading] = useState(false)
  const [parentLesson, setParentLesson] = useState<Lesson | null>(null)
  const [isSaved, setIsSaved] = useState(false)
  const [featured, setFeatured] = useState(lesson.featured || false)
  const [isTemplate, setIsTemplate] = useState(lesson.template || false)
  // const toast = useToast()

  useEffect(() => {
    if (!userAndProfile) return
    setLoading(true)
    const fetchParent = async () => {
      if (lesson.parentLessonId) {
        setParentLesson(await getLesson(lesson.parentLessonId))
      } else {
        setParentLesson(null)
      }
    }
    const fetchIsSaved = async () => {
      // setIsSaved(await getCurrentUserHasSavedLesson(lesson.uid))
      // TODO(kaspnilsson)

      setIsSaved(false)
    }
    Promise.all([fetchParent(), fetchIsSaved()]).then(() => {
      setLoading(false)
    })
  }, [lesson, userAndProfile, lesson.parentLessonId])

  const toggleSaveLesson = async () => {
    if (!userAndProfile) {
      // logged out!
      router.push(loginRoute(router.asPath))
      return
    }
    setLoading(true)
    setIsSaved(!isSaved)
    // TODO(kaspnilsson)
    // if (isSaved) {
    //   await removeSavedLessonForCurrentUser(lesson.uid)
    //   toast({ title: 'Lesson removed from bookmarks.' })
    // } else {
    //   await saveLessonForCurrentUser(lesson.uid)
    //   toast({
    //     title: 'Lesson bookmarked! View bookmarked lessons in your workspace.',
    //     status: 'success',
    //   })
    // }
    setLoading(false)
  }

  const handleMakeCopy = async () => {
    if (!userAndProfile) {
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
        {parentLesson && parentLesson.uid && (
          <div className="flex items-center h-min">
            <span className="mr-2">➜</span>
            <h1 className="mr-2 font-bold leading-tight tracking-tighter text-center md:leading-none md:text-left">
              Copied from
            </h1>
            <LessonLink lesson={parentLesson} />
          </div>
        )}
      </div>
      <div className="mt-1 mb-8">
        <div className="mb-6 text-2xl focus:outline-none text-zinc-500">
          {lesson.description}
        </div>
        {!!lesson.tags?.length && (
          <div className="flex flex-wrap items-center gap-2">
            {lesson.tags.map((t, index) => (
              <TagChip tagLabel={t} key={t + index} size="md" />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between mb-6 gap-x-1 gap-y-2">
        <AuthorLink author={lesson.profiles} />
        <div className="flex items-center gap-1">
          {lesson.private && (
            <Badge variant="subtle" colorScheme="orange" className="mr-4 h-min">
              Private
            </Badge>
          )}
          <div className="flex items-center mr-4">
            <div className="items-center hidden lg:flex">
              {lesson.updated && (
                <>
                  <span className="hidden gap-1 text-sm xl:flex">
                    <DateFormatter date={lesson.updated} />
                  </span>
                  <div className="hidden xl:flex">
                    <Center className="w-6 h-4">
                      <Divider orientation="vertical" />
                    </Center>
                  </div>
                </>
              )}
            </div>
            <span className="text-sm">{`${lesson.viewCount || 0} views`}</span>
          </div>
          <div className="flex items-center gap-1">
            {handlePresent && (
              <IconButton
                borderRadius="full"
                size="sm"
                onClick={handlePresent}
                aria-label="Present as slides"
              >
                <Present />
              </IconButton>
            )}
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
                  {handleToggleTemplate && (
                    <MenuItem
                      onClick={() => {
                        setIsTemplate(!isTemplate)
                        handleToggleTemplate()
                      }}
                    >
                      {isTemplate ? (
                        <i className="mr-4 text-lg ri-t-box-line text-inherit" />
                      ) : (
                        <i className="mr-4 text-lg ri-t-box-fill text-inherit" />
                      )}
                      {isTemplate ? 'Unmark' : 'Mark'} lesson as template
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
