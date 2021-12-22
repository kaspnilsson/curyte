const LoadingSpinner = () => (
  <div className="absolute top-0 bottom-0 left-0 right-0 z-10 flex items-center justify-center h-screen bg-white opacity-50">
    <div className="w-32 h-32 border-t-4 border-b-4 rounded-full animate-spin border-zinc-900"></div>
  </div>
)

export default LoadingSpinner
