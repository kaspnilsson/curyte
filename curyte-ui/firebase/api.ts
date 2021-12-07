import assert from 'assert'
import { parseISO } from 'date-fns'
import { Author, SavedLesson } from '../interfaces/author'
import { Lesson } from '../interfaces/lesson'
import { Tag } from '../interfaces/tag'
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
  whereClauses: WhereClause[]
): Promise<Lesson[]> {
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
      const mapped: Lesson[] = []
      result.docs.forEach((result) => mapped.push(result.data() as Lesson))
      mapped.sort(
        (a, b) =>
          parseISO(b.created).getMilliseconds() -
          parseISO(a.created).getMilliseconds()
      )
      return mapped
    })
  } catch (e) {
    console.error(e)
    debugger
    throw e
  }
}

/**
 * Gets lessons from firestore by applying clauses.
 *
 * @param whereClauses
 * @returns
 */
export async function getDrafts(
  whereClauses: WhereClause[] = []
): Promise<Lesson[]> {
  try {
    let fn:
      | firebase.firestore.CollectionReference<firebase.firestore.DocumentData>
      | firebase.firestore.Query<firebase.firestore.DocumentData> = firebase
      .firestore()
      .collection('drafts')
    for (const clause of whereClauses) {
      fn = fn.where(clause.fieldPath, clause.opStr, clause.value)
    }
    return fn.get().then((result) => {
      const mapped: Lesson[] = []
      result.docs.forEach((result) => mapped.push(result.data() as Lesson))
      mapped.sort(
        (a, b) =>
          parseISO(b.created).getMilliseconds() -
          parseISO(a.created).getMilliseconds()
      )
      return mapped
    })
  } catch (e) {
    console.error(e)
    debugger
    throw e
  }
}

/**
 * Gets a lesson from firestore.
 *
 * @param uid the ID of the lesson to fetch
 * @returns
 */
export async function getLesson(uid: string): Promise<Lesson> {
  try {
    return (
      await firebase.firestore().collection('lessons').doc(uid).get()
    ).data() as Lesson
  } catch (e) {
    console.error(e)
    debugger
    throw e
  }
}

/**
 * Gets a lesson from firestore.
 *
 * @param uid the ID of the lesson to fetch
 * @returns
 */
export async function getDraft(uid: string): Promise<Lesson> {
  try {
    if (!firebase.auth().currentUser) throw new Error('Not logged in')
    return (
      await firebase.firestore().collection('drafts').doc(uid).get()
    ).data() as Lesson
  } catch (e) {
    console.error(e)
    debugger
    throw e
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
    if (!firebase.auth().currentUser) throw new Error('Not logged in')
    return await firebase.firestore().collection('lessons').doc(uid).delete()
  } catch (e) {
    console.error(e)
    debugger
    throw e
  }
}

/**
 * Deletes a lesson from firestore.
 *
 * @param uid the ID of the lesson to fetch
 * @returns
 */
export async function deleteDraft(uid: string): Promise<void> {
  try {
    if (!firebase.auth().currentUser) throw new Error('Not logged in')
    return await firebase.firestore().collection('drafts').doc(uid).delete()
  } catch (e) {
    console.error(e)
    debugger
    throw e
  }
}

/**
 * Updates a lesson. Creates a new lesson if no UID is provided.
 * @param draft
 * @returns
 */
export async function createDraft(draft: Lesson): Promise<string> {
  try {
    if (!firebase.auth().currentUser) throw new Error('Not logged in')
    draft.uid = Date.now().toString()
    await firebase.firestore().collection('drafts').doc(draft.uid).set(draft)
    return draft.uid
  } catch (e) {
    console.error(draft)
    console.error(e)
    debugger
    throw e
  }
}

/**
 * Updates a lesson. Creates a new lesson if no UID is provided.
 * @param draft
 * @returns
 */
export async function updateDraft(draft: Lesson): Promise<void> {
  try {
    assert(draft.uid)
    await firebase.firestore().collection('drafts').doc(draft.uid).update(draft)
  } catch (e) {
    console.error(draft)
    console.error(e)
    debugger
    throw e
  }
}

export async function publishLesson(
  lesson: Lesson,
  draftId?: string
): Promise<string> {
  try {
    lesson.uid =
      lesson.title
        .toLocaleLowerCase()
        .replace(/[^a-z 0-9]/g, '')
        .replace(/ /g, '-')
        .substring(0, 32) + `-${Date.now()}`
    await firebase.firestore().collection('lessons').doc(lesson.uid).set(lesson)
    if (draftId) {
      // Intentionally unawaited
      firebase.firestore().collection('drafts').doc(draftId).delete()
    }
    return lesson.uid
  } catch (e) {
    console.error(lesson)
    console.error(e)
    debugger
    throw e
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
    console.error(e)
    debugger
    throw e
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
    console.error(e)
    debugger
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
    console.error(e)
    debugger
    throw e
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
    console.error(e)
    debugger
    throw e
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
    console.error(e)
    debugger
    throw e
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
    console.error(e)
    debugger
    throw e
  }
}

export async function getTag(tagText: string): Promise<Tag> {
  try {
    return (
      await firebase.firestore().collection('tags').doc(tagText).get()
    ).data() as Tag
  } catch (e) {
    console.error(e)
    debugger
    throw e
  }
}

export async function logTagView(tagText: string): Promise<void> {
  try {
    await firebase
      .firestore()
      .collection('tags')
      .doc(tagText)
      .update({
        tag: tagText,
        viewCount: firebase.firestore.FieldValue.increment(1),
      })
  } catch (e) {
    console.error(e)
    debugger
    throw e
  }
}
