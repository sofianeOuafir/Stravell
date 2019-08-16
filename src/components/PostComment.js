import React from "react";
import Modal from "react-modal";

import { getDateTimeFormat } from "./../lib/utils/date";
import PostAuthor from "./PostAuthor";

const PostComment = ({ comment }) => (
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
);

export default PostComment;
