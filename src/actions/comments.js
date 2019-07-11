export const addPostComment = ({ postId, comment }) => dispatch => {
  return dispatch({
    type: "ADD_POST_COMMENT",
    postId,
    comment
  });
};
