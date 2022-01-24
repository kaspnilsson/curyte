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
