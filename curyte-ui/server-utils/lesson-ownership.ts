import prismaClient from '../lib/prisma'
import { userIsAdmin } from '../utils/hacks'

export const userCanEditLesson = async (
  lessonUid: string,
  authorId: string
): Promise<boolean> => {
  if (userIsAdmin(authorId)) return true

  const lesson = await prismaClient.lesson.findFirst({
    where: { uid: lessonUid },
  })

  // TODO(kaspern): upgrade for multi-editor
  return !!(lesson && lesson.authorId === authorId)
}

export const userCanEditPath = async (
  pathUid: string,
  authorId: string
): Promise<boolean> => {
  if (userIsAdmin(authorId)) return true

  const path = await prismaClient.path.findFirst({
    where: { uid: pathUid },
  })

  // TODO(kaspern): upgrade for multi-editor
  return !!(path && path.authorId === authorId)
}
