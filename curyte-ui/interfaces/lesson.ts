export declare interface LessonSection {
  title: string
  content: string
}

export declare interface LessonStorageModel {
  authorId: string
  authorName: string
  uid: string
  title: string
  description: string
  created: string
  updated: string
  sections: LessonSection[]
  published: boolean
  parentLessonId?: string
  saveCount: number
}
