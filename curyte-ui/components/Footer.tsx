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
      <Container className="flex items-center justify-between py-8">
        <div className="flex flex-col flex-wrap items-start justify-between h-full gap-2">
          <Heading
            size="sm"
            className="text-base !font-normal leading-tight tracking-tighter"
          >
            © 2021 Curyte
          </Heading>
          <Heading
            size="sm"
            className="flex flex-wrap items-center gap-1 text-base font-bold leading-tight tracking-tighter"
          >
            Made with <HeartIcon className="w-6 h-6" fill="red" /> in San
            Francisco
          </Heading>
        </div>
        <div className="grid grid-cols-2 gap-8 pl-2 ml-auto mr-4">
          <div className="flex flex-col items-start gap-2">
            <Heading
              className="font-bold leading-tight tracking-tighter "
              size="sm"
            >
              Resources
            </Heading>
            <Link href={whatIsCuryteRoute} passHref>
              <Button variant="link" colorScheme="violet">
                What is Curyte?
              </Button>
            </Link>
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
            <a href={discordInviteHref} target="_blank" rel="noreferrer">
              <Button variant="link" colorScheme="violet">
                Join the community
              </Button>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
