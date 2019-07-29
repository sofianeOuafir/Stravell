import database from "./../firebase/firebase";
export const addPostComment = comment => dispatch => {
  return dispatch({
    type: "ADD_POST_COMMENT",
    comment
  });
};

export const startAddPostComment = comment => dispatch => {
  return database
    .ref(`posts/${comment.postId}/comments`)
    .push(comment)
    .then(() => {
      dispatch(addPostComment(comment));
    })
    .catch(e => {
      console.log(e);
    });
};
