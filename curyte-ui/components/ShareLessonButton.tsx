import {
  useDisclosure,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react'
import { ShareIcon, LinkIcon, MailIcon } from '@heroicons/react/outline'
import { LessonWithProfile } from '../interfaces/lesson_with_profile'
import { getLessonLinkExternal } from '../utils/routes'
import LessonPreview from './LessonPreview'

import copyToCliboard from '../utils/copy-to-clipboard'

interface Props {
  lesson?: LessonWithProfile
  style?: 'small' | 'large'
}

const makeTwitterUrl = (lesson: LessonWithProfile): string => {
  let tweet = lesson.title || 'Check out this lesson'
  if (lesson.profiles.twitterUrl) {
    tweet += ` by @${lesson.profiles.twitterUrl?.split('.com/')[1]}`
  } else if (lesson.profiles.displayName) {
    tweet += ` by ${lesson.profiles.displayName}`
  }
  tweet += ' on @Curyte \n' + getLessonLinkExternal(lesson.uid)
  return `https://twitter.com/intent/tweet?text=${tweet}`
}

const makeFacebookUrl = (lesson: LessonWithProfile): string => {
  let quote = lesson.title || 'Check out this lesson'
  if (lesson.profiles.displayName) {
    quote += ` by ${lesson.profiles.displayName}`
  }
  quote += ' on Curyte'
  return `https://www.facebook.com/sharer/sharer.php?u=${getLessonLinkExternal(
    lesson.uid
  )}&quote=${quote}`
}

const makeMailtoUrl = (lesson: LessonWithProfile): string => {
  let quote = lesson.title || 'Check out this lesson'
  if (lesson.profiles.displayName) {
    quote += ` by ${lesson.profiles.displayName}`
  }
  quote += ' on Curyte'
  return `mailto:?subject=${quote}&body=${getLessonLinkExternal(lesson.uid)}`
}

const ShareLessonButton = ({ lesson, style = 'large' }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const onCopy = () => {
    if (!lesson) return
    copyToCliboard(getLessonLinkExternal(lesson.uid))
    toast({ title: 'Copied URL to clipboard.' })
  }
  if (!lesson) return null
  return (
    <>
      <Button
        colorScheme="black"
        variant={style === 'large' ? 'solid' : 'ghost'}
        onClick={onOpen}
        className="flex items-center gap-2"
        size={style === 'large' ? 'lg' : 'xs'}
      >
        <ShareIcon className="w-5 h-5" />
        {style === 'large' && 'Share'}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <div className="text-2xl font-bold leading-tight tracking-tighter">
              Share this lesson
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <LessonPreview lesson={lesson} />
            <div className="flex items-center justify-between gap-8 my-4">
              <Button className="flex items-center gap-2" onClick={onCopy}>
                <LinkIcon className="w-5 h-5" />
                Copy link
              </Button>
              <a href={makeTwitterUrl(lesson)} target="_blank" rel="noreferrer">
                <Button className="flex items-center gap-2">
                  <i className="text-xl ri-twitter-line" />
                  Twitter
                </Button>
              </a>
              <a
                href={makeFacebookUrl(lesson)}
                target="_blank"
                rel="noreferrer"
              >
                <Button className="flex items-center gap-2">
                  <i className="text-xl ri-facebook-circle-line" />
                  Facebook
                </Button>
              </a>
              <a href={makeMailtoUrl(lesson)} target="_blank" rel="noreferrer">
                <Button className="flex items-center gap-2">
                  <MailIcon className="w-5 h-5" />
                  Email
                </Button>
              </a>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default ShareLessonButton
