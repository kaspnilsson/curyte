import CuryteLogo from './CuryteLogo'

interface Props {
  message?: string
}

const LoadingSpinner = ({ message = 'loading...' }: Props) => (
  <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex flex-col items-center justify-center h-screen gap-8 bg-white text-zinc-500">
    <div className="text-xl font-bold leading-tight tracking-tighter md:text-2xl ">
      {message}
    </div>
    <div className="flex items-center justify-center w-48 h-48 rounded-full shadow-2xl shadow-blue-500/50 bg-zinc-500">
      <CuryteLogo
        width="96px"
        height="96px"
        color="white"
        className="animate-pulse"
      />
    </div>
    <div className="invisible text-xl font-bold leading-tight tracking-tighter md:text-2xl">
      {message}
    </div>
  </div>
)

export default LoadingSpinner
