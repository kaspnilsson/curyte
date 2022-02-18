import { Button } from '@chakra-ui/react'
import { QuestionMarkCircleIcon, XIcon } from '@heroicons/react/outline'
import { ReactNode } from 'react'
import Image from 'next/image'
import { SwiperSlide, Swiper } from 'swiper/react'
import applyFormattingGif from '../public/apply_formatting.gif'
import insertContentGif from '../public/insert_content.gif'
import useTemplatesGif from '../public/use_templates.gif'
import publishGif from '../public/publish.gif'
import findHelpGif from '../public/find_help.gif'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Lazy, Navigation, Pagination } from 'swiper'

interface Props {
  onHide?: () => void
}

interface Hint {
  title: string | ReactNode
  content: ReactNode
}

const hints: Hint[] = [
  {
    title: 'Select text to change formatting',
    content: (
      <Image
        layout="responsive"
        src={applyFormattingGif}
        alt="Apply formatting"
      />
    ),
  },
  {
    title: (
      <span className="inline-flex flex-wrap items-center justify-center gap-1">
        Insert rich content by starting a new line and using{' '}
        <i className="ri-md ri-add-circle-line text-zinc-900"></i>
      </span>
    ),
    content: (
      <Image layout="responsive" src={insertContentGif} alt="Insert content" />
    ),
  },
  {
    title: 'Ease into the creation process by starting with a template',
    content: (
      <Image layout="responsive" src={useTemplatesGif} alt="Use templates" />
    ),
  },
  {
    title: 'Preview, delete, and publish lessons using the footer',
    content: <Image layout="responsive" src={publishGif} alt="Publish" />,
  },
  {
    title: (
      <span className="inline-flex flex-wrap items-center justify-center gap-1">
        Click <QuestionMarkCircleIcon className="w-6 h-6" /> in the footer to
        bring back these hints and get help from the community
      </span>
    ),
    content: <Image layout="responsive" src={findHelpGif} alt="Find help" />,
  },
]

const LessonEditorHints = ({ onHide }: Props) => {
  return (
    <div className="w-full h-full p-2 md:p-4 bg-zinc-100">
      <div className="relative flex flex-col h-full max-w-4xl m-auto">
        <div className="flex items-center justify-end">
          {onHide && (
            <Button onClick={onHide} size="xs" variant="ghost">
              <XIcon className="w-5 h-5 text-zinc-500" />
            </Button>
          )}
        </div>
        <Swiper
          modules={[Navigation, Pagination, Lazy]}
          navigation
          pagination
          loop
          className="w-full h-full"
          lazy
        >
          {hints.map((hint, index) => (
            <SwiperSlide
              key={index}
              className="flex flex-col items-center justify-center h-full gap-8"
            >
              <h2 className="text-xl font-bold leading-tight tracking-tighter text-center lg:text-2xl">
                {hint.title}
              </h2>
              <div className="w-full max-w-lg pb-8">{hint.content}</div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default LessonEditorHints
