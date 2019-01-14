import { Link } from "react-router-dom";
import React from "react";
import Avatar from "react-avatar";

const PostAuthor = ({ authorUid, avatarSize, authorPhotoURL, authorName }) => (
  <Link className="no-text-decoration c-dark-grey" to={`/users/${authorUid}`}>
    <Avatar className="mr1" size={avatarSize} round={true} src={authorPhotoURL} />
    {authorName}
  </Link>
);

export default PostAuthor;