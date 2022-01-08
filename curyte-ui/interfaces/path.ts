export declare interface Path {
  uid: string
  authorId: string
  title?: string
  units?: Unit[]
  published?: boolean
  viewCount?: number
  created?: string
  updated?: string
}

export declare interface Unit {
  uid: string
  title?: string
  lessonIds?: string[]
}
