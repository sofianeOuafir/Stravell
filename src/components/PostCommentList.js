import React, { Fragment } from "react";
import { connect } from "react-redux";
import pluralize from "pluralize";

import PostAuthor from "./PostAuthor";
import { getDateTimeFormat } from "./../lib/utils/date";

const PostCommentList = ({ comments, post }) => (
  <Fragment>
    <h1>
      {pluralize("comment", comments.length, true)} on "{post.title}"
    </h1>
    {comments.map(comment => (
      <div className="border-bottom border--light-grey pt2">
        <div>
          <PostAuthor
            authorUid={comment.uid}
            avatarSize={50}
            authorPhotoURL={comment.userPhotoURL}
            authorName={comment.userName}
          />
        </div>

        <div className="ml4 pl2">
          <p className="h5 m0 favourite-font-weight">
            {getDateTimeFormat(comment.createdAt)}
          </p>
          <p style={{ whiteSpace: "pre-line" }} className="text-dark-grey h4">
            {comment.text}
          </p>
        </div>
      </div>
    ))}
  </Fragment>
);

const mapStateToProps = ({ posts }, props) => {
  const post = posts.find(post => post.id == props.post.id);
  return {
    comments: post.comments || []
  };
};

export default connect(mapStateToProps)(PostCommentList);
