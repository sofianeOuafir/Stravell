import Link from "next/link";
import React from "react";
import Avatar from "react-avatar";

const PostAuthor = ({ authorUid, avatarSize, authorPhotoURL, authorName }) => (
  <Link href={`/user?uid=${authorUid}`}>
    <a className="no-text-decoration">
      <div>
        <Avatar
          className="mr1"
          size={avatarSize}
          round={true}
          src={authorPhotoURL}
        />
        <span className="c-dark-grey">{authorName}</span>
      </div>
    </a>
  </Link>
);

export default PostAuthor;
