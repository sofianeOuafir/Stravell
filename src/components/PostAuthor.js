import Link from "next/link";
import React from "react";
import Avatar from "react-avatar";

const PostAuthor = ({ authorUid, avatarSize, authorPhotoURL, authorName }) => (
  <Link className="no-text-decoration c-dark-grey" href={`/user?uid=${authorUid}`}>
    <div>
    <Avatar className="mr1" size={avatarSize} round={true} src={authorPhotoURL} />
    {authorName}
    </div>

  </Link>
);

export default PostAuthor;