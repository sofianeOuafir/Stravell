import database from "../firebase/firebase";

const addPost = post => ({
  type: "ADD_POST",
  post
});

const startAddPost = (postData = {}) => {
  return (dispatch, getState) => {
    const { uid, userName, userPhotoURL } = getState().auth;
    const { title, body, description, image, createdAt, updatedAt } = postData;
    const post = {
      uid,
      userName,
      userPhotoURL,
      title,
      description,
      image,
      body,
      createdAt,
      updatedAt
    };
    return database
      .ref("posts")
      .push(post)
      .then(ref => {
        dispatch(
          addPost({
            id: ref.key,
            ...post
          })
        );
      })
      .catch(e => console.log(e));
  };
};

const editPost = ({ id, updates }) => ({
  type: "EDIT_POST",
  id,
  updates
});

const startEditPost = ({ id, updates }) => {
  return dispatch => {
    database
      .ref(`posts/${id}`)
      .update(updates)
      .then(ref => {
        dispatch(editPost({ id, updates }));
      });
  };
};

const setPosts = posts => ({
  type: "SET_POSTS",
  posts
});

const startSetPosts = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      let posts = [];
      database
      .ref("posts")
      .orderByChild("createdAt")
      .on("value", snapshot => {
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
      
    })
  };
};

export { startEditPost, startAddPost, startSetPosts };
