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
}

const Layout = ({
  children,
  headerChildren,
  withFooter = true,
  isSticky = true,
  showProgressBar,
  sidebar,
  title = 'Curyte',
}: Props) => {
  return (
    <>
      <div className="min-h-screen relative">
        <Header
          showProgressBar={showProgressBar}
          isSticky={isSticky}
          title={title}
        >
          {headerChildren}
        </Header>
        <div className="flex flex-col md:flex-row">
          {sidebar && (
            <div className="flex md:flex-col md:sticky md:top-16 relative self-start w-full md:w-96 2xl:w-1/6 pl-4 overflow-hidden mb-8">
              {sidebar}
            </div>
          )}
          {/* keep pb-24 in sync with footer height */}
          <main className="pb-24 m-auto w-full 2xl:w-2/3">{children}</main>
          {/* empty sidebar to ensure content is centered */}
          {sidebar && <div className="md:w-96 2xl:w-1/6 pr-4"></div>}
        </div>
        {withFooter && <Footer />}
      </div>
    </>
  )
}

export default Layout
