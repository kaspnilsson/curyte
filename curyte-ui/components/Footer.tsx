import Container from './Container'
import { HeartIcon } from '@heroicons/react/outline'

const Footer = () => {
  return (
    <>
      {/* keep h-16 in sync with main padding */}
      <footer className="absolute bottom-0 flex w-full h-16 px-5 m-auto bg-white border-t-2 border-zinc-200">
        <Container>
          <div className="flex items-center justify-between py-5 h-fit-content">
              <h3 className="flex flex-wrap items-center gap-1 text-xl leading-tight tracking-tighter">
              Made with ❤️ in San
              Francisco
            </h3>
            <h4 className="text-xl leading-tight tracking-tighter text-right">
              © 2021 Curyte
            </h4>
          </div>
        </Container>
      </footer>
    </>
  )
}

export default Footer
