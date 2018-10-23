import React from 'react';
import { connect } from 'react-redux';
import PostListItem from './PostListItem';

const PostList = (props) => (
  <div>
    { 
      props.posts.map((post, key) => (
        <PostListItem key={key} post={post} />
      ))
    }
  </div>
);

const mapStateToProps = (state) => ({
  posts: state.posts
});

export default connect(mapStateToProps)(PostList);