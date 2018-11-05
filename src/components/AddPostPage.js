import React from "react";
import PostForm from "./PostForm";
import { connect } from "react-redux";
import { startAddPost } from "../actions/posts";
import PageHeader from './PageHeader';

class AddPostPage extends React.Component {
  onSubmit = post => {
    this.props.startAddPost(post);
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
  startAddPost: post => {
    dispatch(startAddPost(post));
  }
});

export default connect(
  undefined,
  mapDispatchToProps
)(AddPostPage);
