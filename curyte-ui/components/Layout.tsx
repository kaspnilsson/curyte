import React from 'react'
import Footer from './Footer'
import Header, { BreadcrumbProps } from './Header'
import Container from './Container'
import { FullSidebar } from './AppSidebar'

type Props = {
  children: React.ReactNode
  withFooter?: boolean
  title?: string
  className?: string
  withSearch?: boolean
  breadcrumbs?: BreadcrumbProps[]
  rightContent?: React.ReactNode
}

const Layout = ({
  children,
  withFooter = true,
  title = 'Curyte',
  className = '',
  breadcrumbs,
  rightContent = null,
}: Props) => {
  return (
    <div className={'relative min-h-screen max-w-screen flex ' + className}>
      <nav className="relative hidden w-64 border-r lg:flex">
        <FullSidebar />
      </nav>
      <main className="flex flex-col flex-1">
        <Header title={title} breadcrumbs={breadcrumbs}></Header>
        <div className="relative flex flex-col justify-between flex-1 pt-12">
          <Container className="mb-24">
            {!rightContent && children}{' '}
            {rightContent && (
              <div className="flex flex-col-reverse items-start gap-8 xl:gap-12 2xl:gap-16 md:flex-row">
                <div className="flex-1">{children}</div>
                <div className="md:sticky md:top-20 md:w-64">
                  {rightContent}
                </div>
              </div>
            )}
          </Container>
          {withFooter && <Footer />}
        </div>
      </main>
    </div>
  )
}

export default Layout
