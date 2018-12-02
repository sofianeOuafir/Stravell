import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import Avatar from "react-avatar";

import { isOdd } from "./../lib/utils/math";

const PostListItem = ({ post, isOwnedByCurrentUser, index }) => {
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
        <Link className="post-list-item__author-link" to={`/users/${post.uid}`}>
          <Avatar size="40" round={true} src={post.userPhotoURL} />
          {post.userName}
          <p>{moment(post.createdAt).format("MMMM Do, YYYY")}</p>
        </Link>
        {isOwnedByCurrentUser && (
          <Link
            className="post-list-item__edit-post-link"
            to={`/posts/edit/${post.id}`}
          >
            Edit
          </Link>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => ({
  isOwnedByCurrentUser: state.auth.uid === props.post.uid
});

export default connect(mapStateToProps)(PostListItem);
