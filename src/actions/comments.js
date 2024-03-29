import database from "./../firebase/firebase";
import axios from "axios";

export const addPostComment = comment => dispatch => {
  return dispatch({
    type: "ADD_POST_COMMENT",
    comment
  });
};

export const startAddPostComment = ({ comment, post }) => dispatch => {
  let updateObject = {};
  const commentRef = database
    .ref()
    .child(`posts/${post.id}/comments`)
    .push().key;
  updateObject[`user-commented-posts/${comment.uid}/${post.id}`] = true;
  updateObject[`posts/${post.id}/comments/${commentRef}`] = comment;
  if (post.countryCode) {
    updateObject[
      `country-posts/${post.countryCode}/${post.id}/comments/${commentRef}`
    ] = comment;
  }
  if (post.placeId) {
    updateObject[
      `place-posts/${post.placeId}/${post.id}/comments/${commentRef}`
    ] = comment;
  }
  if (post.regionCode) {
    updateObject[
      `region-posts/${post.regionCode}/${post.id}/comments/${commentRef}`
    ] = comment;
  }

  updateObject[`tweetQueue-posts/${post.id}/comments/${commentRef}`] = comment;
  if (post.uid) {
    updateObject[
      `user-posts/${post.uid}/${post.id}/comments/${commentRef}`
    ] = comment;
  }

  updateObject[`post-comment-subscribed-users/${post.id}/${comment.uid}`] = true;

  return database
    .ref()
    .update(updateObject)
    .then(() => {
      dispatch(addPostComment(comment));
    })
    .then(() => {
      axios.post("/send-comment-notification-emails", comment);
    })
    .catch(e => {
      console.log(e);
    });
};
