import { NodeSelection, Plugin, PluginKey } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

import { Extension } from '@tiptap/core'

// Disallow dragging on some nodes.
// See https://github.com/ueberdosis/tiptap/issues/2250
const nodeIsDraggable = (node: Node) => {
  if (node.nodeName === 'TABLE') return false
  return true
}

export const DragHandle = Extension.create({
  name: 'dragHandler',

  addProseMirrorPlugins() {
    let nodeToBeDragged: HTMLElement | null = null
    const WIDTH = 24
    const HANDLER_GAP = 48
    const dragHandler = document.createElement('div')
    dragHandler.textContent = '⠿'
    dragHandler.className = 'sm:text-sm lg:text-md xl:text-lg'
    dragHandler.style.position = 'absolute'
    dragHandler.style.cursor = 'grab'
    dragHandler.style.zIndex = '10'
    dragHandler.style.margin = '0 auto'

    function createRect(rect: DOMRect) {
      if (rect == null) {
        return null
      }
      const newRect = {
        left: rect.left + document.body.scrollLeft,
        top: rect.top + document.body.scrollTop,
        width: rect.width,
        height: rect.height,
        bottom: 0,
        right: 0,
      }
      newRect.bottom = newRect.top + newRect.height
      newRect.right = newRect.left + newRect.width
      return newRect
    }

    function removeNode(node: Node) {
      if (node && node.parentNode) {
        node.parentNode.removeChild(node)
      }
    }

    function blockPosAtCoords(
      coords: { left: number; top: number },
      view: EditorView
    ) {
      const pos = view.posAtCoords(coords)
      if (pos) {
        const temp = view.nodeDOM(pos.inside)
        const node = getDirectChild(temp ? (temp as HTMLElement) : null)
        if (node && node.nodeType === 1) {
          const desc = view.docView.nearestDesc(node, true)
          if (!(!desc || desc === view.docView)) {
            return desc.posBefore
          }
        }
      }
      return null
    }

    function dragStart(e: DragEvent, view: EditorView) {
      if (!e.dataTransfer) return
      const coords = { left: e.clientX + HANDLER_GAP, top: e.clientY }
      const pos = blockPosAtCoords(coords, view)
      if (pos != null && nodeToBeDragged) {
        view.dispatch(
          view.state.tr.setSelection(NodeSelection.create(view.state.doc, pos))
        )
        const slice = view.state.selection.content()
        e.dataTransfer.clearData()
        e.dataTransfer.setDragImage(nodeToBeDragged, 10, 10)
        view.dragging = { slice, move: true }
      }
    }

    // Get the direct child of the Editor. To cover cases when the user is hovering nested nodes.
    function getDirectChild(
      node: HTMLElement | null | undefined
    ): HTMLElement | null {
      while (node && node.parentNode) {
        if (
          node.classList?.contains('ProseMirror') ||
          (node.parentNode as HTMLElement).classList?.contains('ProseMirror')
        ) {
          break
        }
        node = node.parentNode as HTMLElement
      }
      return node || null
    }

    // Check if node has content. If not, the handler don't need to be shown.
    function nodeHasContent(view: EditorView, inside: number): boolean {
      // return !!view.nodeDOM(inside)?.textContent
      return true
    }

    function bindEventsToDragHandler(editorView: EditorView) {
      dragHandler.setAttribute('draggable', 'true')
      dragHandler.addEventListener('dragstart', (e) => dragStart(e, editorView))
      document.body.appendChild(dragHandler)
    }

    return [
      new Plugin({
        key: new PluginKey('dragHandler'),
        view: (editorView) => {
          bindEventsToDragHandler(editorView)
          return {
            destroy() {
              removeNode(dragHandler)
            },
          }
        },
        props: {
          handleDOMEvents: {
            drop(view, event) {
              setTimeout(() => {
                const node = document.querySelector(
                  '.ProseMirror-hideselection'
                )
                if (node) {
                  node.classList.remove('ProseMirror-hideselection')
                }
              })
              event.stopPropagation()
              return false
            },
            mousemove(view, event) {
              if (!view.editable) return false
              const coords = {
                left: event.clientX + HANDLER_GAP,
                top: event.clientY,
              }
              const position = view.posAtCoords(coords)
              if (position && nodeHasContent(view, position.inside)) {
                const temp = view.nodeDOM(position.inside)
                nodeToBeDragged = getDirectChild(
                  temp ? (temp as HTMLElement) : undefined
                )
                if (
                  nodeToBeDragged &&
                  nodeIsDraggable(nodeToBeDragged) &&
                  !nodeToBeDragged.classList?.contains('ProseMirror')
                ) {
                  const rect = createRect(
                    nodeToBeDragged.getBoundingClientRect()
                  )
                  if (!rect) return false
                  const win = nodeToBeDragged.ownerDocument.defaultView
                  if (!win) return false
                  rect.top += win.pageYOffset
                  rect.left += win.pageXOffset
                  dragHandler.style.left = rect.left - WIDTH + 'px'
                  dragHandler.style.top = rect.top + 'px'
                  // dragHandler.style.bottom = rect.bottom + 4 + 'px'
                  dragHandler.style.visibility = 'visible'
                } else {
                  dragHandler.style.visibility = 'hidden'
                }
              } else {
                nodeToBeDragged = null
                dragHandler.style.visibility = 'hidden'
              }
              return true
            },
          },
        },
      }),
    ]
  },
})

export default DragHandle
