import React from 'react'
import Footer from './Footer'
import Header from './Header'

type Props = {
  children: React.ReactNode
  headerChildren?: React.ReactNode
  withFooter?: boolean
  showProgressBar?: boolean
}

const Layout = ({
  children,
  headerChildren,
  withFooter = true,
  showProgressBar,
}: Props) => {
  return (
    <>
      <div className="min-h-screen relative">
        <Header showProgressBar={showProgressBar}>{headerChildren}</Header>
        {/* keep pb-24 in sync with footer height */}
        <main className="pb-24 m-auto w-full lg:w-2/3">{children}</main>
        {withFooter && <Footer />}
      </div>
    </>
  )
}

export default Layout
