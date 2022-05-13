import CuryteLogo from './CuryteLogo'

interface Props {
  message?: string
}

const LoadingSpinner = ({ message = 'loading...' }: Props) => (
  <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex flex-col items-center justify-center h-screen gap-8 bg-white text-zinc-500">
    <div className="text-xl font-bold leading-tight tracking-tighter md:text-2xl ">
      {message}
    </div>
    <div className="flex items-center justify-center rounded-full shadow-2xl w-36 h-36 shadow-violet-500/50 bg-zinc-500">
      <CuryteLogo
        width="64px"
        height="64px"
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
