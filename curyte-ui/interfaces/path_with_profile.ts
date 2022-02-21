import { Path, Profile } from '@prisma/client'

export declare interface PathWithProfile extends Path {
  profiles: Profile
}
