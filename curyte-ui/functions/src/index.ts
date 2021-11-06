import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const createUserDocument = functions.auth.user().onCreate((user) => {
  db.collection('users')
    .doc(user.uid)
    .set(JSON.parse(JSON.stringify(user)));
});

// When a user deletes their account, delete all their stuff too
export const deleteDocumentsForUser = functions.auth.user().onDelete((user) => {
  db.collection('users').doc(user.uid).delete();
  db.collection('lessons')
    .where('authorId', '==', user.uid)
    .get()
    .then((snapshot) => snapshot.docs.forEach((doc) => doc.ref.delete()));
});
