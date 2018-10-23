import React from "react";
import PostForm from "./PostForm";
import { connect } from "react-redux";
import { editPost } from '../actions/posts';

class EditPostPage extends React.Component {
  constructor(props) {
    super(props);
  }
  onSubmit = (post) => {
    this.props.editPost({
      id: this.props.post.id, 
      updates: post
    });
    this.props.history.push('/dashboard')
  };

  render() {
    return (
      <div>
        <p>Edit Page</p>
        <PostForm post={this.props.post} onSubmit={this.onSubmit}  />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    post: state.posts.find(
      post => post.id === props.match.params.id
    )
  };
};

const mapDispatchToProps = (dispatch) => ({
  editPost: ({ id, updates }) => {
    dispatch(editPost({
      id, 
      updates
    }));
  }
  
})

export default connect(mapStateToProps, mapDispatchToProps)(EditPostPage);
