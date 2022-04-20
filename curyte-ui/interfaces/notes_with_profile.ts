import { Lesson, Notes as prismaNotes, Profile } from '@prisma/client'
import { Feedback } from './feedback_with_profile'

export declare interface Notes extends prismaNotes {
  profiles: Profile
  lessons?: Lesson
  feedback?: Feedback[]
}
