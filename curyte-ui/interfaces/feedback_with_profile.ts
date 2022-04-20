import { Feedback as prismaFeedback, Profile } from '@prisma/client'

export declare interface Feedback extends prismaFeedback {
  profiles: Profile
}
