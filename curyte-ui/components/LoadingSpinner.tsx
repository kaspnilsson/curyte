const LoadingSpinner = () => (
  <div className="flex justify-center items-center absolute top-0 bottom-0 left-0 right-0 opacity-50 z-10 bg-white">
    <div
      className="
    animate-spin
    rounded-full
    h-32
    w-32
    border-t-4 border-b-4 border-purple-500
  "
    ></div>
  </div>
);

export default LoadingSpinner;
