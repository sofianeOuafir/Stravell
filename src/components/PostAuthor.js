import { Link } from "react-router-dom";
import React from "react";
import Avatar from "react-avatar";

const PostAuthor = (props) => (
  <Link className="no-text-decoration c-dark-grey" to={`/users/${props.authorUid}`}>
    <Avatar className="mr1" size={props.avatarSize} round={true} src={props.authorPhotoURL} />
    {props.authorName}
  </Link>
);

export default PostAuthor;