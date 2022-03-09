import { Notes, Profile } from '@prisma/client'

export declare interface NotesWithProfile extends Notes {
  profiles: Profile
}
