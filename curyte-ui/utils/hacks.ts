import { LessonWithProfile } from '../interfaces/lesson_with_profile'

// Hacks that we should feel ashamed of.
const KASPER_UID = '1c343052-84c6-4abb-90d8-e1ac6d9400fa'
const MARVIN_UID = '96e774b1-f93a-4a71-8f33-028aa2099438'

export const userIsAdmin = (uid: string) =>
  uid && (uid === KASPER_UID || uid === MARVIN_UID)

// Used for pruning heavy properties while still on server
export const deleteLessonContentServerside = (
  lessons: LessonWithProfile[]
): LessonWithProfile[] =>
  lessons.map((l) => {
    l.content = null
    return l
  })
