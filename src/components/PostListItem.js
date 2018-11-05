import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import { editorStateFromRaw } from "megadraft";
import Avatar from 'react-avatar';

const PostListItem = ({ post, isOwnedByCurrentUser }) => {
  let body = editorStateFromRaw(JSON.parse(post.body));

  return (
    <div className="post-list-item">
      <Link className="post-list-item__article-link" to={`/posts/show/${post.id}`}>
        <div>
          <p>{post.title}</p>
          <p>{body.getCurrentContent().getPlainText()}</p>
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
