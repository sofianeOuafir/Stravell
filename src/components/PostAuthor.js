import Link from "next/link";
import React from "react";
import Avatar from "react-avatar";
import { slugify } from "underscore.string";

const PostAuthor = ({ authorUid, avatarSize, authorPhotoURL, authorName, fontSize = 15 }) => {
  let avatarProps = {
    className: "mr1",
    size: avatarSize,
    round: true
  };

  if (authorPhotoURL) {
    avatarProps.src = authorPhotoURL;
  } else {
    avatarProps.name = authorName;
  }
  return (
    <Link
      as={`/u/show/${slugify(authorName)}/${authorUid}`}
      href={`/user?uid=${authorUid}`}
    >
      <a className="no-text-decoration">
        <div className="flex align-items--center">
          <Avatar
            {...avatarProps}
          />
          <span style={{fontSize}} className="favourite-font-weight c-dark-grey">{authorName}</span>
        </div>
      </a>
    </Link>
  );
};

export default PostAuthor;
