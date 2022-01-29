import Container from './Container'
import { HeartIcon } from '@heroicons/react/outline'

const Footer = () => {
  return (
    <footer className="flex w-full h-16 bg-white border-t">
      <Container>
        <div className="flex items-center justify-between py-4 my-auto h-fit-content">
          <h3 className="flex flex-wrap items-center gap-1 text-xl font-bold leading-tight tracking-tighter">
            Made with <HeartIcon className="w-6 h-6" fill="red" /> in San
            Francisco
          </h3>
          <h4 className="text-xl leading-tight tracking-tighter text-right">
            © 2021 Curyte
          </h4>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
