import { JSONContent } from '@tiptap/react'

export declare interface Lesson {
  authorId: string
  authorName: string
  uid: string
  title?: string
  description?: string
  created: string
  updated: string
  parentLessonId?: string
  saveCount: number
  viewCount: number
  content: JSONContent | null
  tags?: string[]
  coverImageUrl?: string
  featured?: boolean
  private?: boolean
  template?: boolean
}
