import React from "react";
import { connect } from "react-redux";

const PostCommentList = ({ comments }) => (
  <div>
    {comments.map(comment => (
      <span>{comment.text}</span>
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
