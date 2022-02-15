import { Prisma } from '@prisma/client'

export declare interface Unit extends Prisma.JsonObject {
  uid: string
  title?: string
  lessonIds?: string[]
}
