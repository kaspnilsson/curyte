import * as functions from 'firebase-functions'
import admin from 'firebase-admin'

admin.initializeApp()
const db = admin.firestore()

export const createUserDocument = functions.auth.user().onCreate((user) => {
  db.collection('users')
    .doc(user.uid)
    .set(JSON.parse(JSON.stringify(user)))
})

// When a user deletes their account, delete all their stuff too
export const deleteDocumentsForUser = functions.auth.user().onDelete((user) => {
  db.collection('users').doc(user.uid).delete()
  db.collection('lessons')
    .where('authorId', '==', user.uid)
    .get()
    .then((snapshot) => snapshot.docs.forEach((doc) => doc.ref.delete()))
})

export const decrementLessonSaveCount = functions.firestore
  .document('savedLessons/{savedLessonId}')
  .onDelete((change) => {
    // Decrement save count
    db.collection('lessons')
      .doc(change.data().lessonId)
      .update({ saveCount: admin.firestore.FieldValue.increment(-1) })

    // Update user saved posts
    db.collection('users')
      .doc(change.data().userId)
      .update({
        savedLessons: admin.firestore.FieldValue.arrayRemove(
          change.data().lessonId
        ),
      })
  })

export const incrementLessonSaveCount = functions.firestore
  .document('savedLessons/{savedLessonId}')
  .onCreate((change) => {
    // Increment save count
    db.collection('lessons')
      .doc(change.data().lessonId)
      .update({ saveCount: admin.firestore.FieldValue.increment(1) })

    // Add saved lesson
    db.collection('users')
      .doc(change.data().userId)
      .update({
        savedLessons: admin.firestore.FieldValue.arrayUnion(
          change.data().lessonId
        ),
      })
  })

export const createTagsForLesson = functions.firestore
  .document('lessons/{lessonId}')
  .onCreate(async (change) => {
    for (const tag of change.data().tags || []) {
      const old = await db.collection('tags').doc(tag).get()
      if (old.exists) {
        db.collection('tags')
          .doc(tag)
          .update({
            tagText: tag,
            lessonIds: admin.firestore.FieldValue.arrayUnion(change.data().uid),
          })
      } else {
        db.collection('tags')
          .doc(tag)
          .set({
            tagText: tag,
            lessonIds: [change.data().uid],
            viewCount: 0,
          })
      }
    }
  })

const getPathStorageFromUrl = (url: string) => {
  const baseUrl =
    'https://firebasestorage.googleapis.com/v0/b/project-80505.appspot.com/o/'

  let imagePath: string = url.replace(baseUrl, '')

  const indexOfEndPath = imagePath.indexOf('?')

  imagePath = imagePath.substring(0, indexOfEndPath)

  imagePath = imagePath.replace(/%2F/g, '/')

  imagePath = imagePath.replace(/%20/g, ' ')

  return imagePath
}

export const deleteDataForLesson = functions.firestore
  .document('lessons/{lessonId}')
  .onDelete(async (change: admin.firestore.QueryDocumentSnapshot) => {
    for (const tag of change.data().tags || []) {
      const old = await db.collection('tags').doc(tag).get()
      if (old.exists) {
        db.collection('tags')
          .doc(tag)
          .update({
            tagText: tag,
            lessonIds: admin.firestore.FieldValue.arrayRemove(
              change.data().uid
            ),
          })
      } else {
        db.collection('tags')
          .doc(tag)
          .set({ tagText: tag, lessonIds: [], viewCount: 0 })
      }
    }
    // if (change.data().coverImageUrl) {
    //   storage
    //     .bucket()
    //     .file(getPathStorageFromUrl(change.data().coverImageUrl))
    //     .delete()
    // }
  })

// export const deleteDataForDraft = functions.firestore
//   .document('drafts/{draftId}')
//   .onDelete(async (change: admin.firestore.QueryDocumentSnapshot) => {
//     if (change.data().coverImageUrl) {
//       storage
//         .bucket()
//         .file(getPathStorageFromUrl(change.data().coverImageUrl))
//         .delete()
//     }
//   })
