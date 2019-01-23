import Link from "next/link";
import React from "react";
import Avatar from "react-avatar";
import { slugify } from 'underscore.string';

const PostAuthor = ({ authorUid, avatarSize, authorPhotoURL, authorName }) => (
  <Link as={`/u/show/${slugify(authorName)}/${authorUid}`} href={`/user?uid=${authorUid}`}>
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
