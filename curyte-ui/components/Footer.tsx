import Container from './Container'
import { HeartIcon } from '@heroicons/react/outline'
import { Button } from '@chakra-ui/react'
import Link from 'next/link'
import {
  dataDeletionInstructionsRoute,
  discordInviteHref,
  privacyPolicyRoute,
  whatIsCuryteRoute,
} from '../utils/routes'

const Footer = () => {
  return (
    <footer className="flex w-full bg-white border-t">
      <Container className="flex flex-col-reverse items-start justify-between gap-8 py-8 md:flex-row">
        <div className="flex flex-col flex-wrap items-start flex-1 h-full gap-2">
          <span className="flex flex-wrap items-center gap-1 text-base font-bold leading-tight tracking-tighter">
            Made with <HeartIcon className="w-6 h-6" fill="red" /> in San
            Francisco
          </span>
          <span className="text-base !font-normal leading-tight tracking-tighter">
            © 2021 Curyte
          </span>
        </div>
        <div className="flex flex-col items-start gap-2">
          <span className="font-bold leading-tight tracking-tighter">
            Resources
          </span>
          <Link href={privacyPolicyRoute} passHref>
            <a>
              <Button variant="link" colorScheme="violet">
                Privacy Policy
              </Button>
            </a>
          </Link>
          <Link href={dataDeletionInstructionsRoute} passHref>
            <a>
              <Button variant="link" colorScheme="violet">
                Removing your data
              </Button>
            </a>
          </Link>
          <Link href="http://curyte.com/lessons/WxzMiQtgkuigQeM7" passHref>
            <a>
              <Button variant="link" colorScheme="violet">
                Curriculum and copyright
              </Button>
            </a>
          </Link>
        </div>
        <div className="flex flex-col items-start gap-2">
          <span className="font-bold leading-tight tracking-tighter ">
            About
          </span>
          <Link href={whatIsCuryteRoute} passHref>
            <a>
              <Button variant="link" colorScheme="violet">
                What is Curyte?
              </Button>
            </a>
          </Link>
          <Link href={discordInviteHref} passHref>
            <a>
              <Button variant="link" colorScheme="violet">
                Join the community!
              </Button>
            </a>
          </Link>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
