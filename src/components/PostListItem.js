import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import Avatar from "react-avatar";

import { isOdd } from "./../lib/utils/math";

const PostListItem = ({ post, isOwnedByCurrentUser, index, editable }) => {
  return (
    <div
      className={`post-list-item ${
        isOdd(index) ? "post-list-item--no-border" : ""
      }`}
    >
      <Link className="post-list-item__link" to={`/posts/show/${post.id}`}>
        <img
          className="post-list-item__image"
          src={`${post.image}`}
          alt={`${post.image}`}
        />
        <div className="post-list-item__title-description-container">
          <h1 className="post-list-item__title">{post.title}</h1>
          <h2 className="post-list-item__description">{post.description}</h2>
        </div>
      </Link>
      <div>
        <div className="post-list-item__author-edit-container"> 
          <Link className="post-list-item__author" to={`/users/${post.uid}`}>
            <Avatar className="post-list-item__avatar" size="40" round={true} src={post.userPhotoURL} />
            {post.userName}
          </Link>
          {isOwnedByCurrentUser && editable && (
            <Link
              className="button"
              to={`/posts/edit/${post.id}`}
            >
              Edit
            </Link>
          )}
        </div>
        <p>{moment(post.createdAt).format("MMMM Do, YYYY")}</p>
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => ({
  isOwnedByCurrentUser: state.auth.uid === props.post.uid
});

export default connect(mapStateToProps)(PostListItem);
