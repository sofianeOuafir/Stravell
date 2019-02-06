import database from "../firebase/firebase";

const addPost = post => ({
  type: "ADD_POST",
  post
});

const startAddPost = (postData = {}) => {
  return (dispatch, getState) => {
    const { uid, userName, userPhotoURL } = getState().auth;
    const {
      title,
      body,
      description,
      image,
      createdAt,
      updatedAt,
      s3FolderName,
      providedURL,
      provideURL,
      address,
      lat,
      lng,
      country,
      countryCode
    } = postData;
    const post = {
      uid,
      userName,
      userPhotoURL,
      title,
      description,
      image,
      body,
      createdAt,
      updatedAt,
      s3FolderName,
      providedURL,
      provideURL,
      address,
      lat,
      lng,
      country,
      countryCode
    };
    const newPostKey = database
      .ref()
      .child("posts")
      .push().key;
    let updates = {};
    updates[`/posts/${newPostKey}`] = post;
    updates[`/users/${uid}/posts/${newPostKey}`] = post;
    if (country && countryCode) {
      updates[`/countries/${countryCode}/posts/${newPostKey}`] = post;
      updates[`/countries/${countryCode}/country`] = country;
      updates[`/users/${uid}/countries/${countryCode}`] = { country };
    }
    return database
      .ref()
      .update(updates)
      .catch(e => console.log(e));
  };
};

const editPost = ({ id, updates }) => ({
  type: "EDIT_POST",
  id,
  updates
});

const startEditPost = ({ id, updates, postBeforeUpdate }) => {
  return async (dispatch, getState) => {
    const { uid, userName, userPhotoURL } = getState().auth;
    updates.uid = uid;
    updates.userName = userName;
    updates.userPhotoURL = userPhotoURL;
    const data = await prepareDataObject({
      updates,
      postBeforeUpdate,
      id,
      uid
    });
    return database.ref().update(data)
    // .then(() => {
    //   return maintainUsersCountries({ postBeforeUpdate, updates, uid });
    // })
    // .then(() => {
    //   return maintainCountries({ postBeforeUpdate, updates, uid });
    // })
    .catch(e => console.log(e));
  };
};

const maintainUsersCountries = async ({ postBeforeUpdate, updates, uid }) => {
  return new Promise(async (resolve, reject) => {
    if (
      countryHasChanged({ postBeforeUpdate, updates }) &&
      countryWasPresent({ postBeforeUpdate })
    ) {
      const snapshot = await database
        .ref(`/users/${uid}/posts`)
        .orderByChild("countryCode")
        .equalTo(postBeforeUpdate.countryCode)
        .limitToFirst(1)
        .once("value");

      if (!snapshot.val()) {
        let data = {};
        data[`/users/${uid}/countries/${postBeforeUpdate.countryCode}`] = null;
        database
          .ref()
          .update(data)
          .then(() => {
            resolve();
          });
      } else {
        resolve();
      }
    } else {
      resolve();
    }
  });
};

const maintainCountries = async ({ postBeforeUpdate, updates, uid }) => {
  return new Promise(async (resolve, reject) => {
    if (
      countryHasChanged({ postBeforeUpdate, updates }) &&
      countryWasPresent({ postBeforeUpdate })
    ) {
      const snapshot = await database
        .ref(`/posts`)
        .orderByChild("countryCode")
        .equalTo(postBeforeUpdate.countryCode)
        .limitToFirst(1)
        .once("value");

      if (!snapshot.val()) {
        let data = {};
        data[`/countries/${postBeforeUpdate.countryCode}`] = null;
        database
          .ref()
          .update(data)
          .then(() => {
            resolve();
          });
      } else {
        resolve();
      }
    } else {
      resolve();
    }
  });
};

const countryWasPresent = ({ postBeforeUpdate }) => postBeforeUpdate.country;

const countryHasChanged = ({ postBeforeUpdate, updates }) =>
  postBeforeUpdate.country !== updates.country;

const prepareDataObject = ({ updates, postBeforeUpdate, id, uid }) => {
  return new Promise(async (resolve, reject) => {
    let data = {};
    data[`/posts/${id}`] = updates;
    data[`/users/${uid}/posts/${id}`] = updates;
    if (
      countryWasPresent({ postBeforeUpdate }) &&
      !countryHasChanged({ postBeforeUpdate, updates })
    ) {
      data[`/countries/${updates.countryCode}/posts/${id}`] = updates;
    } else if (
      countryWasPresent({ postBeforeUpdate }) &&
      countryHasChanged({ postBeforeUpdate, updates })
    ) {
      // if country has changed, remove post from former country - post list
      data[`/countries/${postBeforeUpdate.countryCode}/posts/${id}`] = null;
      // add new country and post in new country - post list
      data[`/countries/${updates.countryCode}/country`] = updates.country;
      data[`/countries/${updates.countryCode}/posts/${id}`] = updates;
      // add country to user's country list
      data[`/users/${uid}/countries/${updates.countryCode}/country`] =
        updates.country;
    }
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        console.log(key);
      }
    }
    resolve(data);
  });
};

const setPosts = posts => ({
  type: "SET_POSTS",
  posts
});

const startSetPosts = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      database
        .ref("posts")
        .orderByChild("createdAt")
        .on("value", snapshot => {
          let posts = [];
          snapshot.forEach(snapshotChild => {
            posts.push({
              id: snapshotChild.key,
              ...snapshotChild.val()
            });
          });
          posts = posts.reverse();
          dispatch(setPosts(posts));
          resolve();
        });
    });
  };
};

export {
  startEditPost,
  addPost,
  startAddPost,
  editPost,
  startSetPosts,
  setPosts
};
