export declare interface Path {
  uid: string
  authorId: string
  title?: string
  units?: Unit[]
  private?: boolean
  viewCount?: number
  created?: string
  updated?: string
  coverImageUrl?: string
}

export declare interface Unit {
  uid: string
  title?: string
  lessonIds?: string[]
}
