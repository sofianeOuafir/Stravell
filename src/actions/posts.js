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
      updates[`/countries/${countryCode}`] = { posts: {} };
      updates[`/countries/${countryCode}`]["country"] = country;
      updates[`/countries/${countryCode}`]["posts"][newPostKey] = post;
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
  return (dispatch, getState) => {
    const { uid, userName, userPhotoURL } = getState().auth;
    updates.uid = uid;
    updates.userName = userName;
    updates.userPhotoURL = userPhotoURL;
    let data = {};
    data[`/posts/${id}`] = updates;
    data[`/users/${uid}/posts/${id}`] = updates;
    if (
      postBeforeUpdate.country &&
      postBeforeUpdate.countryCode &&
      postBeforeUpdate.country === updates.country &&
      postBeforeUpdate.countryCode === updates.countryCode
    ) {
      data[`/countries/${updates.countryCode}/posts/${id}`] = updates;
    } else if (
      postBeforeUpdate.country &&
      postBeforeUpdate.countryCode &&
      postBeforeUpdate.country !== updates.country &&
      postBeforeUpdate.countryCode !== updates.countryCode
    ) {
      data[`/countries/${postBeforeUpdate.countryCode}`] = { posts: {}};
      data[`/countries/${postBeforeUpdate.countryCode}`][`posts`][id] = null;
      data[`/countries/${updates.countryCode}`] = { posts: {} };
      data[`/countries/${updates.countryCode}`].country = updates.country;
      data[`/countries/${updates.countryCode}`]["posts"][id] = updates;
      data[`/users/${uid}/countries/${updates.countryCode}`] = {
        country: updates.countryCode
      };
      database
        .ref(`/posts`)
        .orderByChild("countryCode")
        .equalTo(postBeforeUpdate.countryCode)
        .limitToFirst(1)
        .once("value")
        .then((snapshot) => {
          if(!snapshot.val()){
            console.log(`${postBeforeUpdate.countryCode} should be deleted in countries`);
            data[`/countries/${postBeforeUpdate.countryCode}`] = null;
          }
        });
      database
        .ref(`/users/${uid}/posts`)
        .orderByChild("countryCode")
        .equalTo(postBeforeUpdate.countryCode)
        .limitToFirst(1)
        .once("value")
        .then((snapshot) => {
          if(!snapshot.val()){
            console.log(`${postBeforeUpdate.countryCode} should be deleted in users/countries`);
            data[`/users/${uid}/countries/${postBeforeUpdate.countryCode}`] = null;
          }
        });


    }
    console.log(data);
    database
      .ref()
      .update(data).then(() => {
        console.log('update now');
      })
      .catch(e => console.log(e));
  };
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
