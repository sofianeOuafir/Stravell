import database from "./../firebase/firebase";
import { fromSnapShotToObject, fromSnapShotToArray } from './../lib/utils/snapshot';

export const getPost = async (id) => {
  const snapshot = await database.ref(`posts/${id}`).once("value");
  return fromSnapShotToObject(snapshot);
};

export const getPosts = async ({uid, countryCode} = {}) => {
  let ref;
  if(uid && countryCode) {
    throw new Error("can't pass both arguments uid and countryCode");
  } else if(uid) {
    ref = `user-posts/${uid}`;
  } else if (countryCode) {
    ref = `country-posts/${countryCode}`;
  } else {
    ref = 'posts';
  }
  const postSnapshot = await database
    .ref(ref)
    .orderByChild("createdAt")
    .once("value")
    .then(snapshot => {
      return snapshot;
    });

  let posts = fromSnapShotToArray(postSnapshot);
  return posts.reverse();
};
