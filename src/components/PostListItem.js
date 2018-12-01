import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import Avatar from 'react-avatar';

import { isOdd } from './../lib/utils/math';

const PostListItem = ({ post, isOwnedByCurrentUser, index}) => {
  return (
    <div className={`post-list-item ${isOdd(index) ? 'post-list-item--no-border' : '' }`}>
      <Link className="post-list-item__article-link" to={`/posts/show/${post.id}`}>
        <div>
          <img className="post-list-item__article-image" src={`${post.image}`} alt={`${post.image}`} />
          <h1>{post.title}</h1>
          <h2>{post.description}</h2>
          <p>{moment(post.createdAt).format("MMMM Do, YYYY")}</p>
        </div>
      </Link>

      <Link className="post-list-item__author-link" to={`/users/${post.uid}`}>
      <Avatar size="40" round={true} src={post.userPhotoURL} />
      {post.userName}
      </Link>
      {isOwnedByCurrentUser && (
        <Link className="post-list-item__edit-post-link" to={`/posts/edit/${post.id}`}>Edit</Link>
      )}
    </div>
  );
};

const mapStateToProps = (state, props) => ({
  isOwnedByCurrentUser: state.auth.uid === props.post.uid
});

export default connect(mapStateToProps)(PostListItem);
