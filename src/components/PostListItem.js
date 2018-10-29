import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {Editor} from 'draft-js';
import moment from 'moment';

const PostListItem = ({ post, isOwnedByCurrentUser }) => (
  <div>
    <Link to={`/posts/show/${post.id}`}>
      <p>{post.title}</p>
      <p>
        {post.body.getCurrentContent().getPlainText()}
      </p>
    </Link>
    <Link to={`/users/${post.uid}`}>{post.userName}</Link>
    {isOwnedByCurrentUser && <Link to={`/posts/edit/${post.id}`}>Edit</Link>}
    <p>{moment(post.createdAt).format('MMMM Do, YYYY')}</p>
  </div>
);

const mapStateToProps = (state, props) => ({
  isOwnedByCurrentUser: state.auth.uid === props.post.uid
});

export default connect(mapStateToProps)(PostListItem);
