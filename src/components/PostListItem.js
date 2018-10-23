import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const PostListItem = ({ post }) => {
  let jsx = (
    <div>
      <p>{post.title}</p>
      <p>{post.body}</p>
    </div>
  );

  {
    isOwnedByAuthenticatedUser
      ? ( { jsx = <Link to={`/posts/edit/${post.id}`}>jsx</Link> })
      : jsx;
  }

  return jsx;
};

const mapStateToProps = (state, props) => ({
  isOwnedByAuthenticatedUser: state.auth.uid === props.post.uid
});

export default connect()(PostListItem);
