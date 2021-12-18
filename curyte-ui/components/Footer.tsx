import Container from './Container'

const Footer = () => {
  return (
    <>
      {/* keep h-24 in sync with main padding */}
      <footer className="bg-accent-1 border-t border-accent-2 bottom-0 absolute w-full h-24 flex">
        <Container>
          <div className="flex h-full items-center justify-between">
            <h3 className="text-xl font-bold tracking-tighter leading-tight">
              Made with ❤️ in San Francisco
            </h3>
            <h4 className="text-xl tracking-tighter leading-tight text-right">
              © 2021 Curyte
            </h4>
          </div>
        </Container>
      </footer>
    </>
  )
}

export default Footer
