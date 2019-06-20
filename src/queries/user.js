import database from "./../firebase/firebase";
import { fromSnapShotToObject } from "./../lib/utils/snapshot";

export const getUser = async uid => {
  const userSnapshot = await database.ref(`users/${uid}`).once("value");
  const user = fromSnapShotToObject(userSnapshot);
  if (user === null) {
    return null;
  }
  return user;
};

export const updateUserProfilePicture = async ({ uid, newUserPhotoURL }) => {
  // users/uid
  await database.ref(`users/${uid}`).update({ userPhotoURL: newUserPhotoURL });

  // user-posts

  await database.ref(`user-posts/${uid}/`).once("value", function(snapshot) {
    snapshot.forEach(function(child) {
      child.ref.update({ userPhotoURL: newUserPhotoURL });
    });
  });

  await database
    .ref(`posts/`)
    .orderByChild("uid")
    .equalTo(uid)
    .once("value", function(snapshot) {
      snapshot.forEach(function(child) {
        child.ref.update({ userPhotoURL: newUserPhotoURL });
      });
    });

  // // update region-posts
  await database.ref(`region-posts/`).once("value", function(snapshot) {
    snapshot.forEach(function(child) {
      child.ref
        .orderByChild("uid")
        .equalTo(uid)
        .once("value", function(snapshot) {
          snapshot.forEach(function(child) {
            child.ref.update({ userPhotoURL: newUserPhotoURL });
          });
        });
    });
  });

  // // country-posts
  await database.ref(`country-posts/`).once("value", function(snapshot) {
    snapshot.forEach(function(child) {
      child.ref
        .orderByChild("uid")
        .equalTo(uid)
        .once("value", function(snapshot) {
          snapshot.forEach(function(child) {
            child.ref.update({ userPhotoURL: newUserPhotoURL });
          });
        });
    });
  });

  // update place-posts
  await database.ref(`place-posts/`).once("value", function(snapshot) {
    snapshot.forEach(function(child) {
      child.ref
        .orderByChild("uid")
        .equalTo(uid)
        .once("value", function(snapshot) {
          snapshot.forEach(function(child) {
            child.ref.update({ userPhotoURL: newUserPhotoURL });
          });
        });
    });
  });
};

export const addUser = async ({ userName, userPhotoURL, uid, email }) => {
  const user = { userName, userPhotoURL, uid, email };

  await database.ref(`users/${uid}`).set(user);
};
