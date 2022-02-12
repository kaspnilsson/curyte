import assert from 'assert'
import {
  FieldPath,
  WhereFilterOp,
  CollectionReference,
  DocumentData,
  Query,
  collection,
  getDocs,
  query,
  doc,
  getDoc,
  deleteDoc,
  setDoc,
  increment,
  updateDoc,
  QueryConstraint,
} from 'firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from 'firebase/storage'
import { Author, SavedLesson } from '../interfaces/author'
import { Lesson } from '../interfaces/lesson'
import { Path } from '../interfaces/path'
import { Tag } from '../interfaces/tag'
import { exception } from '../utils/gtag'
import { uuid } from '../utils/uuid'
import { auth, firestore, storage } from './clientApp'

export interface WhereClause {
  fieldPath: string | FieldPath
  opStr: WhereFilterOp
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
  queryConstraints: QueryConstraint[],
  includeLessonContent = false
): Promise<Lesson[]> {
  try {
    const q: CollectionReference<DocumentData> | Query<DocumentData> = query(
      collection(firestore, 'lessons'),
      ...queryConstraints
    )
    return getDocs(q).then((result) => {
      const mapped: Lesson[] = []
      result.docs.forEach((result) => {
        const lesson = result.data() as Lesson
        if (!includeLessonContent) lesson.content = null
        mapped.push(lesson)
      })
      return mapped
    })
  } catch (e) {
    exception(e as string)
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
      await getDoc(doc(collection(firestore, 'lessons'), uid))
    ).data() as Lesson
  } catch (e) {
    exception(e as string)
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
    if (!auth.currentUser) throw new Error('Not logged in')
    return await deleteDoc(doc(collection(firestore, 'lessons'), uid))
  } catch (e) {
    exception(e as string)
    throw e
  }
}

/**
 * Creates a new lesson.
 * @param lesson
 * @returns
 */
export async function createLesson(lesson: Lesson): Promise<string> {
  try {
    if (!auth.currentUser) throw new Error('Not logged in')
    lesson.uid = uuid()
    await setDoc(doc(collection(firestore, 'lessons'), lesson.uid), lesson)
    return lesson.uid
  } catch (e) {
    console.error(lesson)
    exception(e as string)
    throw e
  }
}

export async function updateLesson(lesson: Lesson): Promise<string> {
  try {
    assert(lesson.uid)
    await setDoc(doc(collection(firestore, 'lessons'), lesson.uid), lesson)
    return lesson.uid
  } catch (e) {
    console.error(lesson)
    exception(e as string)
    throw e
  }
}

export async function setLessonFeatured(
  uid: string,
  featured: boolean
): Promise<void> {
  try {
    assert(uid)
    await updateDoc(doc(collection(firestore, 'lessons'), uid), {
      featured,
    })
  } catch (e) {
    exception(e as string)
    throw e
  }
}

export async function setLessonTemplate(
  uid: string,
  template: boolean
): Promise<void> {
  try {
    assert(uid)
    await updateDoc(doc(collection(firestore, 'lessons'), uid), {
      template,
    })
  } catch (e) {
    exception(e as string)
    throw e
  }
}

export async function logLessonView(uid: string): Promise<void> {
  try {
    updateDoc(doc(collection(firestore, 'lessons'), uid), {
      viewCount: increment(1),
    })
  } catch (e) {
    exception(e as string)
    throw e
  }
}

export async function logPathView(uid: string): Promise<void> {
  try {
    updateDoc(doc(collection(firestore, 'paths'), uid), {
      viewCount: increment(1),
    })
  } catch (e) {
    exception(e as string)
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
      await getDoc(doc(collection(firestore, 'users'), uid))
    ).data() as Author
  } catch (e) {
    exception(e as string)
    return {} as Author
  }
}

/**
 * Gets authors from firestore by applying clauses.
 *
 * @param whereClauses
 * @returns
 */
export async function getAuthors(
  queryConstraints: QueryConstraint[]
): Promise<Author[]> {
  try {
    const q: CollectionReference<DocumentData> | Query<DocumentData> = query(
      collection(firestore, 'users'),
      ...queryConstraints
    )
    return getDocs(q).then((result) => {
      const mapped: Author[] = []
      result.docs.forEach((result) => mapped.push(result.data() as Author))
      return mapped
    })
  } catch (e) {
    exception(e as string)
    throw e
  }
}

export async function updateAuthor(author: Author): Promise<void> {
  try {
    return await setDoc(doc(collection(firestore, 'users'), author.uid), author)
  } catch (e) {
    exception(e as string)
    throw e
  }
}

const computeSavedLessonUid = (savedLesson: SavedLesson): string =>
  `${savedLesson.userId}:${savedLesson.lessonId}`

