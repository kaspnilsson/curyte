// Hacks that we should feel ashamed of.
const KASPER_UID = 'PoX0rTaDEJeb3fw28o2kSM5oABA2'
const MARVIN_UID = 'FcLTIdF6tOhMMZZzOnsSHmCQVjt1'

export const userIsAdmin = (uid: string) =>
  uid && (uid === KASPER_UID || uid === MARVIN_UID)
