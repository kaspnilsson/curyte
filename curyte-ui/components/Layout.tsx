import React from 'react'
import Footer from './Footer'
import Header, { BreadcrumbProps } from './Header'
import Container from './Container'
import { FullSidebar } from './AppSidebar'
import classNames from 'classnames'

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
    <div className={'relative min-h-screen max-w-[100vw] flex ' + className}>
      <nav className="relative z-[11] hidden w-48 bg-white border-r xl:w-64 lg:flex flex-0">
        <FullSidebar />
      </nav>
      <main className="flex flex-col flex-1 max-w-full min-w-0">
        <Header title={title} breadcrumbs={breadcrumbs}></Header>
        <div className="relative flex flex-col justify-between flex-1 pt-12">
          <Container className="mb-24">
            {!rightContent && children}
            {rightContent && (
              <div
                className={classNames(
                  'flex items-start gap-8 xl:gap-12 2xl:gap-16 md:flex-row',
                  {
                    'flex-col': rightContentWrapBehavior === 'normal',
                    'flex-col-reverse': rightContentWrapBehavior === 'reverse',
                  }
                )}
              >
                <div className="flex-1 min-w-0">{children}</div>
                <div className="md:sticky md:top-20 md:w-40 xl:w-64">
                  {rightContent}
                </div>
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
