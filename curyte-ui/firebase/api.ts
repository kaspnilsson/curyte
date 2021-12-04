import { parseISO } from 'date-fns'
import { Author, SavedLesson } from '../interfaces/author'
import { LessonStorageModel } from '../interfaces/lesson'
import firebase from './clientApp'

export interface WhereClause {
  fieldPath: string | firebase.firestore.FieldPath
  opStr: firebase.firestore.WhereFilterOp
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
}

/**
 * Gets lessons from firestore by applying clauses.
 *
 * @param whereClauses
 * @returns
 */
export async function getLessons(
  whereClauses: WhereClause[] = []
): Promise<LessonStorageModel[]> {
  try {
    let fn:
      | firebase.firestore.CollectionReference<firebase.firestore.DocumentData>
      | firebase.firestore.Query<firebase.firestore.DocumentData> = firebase
      .firestore()
      .collection('lessons')
    for (const clause of whereClauses) {
      fn = fn.where(clause.fieldPath, clause.opStr, clause.value)
    }
    return fn.get().then((result) => {
      const mapped: LessonStorageModel[] = []
      result.docs.forEach((result) =>
        mapped.push(result.data() as LessonStorageModel)
      )
      mapped.sort(
        (a, b) =>
          parseISO(b.created).getMilliseconds() -
          parseISO(a.created).getMilliseconds()
      )
      return mapped
    })
  } catch (e) {
    debugger
    console.error(e)
    return []
  }
}

/**
 * Gets a lesson from firestore.
 *
 * @param uid the ID of the lesson to fetch
 * @returns
 */
export async function getLesson(uid: string): Promise<LessonStorageModel> {
  try {
    return (
      await firebase.firestore().collection('lessons').doc(uid).get()
    ).data() as LessonStorageModel
  } catch (e) {
    debugger
    console.error(e)
    return {} as LessonStorageModel
  }
}

/**
 * Deletes a lesson from firestore.
 *
 * @param uid the ID of the lesson to fetch
 * @returns
 */
export async function deleteLesson(uid: string): Promise<void> {
  try {
    return await firebase.firestore().collection('lessons').doc(uid).delete()
  } catch (e) {
    debugger
    console.error(e)
  }
}

/**
 * Updates a lesson. Creates a new lesson if no UID is provided.
 * @param lesson
 * @param uid optional, the lesson UID to update
 * @returns
 */
export async function updateLesson(
  lesson: LessonStorageModel,
  uid?: string
): Promise<string> {
  try {
    if (!uid || uid === '') {
      uid =
        lesson.title
          .toLocaleLowerCase()
          .replace(/[^a-z 0-9]/g, '')
          .replace(/ /g, '-')
          .substring(0, 32) + `-${Date.now()}`
      lesson.uid = uid
    }
    await firebase.firestore().collection('lessons').doc(uid).set(lesson)
    return uid
  } catch (e) {
    debugger
    console.error(e)
    return ''
  }
}

export async function logLessonView(uid: string): Promise<void> {
  try {
    await firebase
      .firestore()
      .collection('lessons')
      .doc(uid)
      .update({ viewCount: firebase.firestore.FieldValue.increment(1) })
  } catch (e) {
    debugger
    console.error(e)
  }
}

/**
 * Gets an author from Firestore.
 *
 * @param uid string
 * @returns Promise<Author>
 */
export async function getAuthor(uid: string): Promise<Author> {
  try {
    return (
      await firebase.firestore().collection('users').doc(uid).get()
    ).data() as Author
  } catch (e) {
    debugger
    console.error(e)
    return {} as Author
  }
}

export async function updateAuthor(author: Author): Promise<void> {
  try {
    return await firebase
      .firestore()
      .collection('users')
      .doc(author.uid)
      .set(author)
  } catch (e) {
    debugger
    console.error(e)
  }
}

const computeSavedLessonUid = (savedLesson: SavedLesson): string =>
  `${savedLesson.userId}:${savedLesson.lessonId}`

export async function saveLessonForCurrentUser(
  lessonId: string
): Promise<void> {
  try {
    if (!firebase.auth().currentUser) return
    const savedLesson = {
      lessonId,
      userId: firebase.auth().currentUser?.uid || '',
    }
    await firebase
      .firestore()
      .collection('savedLessons')
      .doc(computeSavedLessonUid(savedLesson))
      .set(savedLesson)
  } catch (e) {
    debugger
    console.error(e)
  }
}

export async function removeSavedLessonForCurrentUser(
  lessonId: string
): Promise<void> {
  try {
    if (!firebase.auth().currentUser) return
    const savedLesson = {
      lessonId,
      userId: firebase.auth().currentUser?.uid || '',
    }
    return await firebase
      .firestore()
      .collection('savedLessons')
      .doc(computeSavedLessonUid(savedLesson))
      .delete()
  } catch (e) {
    debugger
    console.error(e)
  }
}

export async function getCurrentUserHasSavedLesson(
  lessonId: string
): Promise<boolean> {
  try {
    if (!firebase.auth().currentUser) return false
    return (
      await firebase
        .firestore()
        .collection('savedLessons')
        .doc(
          computeSavedLessonUid({
            userId: firebase.auth().currentUser?.uid || '',
            lessonId,
          })
        )
        .get()
    ).exists
  } catch (e) {
    debugger
    console.error(e)
    return false
  }
}
