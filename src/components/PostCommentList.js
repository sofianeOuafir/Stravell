import React, { Fragment } from "react";
import pluralize from "pluralize";

import PostComment from "./PostComment";

const PostCommentList = ({ comments = [], post }) => {
  const nbComments = comments ? comments.length : 0;
  return (
    <Fragment>
      <h1>
        {pluralize("comment", nbComments, true)} on "{post.title}"
      </h1>
      {comments.map((comment, i) => (
        <PostComment comment={comment} key={i} />
      ))}
    </Fragment>
  );
};

export default PostCommentList;
