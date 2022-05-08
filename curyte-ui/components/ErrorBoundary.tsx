import { Button, Link } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { exception } from '../utils/gtag'

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="flex flex-col items-center justify-center w-screen h-screen gap-8">
    <span className="font-bold leading-tight tracking-tighter font-xl">
      Something went wrong :/
    </span>
    <pre>{error.name}</pre>
    <pre>{error.message}</pre>
    {error.stack && <pre>{error.stack}</pre>}
    <Link
      href="https://github.com/kaspnilsson/curyte-issues/issues/new?assignees=&labels=&template=bug_report.md&title="
      target="_blank"
    >
      <a>
        <Button colorScheme="black" className="hover:no-underline">
          File a report
        </Button>
      </a>
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
