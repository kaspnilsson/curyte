import Container from './Container'
import { HeartIcon } from '@heroicons/react/outline'
import { Button, Heading } from '@chakra-ui/react'
import Link from 'next/link'
import {
  dataDeletionInstructionsRoute,
  privacyPolicyRoute,
  whatIsCuryteRoute,
} from '../utils/routes'

const Footer = () => {
  return (
    <footer className="flex w-full bg-white border-t">
      <Container className="flex items-baseline justify-between py-8">
        <div className="flex flex-col flex-wrap justify-between h-full gap-2 md:gap-4">
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
        <div className="flex flex-col items-start gap-2 pl-2 ml-auto mr-4">
          <Heading
            className="font-bold leading-tight tracking-tighter "
            size="sm"
          >
            Links
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
      </Container>
    </footer>
  )
}

export default Footer
