import Container from './Container'
import { HeartIcon } from '@heroicons/react/outline'
import { Button, Heading } from '@chakra-ui/react'
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
          <Heading
            size="sm"
            className="flex flex-wrap items-center gap-1 text-base font-bold leading-tight tracking-tighter"
          >
            Made with <HeartIcon className="w-6 h-6" fill="red" /> in San
            Francisco
          </Heading>
          <Heading
            size="sm"
            className="text-base !font-normal leading-tight tracking-tighter"
          >
            © 2021 Curyte
          </Heading>
        </div>
        <div className="flex flex-col items-start gap-2">
          <Heading
            className="font-bold leading-tight tracking-tighter "
            size="sm"
          >
            Resources
          </Heading>
          <Link href={privacyPolicyRoute} passHref>
            <Button variant="link" colorScheme="violet">
              Privacy Policy
            </Button>
          </Link>
          <Link href={dataDeletionInstructionsRoute} passHref>
            <Button variant="link" colorScheme="violet">
              Removing your data
            </Button>
          </Link>
          <Link href="http://curyte.com/lessons/WxzMiQtgkuigQeM7" passHref>
            <Button variant="link" colorScheme="violet">
              Curriculum and copyright
            </Button>
          </Link>
        </div>
        <div className="flex flex-col items-start gap-2">
          <Heading
            className="font-bold leading-tight tracking-tighter "
            size="sm"
          >
            Company
          </Heading>
          <Link href={whatIsCuryteRoute} passHref>
            <Button variant="link" colorScheme="violet">
              What is Curyte?
            </Button>
          </Link>
          <Link href={discordInviteHref} passHref>
            <Button variant="link" colorScheme="violet">
              Join the community!
            </Button>
          </Link>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
