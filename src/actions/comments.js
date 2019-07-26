export const addPostComment = comment => dispatch => {
  return dispatch({
    type: "ADD_POST_COMMENT",
    comment
  });
};
