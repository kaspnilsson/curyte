import Container from './Container'
import { HeartIcon } from '@heroicons/react/outline'
import { Button } from '@chakra-ui/react'
import Link from 'next/link'
import { whatIsCuryteRoute } from '../utils/routes'

const Footer = () => {
  return (
    <footer className="flex w-full h-16 bg-white border-t">
      <Container className="flex items-center justify-between py-4 h-fit-content">
        <h3 className="flex flex-wrap items-center gap-1 text-base font-bold leading-tight tracking-tighter">
          Made with <HeartIcon className="w-6 h-6" fill="red" /> in San
          Francisco
        </h3>
        <div className="flex flex-wrap items-center gap-4">
          <Link href={whatIsCuryteRoute} passHref>
            <Button variant="link" colorScheme="violet">
              What is Curyte?
            </Button>
          </Link>
          <h4 className="text-base leading-tight tracking-tighter text-right">
            © 2021 Curyte
          </h4>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
