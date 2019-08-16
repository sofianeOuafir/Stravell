import { editAuthUserPhotoURL } from "./auth";
import { editPostsUserPhotoURL } from "./posts";
import database from "./../firebase/firebase";

export const startUpdateUserProfilePicture = ({
  uid,
  userPhotoURL
}) => async dispatch => {
  let updateObject = {};

  // users/uid
  updateObject[`users/${uid}/userPhotoURL`] = userPhotoURL;

  // user-posts
  await database.ref(`user-posts/${uid}/`).once("value", function(snapshot) {
    let postKeys;
    try {
      postKeys = Object.keys(snapshot.val());
    } catch (error) {
      postKeys = [];
    }

    postKeys.forEach(key => {
      updateObject[`user-posts/${uid}/${key}/userPhotoURL`] = userPhotoURL;
    });
  });

  // posts
  await database
    .ref(`posts/`)
    .orderByChild("uid")
    .equalTo(uid)
    .once("value", function(snapshot) {
      let postKeys;
      try {
        postKeys = Object.keys(snapshot.val());
      } catch (error) {
        postKeys = [];
      }
      postKeys.forEach(key => {
        updateObject[`posts/${key}/userPhotoURL`] = userPhotoURL;
      });
    });

  // country-posts
  await database.ref(`country-posts/`).once("value", function(snapshot) {
    snapshot.forEach(function(child) {
      const countryCode = child.key;
      child.ref
        .orderByChild("uid")
        .equalTo(uid)
        .once("value", function(snapshot) {
          snapshot.forEach(function(child) {
            const postId = child.key;
            updateObject[
              `country-posts/${countryCode}/${postId}/userPhotoURL`
            ] = userPhotoURL;
          });
        });
    });
  });

  // update place-posts
  await database.ref(`place-posts/`).once("value", function(snapshot) {
    snapshot.forEach(function(child) {
      const placeId = `${child.key}`;
      child.ref
        .orderByChild("uid")
        .equalTo(uid)
        .once("value", function(snapshot) {
          snapshot.forEach(function(child) {
            const postId = child.key;
            updateObject[
              `place-posts/${placeId}/${postId}/userPhotoURL`
            ] = userPhotoURL;
          });
        });
    });
  });

  // // update region-posts
  await database.ref(`region-posts/`).once("value", function(snapshot) {
    snapshot.forEach(function(child) {
      const regionCode = child.key;
      child.ref
        .orderByChild("uid")
        .equalTo(uid)
        .once("value", function(snapshot) {
          snapshot.forEach(function(child) {
            const postId = child.key;
            updateObject[
              `region-posts/${regionCode}/${postId}/userPhotoURL`
            ] = userPhotoURL;
          });
        });
    });
  });

  return database
    .ref()
    .update(updateObject)
    .then(() => {
      dispatch(editAuthUserPhotoURL(`${userPhotoURL}?${new Date().getTime()}`));
      dispatch(
        editPostsUserPhotoURL({
          userPhotoURL: `${userPhotoURL}?${new Date().getTime()}`,
          uid
        })
      );
    })
    .catch(e => {
      console.log(e);
    });
};
