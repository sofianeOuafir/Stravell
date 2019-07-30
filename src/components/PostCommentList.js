import React, { Fragment } from "react";
import pluralize from "pluralize";

import PostComment from "./PostComment";

const PostCommentList = ({ comments = [], post }) => {
  return (
    <Fragment>
      <h1 className="favourite-font-weight h2">
        {pluralize("comment", comments.length, true)} on "{post.title}"
      </h1>
      {comments.map((comment, i) => (
        <PostComment comment={comment} key={i} />
      ))}
    </Fragment>
  );
};

export default PostCommentList;
