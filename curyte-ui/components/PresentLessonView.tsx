import Head from 'next/head'
import React, { ReactNode, useCallback, useRef, useState } from 'react'
import { Lesson } from '../interfaces/lesson'
import { Author } from '../interfaces/author'
import LessonHeader from '../components/LessonHeader'
import FancyEditor from '../components/FancyEditor'
import useCuryteEditor from '../hooks/useCuryteEditor'
import { JSONContent } from '@tiptap/core'
import SwiperClass, { Navigation, HashNavigation, Lazy } from 'swiper'
import { SwiperSlide, Swiper } from 'swiper/react'
import Container from '../components/Container'
import { Button, Progress } from '@chakra-ui/react'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { FullScreen, useFullScreenHandle } from 'react-full-screen'
import ExitFullscreen from '../components/icons/ExitFullscreen'
import EnterFullscreen from '../components/icons/EnterFullscreen'
import { useHotkeys } from 'react-hotkeys-hook'

import 'swiper/css'

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
  backUrl: string
  backUrlHref: string
}

const PresentLessonView = ({ lesson, author, backUrl, backUrlHref }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [progress, setProgress] = useState(0)
  const [swiper, setSwiper] = useState<SwiperClass | null>(null)
  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null)
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null)
  const handle = useFullScreenHandle()
  const [activeIndex, setActiveIndex] = useState(0)
  const ref = useRef<HTMLDivElement | null>(null)

  const downOrNext = useCallback(() => {
    if (!swiper || !ref || !ref.current) return
    if (
      ref.current &&
      ref.current.scrollHeight - ref.current.scrollTop > swiper.height
    ) {
      ref.current.scroll({ top: swiper.height, left: 0, behavior: 'smooth' })
    } else {
      swiper?.slideNext()
    }
  }, [swiper, ref])

  const upOrBack = useCallback(() => {
    if (!swiper || !ref || !ref.current) return
    if (ref.current && ref.current.scrollTop > 0) {
      ref.current.scroll({ top: -swiper.height, left: 0, behavior: 'smooth' })
    } else {
      swiper?.slidePrev()
    }
  }, [swiper, ref])

  useHotkeys('left', upOrBack, [upOrBack])
  useHotkeys('up', upOrBack, [upOrBack])
  useHotkeys('right', downOrNext, [downOrNext])
  useHotkeys('down', downOrNext, [downOrNext])

  const partitioned = partitionDocForPresentationMode(lesson.content).map(
    (content, index) => <EditorContentSlide content={content} key={index} />
  )

  const items: ReactNode[] = [
    <div key={-1} className="w-full my-auto">
      <LessonHeader author={author} lesson={lesson} />
    </div>,
    ...partitioned,
    <div className="flex flex-col items-center gap-8" key={-2}>
      <h1 className="text-6xl font-bold leading-tight tracking-tighter md:text-8xl">
        Fin.
      </h1>
      <Link passHref href={backUrlHref} as={backUrl}>
        <Button
          colorScheme="black"
          className="flex items-center gap-2 shadow-2xl shadow-violet-500/50"
          size="lg"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to lesson
        </Button>
      </Link>
    </div>,
  ]

  return (
    <FullScreen handle={handle}>
      <article className="relative flex flex-col w-screen h-screen overflow-hidden bg-white">
        <Head>
          <title>{lesson.title}</title>
        </Head>
        <div className="sticky top-0 left-0 right-0 z-20 transition-all bg-white border-b">
          <Container className="flex items-center justify-between h-12 gap-4 py-2 md:py-4">
            <Link passHref href={backUrlHref} as={backUrl}>
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
          onSwiper={setSwiper}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          watchSlidesProgress
          slidesPerView="auto"
          centeredSlides
          simulateTouch={false}
          hashNavigation
          navigation={{ prevEl, nextEl }}
          lazy
          modules={[HashNavigation, Navigation, Lazy]}
          className="w-full h-full"
        >
          {items.map((item, index) => (
            <SwiperSlide
              key={index}
              data-hash={`slide-${index}`}
              className="w-auto lg:!max-w-[1000px] xl:!max-w-[1200px] 2xl:!max-w-[1440px]"
            >
              <div
                ref={activeIndex === index ? ref : undefined}
                className="w-auto h-full overflow-y-auto scroll-auto"
              >
                <Container className="grid items-center w-auto h-full min-h-0 py-8">
                  {item}
                </Container>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="sticky bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-center transition-all bg-white border-b">
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
export default PresentLessonView
