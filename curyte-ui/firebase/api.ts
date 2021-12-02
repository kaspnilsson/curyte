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
  let fn:
    | firebase.firestore.CollectionReference<firebase.firestore.DocumentData>
    | firebase.firestore.Query<firebase.firestore.DocumentData> = firebase
    .firestore()
    .collection('lessons')
  for (const clause of whereClauses) {
    fn = fn.where(clause.fieldPath, clause.opStr, clause.value)
  }
  return fn
    .orderBy('created', 'desc')
    .get()
    .then((result) => {
      const mapped: LessonStorageModel[] = []
      result.docs.forEach((result) =>
        mapped.push(result.data() as LessonStorageModel)
      )
      return mapped
    })
}

/**
 * Gets a lesson from firestore.
 *
 * @param uid the ID of the lesson to fetch
 * @returns
 */
export async function getLesson(uid: string): Promise<LessonStorageModel> {
  return (
    await firebase.firestore().collection('lessons').doc(uid).get()
  ).data() as LessonStorageModel
}

/**
 * Deletes a lesson from firestore.
 *
 * @param uid the ID of the lesson to fetch
 * @returns
 */
export async function deleteLesson(uid: string): Promise<void> {
  return await firebase.firestore().collection('lessons').doc(uid).delete()
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
  if (!uid) {
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
}

export async function logLessonView(uid: string): Promise<void> {
  await firebase
    .firestore()
    .collection('lessons')
    .doc(uid)
    .update({ viewCount: firebase.firestore.FieldValue.increment(1) })
}

/**
 * Gets an author from Firestore.
 *
 * @param uid string
 * @returns Promise<Author>
 */
export async function getAuthor(uid: string): Promise<Author> {
  return (
    await firebase.firestore().collection('users').doc(uid).get()
  ).data() as Author
}

export async function updateAuthor(author: Author): Promise<void> {
  return await firebase
    .firestore()
    .collection('users')
    .doc(author.uid)
    .set(author)
}

const computeSavedLessonUid = (savedLesson: SavedLesson): string =>
  `${savedLesson.userId}:${savedLesson.lessonId}`

export async function saveLesson(lessonId: string): Promise<void> {
  if (!firebase.auth().currentUser) return
  const savedLesson = { lessonId, userId: firebase.auth().currentUser!.uid }
  await firebase
    .firestore()
    .collection('savedLessons')
    .doc(computeSavedLessonUid(savedLesson))
    .set(savedLesson)
}

export async function removeSavedLesson(lessonId: string): Promise<void> {
  if (!firebase.auth().currentUser) return
  const savedLesson = { lessonId, userId: firebase.auth().currentUser!.uid }
  return await firebase
    .firestore()
    .collection('savedLessons')
    .doc(computeSavedLessonUid(savedLesson))
    .delete()
}

export async function getUserHasSavedLesson(
  lessonId: string
): Promise<boolean> {
  if (!firebase.auth().currentUser) return false
  return (
    await firebase
      .firestore()
      .collection('savedLessons')
      .doc(
        computeSavedLessonUid({
          userId: firebase.auth().currentUser!.uid,
          lessonId,
        })
      )
      .get()
  ).exists
}
