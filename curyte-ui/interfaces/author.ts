export declare interface Author {
  displayName: string
  email: string
  photoURL: string
  uid: string
  bio: string
  username: string
  links?: Links
  savedLessons: string[]
}

export declare interface Links {
  twitter?: string
  linkedin?: string
  personalSite?: string
  publicEmail?: string
  venmo?: string
}

export declare interface SavedLesson {
  lessonId: string
  userId: string
}
