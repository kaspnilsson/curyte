import { Lesson, Notes, Profile } from '@prisma/client'

export declare interface NotesWithProfile extends Notes {
  profiles: Profile
  lessons?: Lesson
}
