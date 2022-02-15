import { Lesson, Profile } from '@prisma/client'

export declare interface LessonWithProfile extends Lesson {
  profiles: Profile
}
