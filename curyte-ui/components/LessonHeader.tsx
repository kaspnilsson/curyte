import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Author } from '../interfaces/author'
import AuthorLink from './AuthorLink'
import DateFormatter from './DateFormatter'
import LessonTitle from './LessonTitle'
import * as api from '../firebase/api'
import { LessonStorageModel } from '../interfaces/lesson'
import LessonLink from './LessonLink'
import { Button, Badge, Center, Divider } from '@chakra-ui/react'

type Props = {
  lesson: LessonStorageModel
  coverImage?: string
  author: Author
  handleDelete?: () => void
}

const LessonHeader = ({ author, lesson, handleDelete }: Props) => {
  const [, setLoading] = useState(false)
  const [parentLesson, setParentLesson] = useState<LessonStorageModel | null>(
    null
  )
  useEffect(() => {
    const fetchParent = async () => {
      if (lesson.parentLessonId) {
        setLoading(true)
        setParentLesson(await api.getLesson(lesson.parentLessonId))
        setLoading(false)
      }
    }
    fetchParent()
  }, [lesson])

  return (
    <>
      <LessonTitle title={lesson.title} />
      <div className="flex items-center mb-4 h-min">
        {parentLesson && (
          <div className="flex items-center h-min ">
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
        <div className="">
          <AuthorLink author={author} />
        </div>
        <table>
          <tr className="text-sm">
            {lesson.updated && (
              <td className="pr-2 text-gray-500  text-right">Created</td>
            )}
            <td>
              {lesson.created && <DateFormatter dateString={lesson.created} />}
            </td>
          </tr>
          {lesson.updated && (
            <tr className="text-sm">
              <td className="pr-2 text-gray-500 text-right">Updated</td>
              <td>
                <DateFormatter dateString={lesson.updated} />
              </td>
            </tr>
          )}
        </table>
        <div className="flex gap-2">
          <Link
            passHref
            as={`/lessons/edit/${lesson.uid}`}
            href="/lessons/edit/[id]"
          >
            <Button variant="outline">Make a copy</Button>
          </Link>
          {handleDelete && (
            <Button variant="outline" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

export default LessonHeader
