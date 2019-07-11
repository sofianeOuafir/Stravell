export const setPosts = posts => dispatch => {
  return dispatch({
    type: "SET_POSTS",
    posts
  });
};

export const editPostsUserPhotoURL = ({ uid, userPhotoURL }) => dispatch => {
  return dispatch({
    type: "EDIT_POSTS_USER_PHOTO_URL",
    uid,
    userPhotoURL
  });
};
