import Link from "next/link";
import React from "react";
import Avatar from "react-avatar";

const PostAuthor = ({ authorUid, avatarSize, authorPhotoURL, authorName }) => (
  <Link
    href={`/user?uid=${authorUid}`}
  >
    <div>
      <Avatar
        className="mr1"
        size={avatarSize}
        round={true}
        src={authorPhotoURL}
      />
      <span className="c-dark-grey">{authorName}</span>
    </div>
  </Link>
);

export default PostAuthor;
