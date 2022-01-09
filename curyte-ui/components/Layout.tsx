import React from 'react'
import Footer from './Footer'
import Header from './Header'
import Container from './Container'

type Props = {
  children: React.ReactNode
  withFooter?: boolean
  isSticky?: boolean
  showProgressBar?: boolean
  title?: string
  sidebar?: React.ReactNode
  className?: string
  withSearch?: boolean
}

const Layout = ({
  children,
  withSearch = true,
  withFooter = true,
  isSticky = true,
  showProgressBar,
  sidebar,
  title = 'Curyte',
  className = '',
}: Props) => {
  return (
    <>
      <div className={'relative min-h-screen ' + className}>
        <Header
          showProgressBar={showProgressBar}
          isSticky={isSticky}
          withSearch={withSearch}
          title={title}
        ></Header>
        {sidebar && (
          <div className="grid md:grid-cols-[15%_70%_15%] max-w-full md:flex-row">
            <Container className="relative flex self-start mb-8 md:flex-col md:sticky md:top-16 min-w-80 md:pr-0">
              {sidebar}
            </Container>
            {/* keep pb-24 in sync with footer height */}
            <main className="w-full pb-24">
              <Container className="flex-1">{children}</Container>
            </main>
            {/* empty sidebar to ensure content is centered */}
            <Container className="min-w-80 md:pl-0"></Container>
          </div>
        )}
        {!sidebar && (
          <main className="w-full pb-24">
            <Container>{children}</Container>
          </main>
        )}
        {withFooter && <Footer />}
      </div>
    </>
  )
}

export default Layout
