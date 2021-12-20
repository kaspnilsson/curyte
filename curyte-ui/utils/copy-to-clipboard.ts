const copyToClipboard = (data: string): void => {
  debugger
  const listener = (e: ClipboardEvent) => {
    if (!e.clipboardData) return
    e.clipboardData.setData('text/plain', data)
    e.preventDefault()
    document.removeEventListener('copy', listener)
  }
  document.addEventListener('copy', listener)
  document.execCommand('copy')
}

export default copyToClipboard
