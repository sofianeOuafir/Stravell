import React, { Fragment } from "react";
import { connect } from "react-redux";

const PostCommentList = ({ comments }) => (
  <div>
    {comments.map(comment => (
      <Fragment>
        <p>{comment.userName}</p>
        <p>{comment.text}</p>
      </Fragment>
    ))}
  </div>
);

const mapStateToProps = ({ posts }, props) => {
  const post = posts.find(post => post.id == props.postId);
  return {
    comments: post.comments || []
  };
};

export default connect(mapStateToProps)(PostCommentList);
