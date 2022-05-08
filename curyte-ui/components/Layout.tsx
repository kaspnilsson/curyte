import React from 'react'
import Footer from './Footer'
import Header, { BreadcrumbProps } from './Header'
import Container from './Container'
import { FullSidebar } from './AppSidebar'
import classNames from 'classnames'
import StickyBox from 'react-sticky-box'

type Props = {
  children: React.ReactNode
  footer?: React.ReactNode
  title?: string
  className?: string
  withSearch?: boolean
  breadcrumbs?: BreadcrumbProps[]
  rightContent?: React.ReactNode
  rightContentWrapBehavior?: 'normal' | 'reverse'
}

const Layout = ({
  children,
  footer = null,
  title = 'Curyte',
  className = '',
  breadcrumbs,
  rightContent = null,
  rightContentWrapBehavior = 'normal',
}: Props) => {
  return (
    <div
      className={'relative min-h-screen-ios max-w-[100vw] flex ' + className}
    >
      <nav className="relative z-0 hidden w-16 bg-white border-r md:flex flex-0">
        <FullSidebar />
      </nav>
      <main className="relative flex flex-col flex-1 max-w-full min-w-0">
        <Header title={title} breadcrumbs={breadcrumbs}></Header>
        <div className="flex flex-col justify-between flex-1 pt-12">
          <Container className="mb-24 z-[1]">
            {!rightContent && children}
            {rightContent && (
              <div
                className={classNames(
                  'flex items-start gap-4 lg:gap-8 xl:gap-12 2xl:gap-16 md:flex-row',
                  {
                    'flex-col': rightContentWrapBehavior === 'normal',
                    'flex-col-reverse': rightContentWrapBehavior === 'reverse',
                  }
                )}
              >
                <div className="flex-1 w-full max-w-full min-w-0">
                  {children}
                </div>
                <StickyBox
                  className="hidden md:block md:w-56 lg:w-64 xl:w-72 2xl:w-80"
                  // 20px + 64px for header size
                  offsetTop={84}
                  offsetBottom={20}
                >
                  {rightContent}
                </StickyBox>
                <div className="block max-w-full md:hidden">{rightContent}</div>
              </div>
            )}
          </Container>
          {footer || <Footer />}
        </div>
      </main>
    </div>
  )
}

export default Layout
