import { Node } from '@tiptap/core'
import { Plugin } from 'prosemirror-state'
import { v4 as uuidv4 } from 'uuid'

/**
 * Types that should have an ID in them
 */
export const types = new Set(['heading'])

/**
 * Adds a unique ID to each type in [types]
 */
const AutoId = Node.create({
  name: 'autoId',

  addGlobalAttributes() {
    return [
      {
        types,
        attributes: {
          id: {
            default: null,
            keepOnSplit: false,
          },
        },
      },
    ]
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        appendTransaction: (transactions, oldState, newState) => {
          const existingIds = new Set<string>()
          // no changes
          if (newState.doc === oldState.doc) {
            return
          }
          const tr = newState.tr

          newState.doc.descendants((node, pos, parent) => {
            // Check for duplicate IDs
            let id = node.attrs.id
            if (id && existingIds.has(id)) {
              id = ''
            } else if (id) {
              existingIds.add(id)
            }
            if (
              node.isBlock &&
              parent === newState.doc &&
              !id &&
              types.has(node.type.name)
            ) {
              id = uuidv4()
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                id,
              })
            }
          })

          return tr
        },
      }),
    ]
  },
})

export default AutoId
