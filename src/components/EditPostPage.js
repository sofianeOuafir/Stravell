import React from "react";
import PostForm from "./PostForm";
import { connect } from "react-redux";
import { startEditPost } from '../actions/posts';
import PageHeader from './PageHeader';

export class EditPostPage extends React.Component {
  constructor(props) {
    super(props);
  }

  onSubmit = (post) => {
    this.props.startEditPost({
      id: this.props.post.id, 
      updates: post
    });
    this.props.history.push('/dashboard')
  };

  render() {
    return (
      <div>
        <PageHeader title="Edit Post" />
        <div className="content-container">
          <PostForm post={this.props.post} onSubmit={this.onSubmit}  />
        </div>
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
  startEditPost: ({ id, updates }) => {
    dispatch(startEditPost({
      id, 
      updates
    }));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditPostPage);
