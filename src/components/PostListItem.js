import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getDateFormat } from './../lib/utils/date';
import PostAuthor from './PostAuthor';
import { isOdd } from "./../lib/utils/math";

const PostListItem = ({ post, isOwnedByCurrentUser, index, editable }) => {
  const postListItemContent = (
    <div>
      <img
        className="post-list-item__image"
        src={`${post.image}`}
        alt={`${post.image}`}
      />
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
      {
        post.provideURL && post.providedURL ? (
          <a href={post.providedURL} target="_blank" className="post-list-item__link">
            { postListItemContent }
          </a>
        ) : (
          <Link className="post-list-item__link" to={`/posts/show/${post.id}`}>
            { postListItemContent }
          </Link>
        )
      }

      <div>
        <div className="post-list-item__author-edit-container"> 
          <PostAuthor authorUid={post.uid} avatarSize={40} authorPhotoURL={post.userPhotoURL} authorName={post.userName} />
          {isOwnedByCurrentUser && editable && (
            <Link
              className="button"
              to={`/posts/edit/${post.id}`}
            >
              Edit
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
