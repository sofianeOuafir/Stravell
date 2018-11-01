import React from "react";
import PostForm from "./PostForm";
import { connect } from "react-redux";
import { addPost } from "../actions/posts";
import PageHeader from './PageHeader';

class AddPostPage extends React.Component {
  onSubmit = post => {
    this.props.addPost(post);
    this.props.history.push("/dashboard");
  };

  render() {
    return (
      <div>
        <PageHeader title="Create Post" />
        <div className="content-container">
          <PostForm onSubmit={this.onSubmit} /> 
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  addPost: post => {
    dispatch(addPost(post));
  }
});

export default connect(
  undefined,
  mapDispatchToProps
)(AddPostPage);
