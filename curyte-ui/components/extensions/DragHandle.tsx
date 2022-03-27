/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NodeSelection, Plugin, PluginKey } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import ReactDOM from 'react-dom'
import { findDomRefAtPos, findParentNodeClosestToPos } from 'prosemirror-utils'

import { Extension } from '@tiptap/core'
import DragHandleButton from '../DragHandleButton'
import InsertHandleButton from '../InsertHandleButton'
import { PlusIcon } from '@heroicons/react/outline'
import { Divider } from '@chakra-ui/react'
import CuryteUIProviders from '../../contexts/CuryteUIProviders'

// Disallow dragging on some nodes.
// See https://github.com/ueberdosis/tiptap/issues/2250
const nodeIsDraggable = (node: Node) => {
  if (node.nodeName === 'TABLE') return false
  return true
}

export const DragHandle = Extension.create({
  name: 'dragHandler',

  addProseMirrorPlugins() {
    let activeNode: HTMLElement | null = null
    const WIDTH = 32
    const PADDING = 8
    const HANDLER_GAP = 48
    const dragHandler = document.createElement('div')
    dragHandler.setAttribute('id', 'drag-handler')
    dragHandler.className =
      'hidden transition sm:text-sm lg:text-md xl:text-lg drag-handler md:flex'
    let menuOpen = false

    const insertHandler = document.createElement('div')
    insertHandler.setAttribute('id', 'insert-handler')
    insertHandler.className =
      'hidden transition sm:text-sm lg:text-md xl:text-lg insert-handler md:flex'

    const renderReactComponents = () => {
      ReactDOM.render(
        <CuryteUIProviders>
          <DragHandleButton
            editor={this.editor}
            draggable={!!(activeNode && nodeIsDraggable(activeNode))}
            onOpenStateChange={(isOpen) => (menuOpen = isOpen)}
          />
        </CuryteUIProviders>,
        dragHandler
      )
      ReactDOM.render(
        <CuryteUIProviders>
          <InsertHandleButton
            forceNewBlock
            editor={this.editor}
            className="!w-full hover:bg-zinc-100 rounded"
            onOpenStateChange={(isOpen) => (menuOpen = isOpen)}
            buttonContent={
              <div className="flex items-center justify-center w-full gap-2 px-2">
                <Divider className="flex-1" />
                <PlusIcon className="w-5 h-5" />
                <Divider className="flex-1" />
              </div>
            }
          />
        </CuryteUIProviders>,
        insertHandler
      )
    }

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
          // @ts-ignore
          const desc = view.docView.nearestDesc(node, true)
          // @ts-ignore
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
      if (pos != null && activeNode && nodeIsDraggable(activeNode)) {
        view.dispatch(
          view.state.tr.setSelection(NodeSelection.create(view.state.doc, pos))
        )
        const slice = view.state.selection.content()
        e.dataTransfer.clearData()
        e.dataTransfer.setDragImage(activeNode, 10, 10)
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
    // function nodeHasContent(view: EditorView, inside: number): boolean {
    //   const n = view.nodeDOM(inside) as HTMLElement
    //   if (!n) return false
    //   return !!(
    //     n.textContent ||
    //     n.getAttribute('draggable') === 'true' ||
    //     n.classList.contains('react-renderer')
    //   )
    // }

    function bindEventsToDragHandler(editorView: EditorView) {
      dragHandler.setAttribute('draggable', 'true')
      dragHandler.addEventListener('dragstart', (e) => dragStart(e, editorView))
      document.body.appendChild(dragHandler)
    }

    const updateHandler = () => {
      if (activeNode && !activeNode.classList?.contains('ProseMirror')) {
        const rect = createRect(activeNode.getBoundingClientRect())
        if (!rect) return false
        const win = activeNode.ownerDocument.defaultView
        if (!win) return false
        rect.top += win.pageYOffset
        rect.bottom += win.pageYOffset
        rect.left += win.pageXOffset
        rect.right += win.pageXOffset
        dragHandler.style.left = rect.left - WIDTH - PADDING + 'px'
        dragHandler.style.top = rect.top + 'px'
        dragHandler.style.height = rect.height + 'px'
        dragHandler.style.visibility = 'visible'
        insertHandler.style.left = rect.left + 'px'
        insertHandler.style.width = activeNode.clientWidth + 'px'
        insertHandler.style.bottom = rect.bottom + 16 + 'px'
        insertHandler.style.top = rect.bottom + PADDING + 'px'
        insertHandler.style.height = '16px'
        insertHandler.style.visibility = 'visible'
        renderReactComponents()
      } else {
        dragHandler.style.visibility = 'hidden'
      }
    }

    return [
      new Plugin({
        key: new PluginKey('dragHandler'),
        view: (editorView) => {
          bindEventsToDragHandler(editorView)
          document.body.appendChild(insertHandler)

          return {
            destroy() {
              removeNode(dragHandler)
              removeNode(insertHandler)
            },
            update(view) {
              const node = findParentNodeClosestToPos(
                view.state.selection.$anchor,
                () => true
              )
              if (!node) return
              const el = findDomRefAtPos(node.pos, view.domAtPos.bind(view))

              activeNode = getDirectChild(el ? (el as HTMLElement) : undefined)
              updateHandler()
              return
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
              if (!view.editable || menuOpen) return false
              const coords = {
                left: event.clientX + HANDLER_GAP,
                top: event.clientY,
              }
              const position = view.posAtCoords(coords)
              if (
                position
                // && nodeHasContent(view, position.inside)
              ) {
                const temp = view.nodeDOM(position.inside)
                activeNode = getDirectChild(
                  temp ? (temp as HTMLElement) : undefined
                )
                updateHandler()
              } else {
                activeNode = null
                dragHandler.style.visibility = 'hidden'
                insertHandler.style.visibility = 'hidden'
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
