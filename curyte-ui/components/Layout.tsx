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
  leftSidebar?: React.ReactNode
  rightSidebar?: React.ReactNode
  className?: string
  withSearch?: boolean
}

const Layout = ({
  children,
  withSearch = true,
  withFooter = true,
  isSticky = true,
  showProgressBar,
  leftSidebar = null,
  rightSidebar = null,
  title = 'Curyte',
  className = '',
}: Props) => {
  return (
    <>
      <div className={'relative min-h-screen max-w-screen ' + className}>
        <Header
          showProgressBar={showProgressBar}
          isSticky={isSticky}
          withSearch={withSearch}
          title={title}
        ></Header>
        {(leftSidebar || rightSidebar) && (
          <div className="grid grid-cols-1 md:grid-cols-[minmax(15%,1fr)_minmax(70%,1200px)_minmax(15%,1fr)] max-w-screen md:flex-row">
            <Container className="relative flex self-start mb-8 md:flex-col md:sticky md:top-16 min-w-80 md:pr-0">
              {leftSidebar}
            </Container>
            {/* keep pb-24 in sync with footer height */}
            <main className="w-full pb-24 max-w-[1200px]">
              <Container className="flex-1">{children}</Container>
            </main>
            <Container className="relative flex self-start mb-8 md:flex-col md:sticky md:top-16 min-w-80 md:pl-0">
              {rightSidebar}
            </Container>
          </div>
        )}
        {!leftSidebar && (
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
