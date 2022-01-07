import { Plugin } from 'prosemirror-state'
import { Extension } from '@tiptap/core'
import isMarkdown from '../../../utils/is-markdown'

/**
 * Add support for additional syntax that users paste even though it isn't
 * supported by the markdown parser directly by massaging the text content.
 *
 * @param text The incoming pasted plain text
 */
function normalizePastedMarkdown(text: string): string {
  // find checkboxes not contained in a list and wrap them in list items
  const CHECKBOX_REGEX = /^\s?(\[(X|\s|_|-)\]\s(.*)?)/gim

  while (text.match(CHECKBOX_REGEX)) {
    text = text.replace(CHECKBOX_REGEX, (match) => `- ${match.trim()}`)
  }

  return text
}

const PasteHandler = Extension.create({
  name: 'markdownPaste',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handlePaste: (view, event: ClipboardEvent) => {
            if (view.props.editable && !view.props.editable(view.state)) {
              return false
            }
            if (!event.clipboardData) return false

            if (event.clipboardData.files && event.clipboardData.files.length) {
              const images = Array.from(event.clipboardData.files).filter(
                (file) => /image/i.test(file.type)
              )
              if (images) {
              }
            }

            const text = event.clipboardData.getData('text/plain')
            const html = event.clipboardData.getData('text/html')

            // If the HTML on the clipboard is from Prosemirror then the best
            // compatability is to just use the HTML parser, regardless of
            // whether it "looks" like Markdown.
            if (html?.includes('data-pm-slice')) {
              return false
            }

            // If the text on the clipboard looks like Markdown OR there is no
            // html on the clipboard then try to parse content as Markdown
            if (isMarkdown(text) || html.length === 0) {
              event.preventDefault()

              debugger
              //   const slice = paste.slice(0)

              //   const transaction = view.state.tr.replaceSelection(slice)
              // view.dispatch(transaction)
              return true
            }
            debugger
            // otherwise use the default HTML parser which will handle all paste
            // "from the web" events
            return false
          },
        },
      }),
    ]
  },
})
export default PasteHandler
