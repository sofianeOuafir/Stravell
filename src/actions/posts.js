export const setPosts = posts => dispatch => {
  return dispatch({
    type: "SET_POSTS",
    posts
  });
};
