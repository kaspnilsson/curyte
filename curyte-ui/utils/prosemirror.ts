import { ResolvedPos, Node as ProsemirrorNode } from 'prosemirror-model'

export const getCurrentlySelectedNodes = (
  pos: ResolvedPos
): ProsemirrorNode[] => {
  const output = []
  // Start at 1 because we always start with doc
  for (let i = 1; i <= pos.depth; i++) {
    output.push(pos.node(i))
  }

  return output
}

// Get the direct child of the Editor. To cover cases when the user is hovering nested nodes.
export const getDirectChild = (
  node: HTMLElement | null | undefined
): HTMLElement | null => {
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
