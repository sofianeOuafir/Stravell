import React from 'react';
import PostForm from './PostForm';
import { connect } from 'react-redux';
import { addPost } from '../actions/posts';

class AddPostPage extends React.Component {
  onSubmit = post => {
    this.props.addPost(post);
    this.props.history.push('/dashboard');
  }

  render () {
    return (
      <div>
      <p>Add post page here</p>
      <PostForm onSubmit={this.onSubmit} uid={ this.props.uid } />
    </div>
    )
  }
}

const mapStateToProps = (state) => ({
  uid: state.auth.uid
});

const mapDispatchToProps = (dispatch) => ({
  addPost: (post) => {
    dispatch(addPost(post));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AddPostPage);