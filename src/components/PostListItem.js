import React from "react";
import { connect } from "react-redux";
import Router from "next/router";
import Link from "next/link";
import { slugify } from "underscore.string";

import { getDateFormat } from "./../lib/utils/date";
import PostAuthor from "./PostAuthor";
import Address from "./Address";

export const PostListItem = ({
  post,
  isOwnedByCurrentUser,
  index,
  editable
}) => {
  return (
    <div className={`post-list-item`}>
      <div className="post-list-item__content-container">
        <Link
          href={`/post?id=${post.id}`}
          as={`/p/show/${slugify(post.title)}/${post.id}`}
        >
          <a className="post-list-item__link">
            <img
              className="post-list-item__image"
              src={`${post.image}`}
              alt={`Travel Image`}
            />

            <div className="post-list-item__title-description-container">
              <h1 className="post-list-item__title">{post.title}</h1>
              <h2 className="post-list-item__description">
                {post.description}
              </h2>
            </div>
          </a>
        </Link>

        {post.address && (
          <div className="post-list-item__address-container">
            <Address
              address={post.address}
              placeId={post.placeId}
              iconClassName="post-list-item__address-icon"
              addressClassName="post-list-item__address"
            />
          </div>
        )}
      </div>

      <div>
        <div className="post-list-item__author-edit-container">
          <PostAuthor
            authorUid={post.uid}
            avatarSize={40}
            authorPhotoURL={post.userPhotoURL}
            authorName={post.userName}
          />
          {!isOwnedByCurrentUser && (
            <Link
              href={`/post?id=${post.id}`}
              as={`/p/show/${slugify(post.title)}/${post.id}`}
            >
              <a className="button">Read</a>
            </Link>
          )}
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
        <Link
          href={`/post?id=${post.id}`}
          as={`/p/show/${slugify(post.title)}/${post.id}`}
        >
          <a className="hide" />
        </Link>
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => ({
  isOwnedByCurrentUser: state.auth.uid === props.post.uid
});

export default connect(mapStateToProps)(PostListItem);
