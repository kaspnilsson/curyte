import { Plugin, PluginKey } from 'prosemirror-state'
import { DecorationSet } from 'prosemirror-view'

/**
 * function for image drag n drop(for tiptap)
 * @see https://gist.github.com/slava-vishnyakov/16076dff1a77ddaca93c4bccd4ec4521#gistcomment-3744392
 */
export type UploadFn = (image: File) => Promise<string>

export const imagePluginKey = new PluginKey<DecorationSet>('imageUploadPlugin')

// const findPlaceholder = (state: EditorState, id: object) => {
//   const decos = imagePluginKey.getState(state)
//   const found = decos?.find(undefined, undefined, (spec) => spec.id === id)
//   return found?.length ? found[0].from : undefined
// }

export const uploadImagePlugin = (upload: UploadFn) => {
  return new Plugin({
    key: imagePluginKey,
    props: {
      handlePaste(view, event, slice) {
        const items = Array.from(event.clipboardData?.items || [])
        const { schema } = view.state

        items.forEach((item) => {
          const image = item.getAsFile()

          if (item.type.indexOf('image') === 0) {
            event.preventDefault()
            event.stopPropagation()

            if (upload && image) {
              // A fresh object to act as the ID for this upload
              const id = {}

              // Replace the selection with a placeholder
              const { tr } = view.state
              if (!tr.selection.empty) tr.deleteSelection()
              const imageMeta = {
                type: 'add',
                pos: tr.selection.from,
                id,
              }
              tr.setMeta(imagePluginKey, imageMeta)
              view.dispatch(tr)

              upload(image).then(
                (src) => {
                  // const placholderPos = findPlaceholder(view.state, id)
                  // // If the content around the placeholder has been deleted, drop
                  // // the image
                  // if (placholderPos == null) return
                  // // Otherwise, insert it at the placeholder's position, and remove
                  // // the placeholder
                  // const removeMeta = {
                  //   type: 'remove',
                  //   id,
                  // }
                  view.dispatch(
                    view.state.tr.insert(
                      tr.selection.from,
                      schema.nodes.image.create({ src })
                    )
                  )
                  event.preventDefault()
                  return true
                },
                () => {
                  // On failure, just clean up the placeholder
                  view.dispatch(tr.setMeta(imagePluginKey, { remove: { id } }))
                }
              )
            }
          } else {
            const reader = new FileReader()
            reader.onload = (readerEvent) => {
              const node = schema.nodes.image.create({
                src: readerEvent.target?.result,
              })
              if (slice.content.firstChild) {
                slice.content.replaceChild(0, node)
              } else {
                slice.content.append(node)
              }
              return true
            }
            if (!image) return false
            reader.readAsDataURL(image)
          }
        })

        return false
      },

      handleDOMEvents: {
        drop(view, event) {
          const hasFiles = event.dataTransfer?.files?.length

          if (!hasFiles) {
            return false
          }

          const images = Array.from(event?.dataTransfer?.files || []).filter(
            (file) => /image/i.test(file.type)
          )

          if (images.length === 0) {
            return false
          }

          event.preventDefault()

          const { schema } = view.state
          const coordinates = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          })

          images.forEach(async (image) => {
            const reader = new FileReader()

            if (upload) {
              const node = schema.nodes.image.create({
                src: await upload(image),
              })
              if (!coordinates) return false
              const transaction = view.state.tr.insert(coordinates.pos, node)
              view.dispatch(transaction)
            } else {
              reader.onload = (readerEvent) => {
                if (!readerEvent || !coordinates) return false
                const node = schema.nodes.image.create({
                  src: readerEvent.target?.result,
                })
                const transaction = view.state.tr.insert(coordinates.pos, node)
                view.dispatch(transaction)
              }
              reader.readAsDataURL(image)
            }
          })
          return false
        },
      },
    },
  })
}
