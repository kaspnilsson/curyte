import { Button, Heading, Link } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { exception } from '../utils/gtag'

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="w-screen h-screen flex flex-col items-center justify-center gap-8">
    <Heading className="font-bold tracking-tight leading-tight">
      Something went wrong :/
    </Heading>
    <pre>{error.name}</pre>
    <pre>{error.message}</pre>
    {error.stack && <pre>{error.stack}</pre>}
    <Link href="https://github.com/kaspnilsson/curyte-issues/issues/new?assignees=&labels=&template=bug_report.md&title=">
      <Button colorScheme="purple">File a report</Button>
    </Link>
  </div>
)

interface Props {
  children: ReactNode
}

const ErrorBoundary = ({ children }: Props) => {
  const onError = (error: Error, info: { componentStack: string }) => {
    exception(`${error.name}: ${error.message}, stack: ${info.componentStack}`)
  }

  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback} onError={onError}>
      {children}
    </ReactErrorBoundary>
  )
}

export default ErrorBoundary
