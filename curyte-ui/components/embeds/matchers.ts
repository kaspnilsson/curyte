export const imageUrlMatchRegex = new RegExp(
  /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))/i
)

export const pdfUrlMatchRegex = new RegExp(/(http)?s?:?(\/\/[^"']*\.(?:pdf))/i)

export const urlMatchRegex = new RegExp(
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/i
)

export const youtubeUrlMatchRegex = new RegExp(
  /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
)

export const googleDocsUrlMatchRegex = new RegExp(
  '^https?://docs.google.com/document/(.*)$'
)

export const googleSlidesUrlMatchRegex = new RegExp(
  '^https?://docs.google.com/presentation/d/(.*)$'
)

export const googleSheetsUrlMatchRegex = new RegExp(
  '^https?://docs.google.com/spreadsheets/d/(.*)$'
)

export const googleDriveUrlMatchRegex = new RegExp(
  '^https?://drive.google.com/file/d/(.*)$'
)

export const googleDrawingsUrlMatchRegex = new RegExp(
  '^https://docs.google.com/drawings/d/(.*)/(edit|preview)(.*)$'
)

export const vimeoUrlMatchRegex =
  /(http|https)?:\/\/(www\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|)(\d+)(?:|\/\?)/i

export const curyteLessonUrlMatchRegex =
  /(https?:\/\/(www\.)?)?curyte.com\/lessons\/(.+)/

export const specialUrlMatchers = [
  imageUrlMatchRegex,
  youtubeUrlMatchRegex,
  googleDocsUrlMatchRegex,
  googleSlidesUrlMatchRegex,
  googleSheetsUrlMatchRegex,
  googleDriveUrlMatchRegex,
  googleDrawingsUrlMatchRegex,
  curyteLessonUrlMatchRegex,
]