export async function saveLessonForCurrentUser(
  lessonId: string
): Promise<void> {
  try {
    if (!auth.currentUser) return
    const savedLesson = {
      lessonId,
      userId: auth.currentUser?.uid || '',
    }
    await setDoc(
      doc(
        collection(firestore, 'savedLessons'),
        computeSavedLessonUid(savedLesson)
      ),
      savedLesson
    )
  } catch (e) {
    exception(e as string)
    throw e
  }
}

export async function removeSavedLessonForCurrentUser(
  lessonId: string
): Promise<void> {
  try {
    if (!auth.currentUser) return
    const savedLesson = {
      lessonId,
      userId: auth.currentUser?.uid || '',
    }
    return await deleteDoc(
      doc(
        collection(firestore, 'savedLessons'),
        computeSavedLessonUid(savedLesson)
      )
    )
  } catch (e) {
    exception(e as string)
    throw e
  }
}

export async function getCurrentUserHasSavedLesson(
  lessonId: string
): Promise<boolean> {
  try {
    if (!auth.currentUser) return false
    return (
      await getDoc(
        doc(
          collection(firestore, 'savedLessons'),
          computeSavedLessonUid({
            userId: auth.currentUser?.uid || '',
            lessonId,
          })
        )
      )
    ).exists()
  } catch (e) {
    exception(e as string)
    throw e
  }
}
/**
 * Gets tags from firestore by applying clauses.
 *
 * @param whereClauses
 * @returns
 */
export async function getTags(
  queryConstraints: QueryConstraint[]
): Promise<Tag[]> {
  try {
    const q: CollectionReference<DocumentData> | Query<DocumentData> = query(
      collection(firestore, 'tags'),
      ...queryConstraints
    )
    return getDocs(q).then((result) => {
      const mapped: Tag[] = []
      result.docs.forEach((result) => mapped.push(result.data() as Tag))
      return mapped
    })
  } catch (e) {
    exception(e as string)
    throw e
  }
}

export async function getTag(tagText: string): Promise<Tag> {
  try {
    return (
      await getDoc(doc(collection(firestore, 'tags'), tagText))
    ).data() as Tag
  } catch (e) {
    exception(e as string)
    throw e
  }
}

export async function logTagView(tagText: string): Promise<void> {
  try {
    updateDoc(doc(collection(firestore, 'tags'), tagText), {
      tag: tagText,
      viewCount: increment(1),
    })
  } catch (e) {
    exception(e as string)
    throw e
  }
}

/**
 * Deletes an image at a URL.
 * @param url
 * @returns
 */
export async function deleteImageAtUrl(url: string): Promise<void> {
  return deleteObject(ref(storage, url))
}

export async function uploadImage(file: File): Promise<string> {
  const storageRef = ref(storage, uuid())
  return uploadBytes(storageRef, file).then((snapshot) =>
    getDownloadURL(snapshot.ref)
  )
}

export async function createPath(path: Path): Promise<string> {
  try {
    if (!auth.currentUser) throw new Error('Not logged in')
    path.uid = uuid()
    await setDoc(doc(collection(firestore, 'paths'), path.uid), path)
    return path.uid
  } catch (e) {
    console.error(path)
    exception(e as string)
    throw e
  }
}

export async function updatePath(path: Path) {
  try {
    assert(path.uid)
    await setDoc(doc(collection(firestore, 'paths'), path.uid), path)
  } catch (e) {
    console.error(path)
    exception(e as string)
    throw e
  }
}

/**
 * Gets paths from firestore by applying clauses.
 *
 * @param whereClauses
 * @returns
 */
export async function getPaths(
  queryConstraints: QueryConstraint[]
): Promise<Path[]> {
  try {
    const q: CollectionReference<DocumentData> | Query<DocumentData> = query(
      collection(firestore, 'paths'),
      ...queryConstraints
    )
    return getDocs(q).then((result) => {
      const mapped: Path[] = []
      result.docs.forEach((result) => mapped.push(result.data() as Path))
      // TODO: sort
      return mapped
    })
  } catch (e) {
    exception(e as string)
    throw e
  }
}

/**
 * Gets a path from firestore.
 *
 * @param uid the ID of the path to fetch
 * @returns
 */
export async function getPath(uid: string): Promise<Path> {
  try {
    return (
      await getDoc(doc(collection(firestore, 'paths'), uid))
    ).data() as Path
  } catch (e) {
    exception(e as string)
    throw e
  }
}

/**
 * Deletes a path from firestore.
 *
 * @param uid the ID of the path to delete
 * @returns
 */
export async function deletePath(uid: string): Promise<void> {
  try {
    if (!auth.currentUser) throw new Error('Not logged in')
    return await deleteDoc(doc(collection(firestore, 'paths'), uid))
  } catch (e) {
    exception(e as string)
    throw e
  }
}
