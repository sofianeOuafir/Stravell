import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const PostListItem = ({ post, isOwnedByCurrentUser }) => (
  <div>
    <Link to={`/posts/show/${post.id}`}>
      <div>
        <p>{post.title}</p>
        <p>{post.body}</p>
      </div>
    </Link>
    {isOwnedByCurrentUser && <Link to={`/posts/edit/${post.id}`}>Edit</Link>}
  </div>
);

const mapStateToProps = (state, props) => ({
  isOwnedByCurrentUser: state.auth.uid === props.post.uid
});

export default connect(mapStateToProps)(PostListItem);
