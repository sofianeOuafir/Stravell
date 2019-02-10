import React from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { slugify } from "underscore.string";

import { getDateFormat } from "./../lib/utils/date";
import PostAuthor from "./PostAuthor";
import { isOdd } from "./../lib/utils/math";
import Address from './Address';

export const PostListItem = ({
  post,
  isOwnedByCurrentUser,
  index,
  editable
}) => {
  const postListItemContent = (
    <div className="post-list-item__content-container">
      <img
        className="post-list-item__image"
        src={`${post.image}`}
        alt={`${post.image}`}
      />
      {post.address && (
        <div className="post-list-item__address-container">
          <Address address={post.address} iconClassName="post-list-item__address-icon" addressClassName="post-list-item__address"/>
        </div>
      )}

      <div className="post-list-item__title-description-container">
        <h1 className="post-list-item__title">{post.title}</h1>
        <h2 className="post-list-item__description">{post.description}</h2>
      </div>
    </div>
  );

  return (
    <div
      className={`post-list-item ${
        isOdd(index) ? "post-list-item--no-border" : ""
      }`}
    >
      {post.provideURL && post.providedURL ? (
        <a
          href={post.providedURL}
          target="_blank"
          className="post-list-item__link"
        >
          {postListItemContent}
        </a>
      ) : (
        <Link
          as={`/p/show/${slugify(post.title)}/${post.id}`}
          prefetch
          href={`/post?id=${post.id}`}
        >
          <a className="post-list-item__link">{postListItemContent}</a>
        </Link>
      )}

      <div>
        <div className="post-list-item__author-edit-container">
          <PostAuthor
            authorUid={post.uid}
            avatarSize={40}
            authorPhotoURL={post.userPhotoURL}
            authorName={post.userName}
          />
          {isOwnedByCurrentUser && editable && (
            <Link
              prefetch
              as={`/p/edit/${slugify(post.title)}/${post.id}`}
              href={`/editPost?id=${post.id}`}
            >
              <a className="button">Edit</a>
            </Link>
          )}
        </div>
        <p>{getDateFormat(post.createdAt)}</p>
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => ({
  isOwnedByCurrentUser: state.auth.uid === props.post.uid
});

export default connect(mapStateToProps)(PostListItem);
