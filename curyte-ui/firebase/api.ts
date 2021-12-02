import { Author } from '../interfaces/author';
import { LessonStorageModel } from '../interfaces/lesson';
import firebase from './clientApp';

export interface WhereClause {
  fieldPath: string | firebase.firestore.FieldPath;
  opStr: firebase.firestore.WhereFilterOp;
  value: any;
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
    .collection('lessons');
  for (const clause of whereClauses) {
    fn = fn.where(clause.fieldPath, clause.opStr, clause.value);
  }
  return fn
    .orderBy('created', 'desc')
    .get()
    .then((result) => {
      const mapped: LessonStorageModel[] = [];
      result.docs.forEach((result) =>
        mapped.push(result.data() as LessonStorageModel)
      );
      return mapped;
    });
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
  ).data() as LessonStorageModel;
}

/**
 * Deletes a lesson from firestore.
 *
 * @param uid the ID of the lesson to fetch
 * @returns
 */
export async function deleteLesson(uid: string): Promise<void> {
  return await firebase.firestore().collection('lessons').doc(uid).delete();
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
        .substring(0, 32) + `-${Date.now()}`;
    lesson.uid = uid;
  }
  await firebase.firestore().collection('lessons').doc(uid).set(lesson);
  return uid;
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
  ).data() as Author;
}

export async function updateAuthor(author: Author): Promise<void> {
  return await firebase
    .firestore()
    .collection('users')
    .doc(author.uid)
    .set(author);
}
