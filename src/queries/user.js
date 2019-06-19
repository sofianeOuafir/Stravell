import database from "./../firebase/firebase";
import { fromSnapShotToObject } from './../lib/utils/snapshot';

export const getUser = async uid => {
  const userSnapshot = await database.ref(`users/${uid}`).once("value");
  const user = fromSnapShotToObject(userSnapshot);
  if(user === null) {
    return null
  }
  return user;
};

export const updateUserProfilePicture = ({ uid, newUserPhotoURL }) => {
  let updates = {}
  updates[`users/${uid}/userPhotoURL`] = newUserPhotoURL;
  database.ref(`user-posts/${uid}/`).once("value", function(snapshot) {
    snapshot.forEach(function(child) {
      child.ref.update({
        userPhotoURL: newUserPhotoURL
      });
    });
  });
  database.ref(`users/${uid}`).update(updates);
}

export const addUser = async ({ userName, userPhotoURL, uid, email }) => {
  const user = { userName, userPhotoURL, uid, email };

  await database.ref(`users/${uid}`).set(user);
};
