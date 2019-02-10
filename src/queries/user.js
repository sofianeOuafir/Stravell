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

export const addUser = async ({ userName, userPhotoURL, uid, email }) => {
  const user = { userName, userPhotoURL, uid, email };

  await database.ref(`users/${uid}`).set(user);
};
