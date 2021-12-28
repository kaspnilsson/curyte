export declare interface Path {
  uid: string
  authorId: string
  title?: string
  units?: Unit[]
  published?: boolean
  viewCount?: number
}

export declare interface Unit {
  uid: string
  title?: string
  lessonIds?: string[]
}
