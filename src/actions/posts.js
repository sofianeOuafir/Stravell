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
    const newPostKey = database.ref().child('posts').push().key;
    let updates = {};
    updates[`/posts/${newPostKey}`] = post;
    updates[`/users/${uid}/posts/${newPostKey}`] = post;
    if(country && countryCode) {
      updates[`/countries/${countryCode}`] = { posts: {} }
      updates[`/countries/${countryCode}`]["country"] = country;
      updates[`/countries/${countryCode}`]["posts"][newPostKey] = post;
      updates[`/users/${uid}/countries/${countryCode}`] = { country }
    } 
    return database.ref().update(updates).catch(e => console.log(e));
  };
};

const editPost = ({ id, updates }) => ({
  type: "EDIT_POST",
  id,
  updates
});

const startEditPost = ({ id, updates }) => {
  return dispatch => {
    database.ref(`posts/${id}`).update(updates);
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

export { startEditPost, addPost, startAddPost, editPost, startSetPosts, setPosts };
