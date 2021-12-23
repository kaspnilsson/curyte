import React from 'react'
import Footer from './Footer'
import Header from './Header'

type Props = {
  children: React.ReactNode
  headerChildren?: React.ReactNode
  withFooter?: boolean
  isSticky?: boolean
  showProgressBar?: boolean
  title?: string
  sidebar?: React.ReactNode
  className?: string
}

const Layout = ({
  children,
  headerChildren,
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
          title={title}
        >
          {headerChildren}
        </Header>
        <div className="flex flex-col max-w-full md:flex-row">
          {sidebar && (
            <>
              <div className="relative flex self-start w-full px-4 mb-8 md:w-1/6 md:flex-col md:sticky md:top-16 min-w-80">
                {sidebar}
              </div>
              {/* keep pb-24 in sync with footer height */}
              <main className="w-full pb-24 m-auto 2xl:w-2/3">{children}</main>
              {/* empty sidebar to ensure content is centered */}
              <div className="pr-4 md:w-1/6 min-w-80"></div>
            </>
          )}
          {!sidebar && <main className="w-full pb-24 m-auto">{children}</main>}
        </div>
        {withFooter && <Footer />}
      </div>
    </>
  )
}

export default Layout
