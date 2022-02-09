import Head from 'next/head'
import React, { ReactNode, useState } from 'react'
import { Lesson } from '../../../interfaces/lesson'
import { GetServerSideProps } from 'next'
import { Author } from '../../../interfaces/author'
import LessonHeader from '../../../components/LessonHeader'
import FancyEditor from '../../../components/FancyEditor'
import { ParsedUrlQuery } from 'querystring'
import useCuryteEditor from '../../../hooks/useCuryteEditor'
import { getLesson, getAuthor } from '../../../firebase/api'
import { JSONContent } from '@tiptap/core'
// Import Swiper styles
import 'swiper/css'
import { Navigation, HashNavigation } from 'swiper'
import { SwiperSlide, Swiper } from 'swiper/react'
import Container from '../../../components/Container'
import { Button, Progress } from '@chakra-ui/react'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline'
import { lessonRouteHrefPath, lessonRoute } from '../../../utils/routes'
import Link from 'next/link'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import ExitFullscreen from '../../../components/icons/ExitFullscreen'
import EnterFullscreen from '../../../components/icons/EnterFullscreen'
import classNames from 'classnames'

const shouldConcatBlock = (type?: string): boolean =>
  type === 'paragraph' || type === 'details' || type === 'bulletList'

const partitionDocForPresentationMode = (
  doc: JSONContent | null
): JSONContent[] => {
  if (!doc) return []
  const output = []
  let acc: JSONContent[] = []
  for (const block of doc.content || []) {
    if (shouldConcatBlock(block.type)) {
      acc.push(block)
    } else {
      if (acc.length) {
        output.push({
          type: 'doc',
          content: acc,
        })
      }
      acc = [block]
    }
  }

  if (acc.length) {
    output.push({
      type: 'doc',
      content: acc,
    })
  }

  return output
}

interface EditorContentSlideProps {
  content: JSONContent
}

const EditorContentSlide = ({ content }: EditorContentSlideProps) => {
  const editor = useCuryteEditor({ content }, [content])

  return <FancyEditor readOnly editor={editor} presentMode />
}

interface Props {
  lesson: Lesson
  author: Author
}

const PresentLessonView = ({ lesson, author }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [progress, setProgress] = useState(0)
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null)
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null)
  const handle = useFullScreenHandle()

  const partitioned = partitionDocForPresentationMode(lesson.content).map(
    (content, index) => <EditorContentSlide content={content} key={index} />
  )

  const items: ReactNode[] = [
    <div key={-1} className="w-full my-auto">
      <LessonHeader author={author} lesson={lesson} />
    </div>,
    ...partitioned,
  ]

  return (
    <FullScreen handle={handle}>
      <article className="relative flex flex-col w-screen h-screen overflow-hidden bg-white">
        <Head>
          <title>{lesson.title}</title>
        </Head>
        <div
          className={classNames('sticky top-0 z-20 bg-white border-b', {
            'opacity-0 transition-all hover:opacity-100 shadow-xl':
              handle.active,
          })}
        >
          <Container className="flex items-center justify-between h-16 gap-4 py-2 md:py-4">
            <Link
              passHref
              href={lessonRouteHrefPath}
              as={lessonRoute(lesson.uid)}
            >
              <Button
                variant="link"
                className="flex items-center gap-2"
                size="sm"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back to lesson
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="black"
              onClick={handle.active ? handle.exit : handle.enter}
            >
              {handle.active ? <ExitFullscreen /> : <EnterFullscreen />}
            </Button>
          </Container>
        </div>
        <Swiper
          onProgress={(_swiper, progress) => setProgress(progress * 100)}
          watchSlidesProgress
          slidesPerView="auto"
          centeredSlides
          simulateTouch={false}
          hashNavigation
          navigation={{ prevEl, nextEl }}
          modules={[HashNavigation, Navigation]}
          className="w-full h-full"
        >
          {items.map((item, index) => (
            <SwiperSlide
              key={index}
              data-hash={`slide-${index}`}
              className="w-auto lg:!max-w-[1000px] xl:!max-w-[1200px] 2xl:!max-w-[1440px]"
            >
              <Container className="flex items-center justify-center w-auto h-full py-4 overflow-y-auto md:py-8">
                {item}
              </Container>
            </SwiperSlide>
          ))}
        </Swiper>
        <div>
          <Progress
            isAnimated
            value={progress}
            className="w-full"
            size="xs"
            colorScheme="black"
            sx={{
              '& > div:first-of-type': {
                transitionProperty: 'width',
              },
            }}
          />
          <Container className="flex items-center justify-between py-2 md:py-4">
            <Button
              ref={(node) => setPrevEl(node)}
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back
            </Button>
            <Button
              ref={(node) => setNextEl(node)}
              className="flex items-center gap-2"
              colorScheme="black"
            >
              Next
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </Container>
        </div>
      </article>
    </FullScreen>
  )
}

interface IParams extends ParsedUrlQuery {
  id: string
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   const lessons = await getLessons([where('private', '==', false)])
//   const paths = lessons.map(({ uid }) => ({
//     params: { id: uid },
//   }))
//   return { paths, fallback: 'blocking' }
// }

// export const getStaticProps: GetStaticProps = async (context) => {
//   const { id } = context.params as IParams
//   const lesson = await getLesson(id)
//   const author = await getAuthor(lesson.authorId)
//   return { props: { lesson, author } }
// }

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as IParams
  const lesson = await getLesson(id)
  const author = await getAuthor(lesson.authorId)

  return { props: { lesson, author } }
}

export default PresentLessonView
