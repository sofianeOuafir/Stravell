import React from 'react';
import { connect } from 'react-redux';
import PostList from './PostList';

const UserWallPage = (props) => (
  <div> 
    <PostList posts={props.posts} />
  </div>
);

const mapStateToProps = (state, props) => ({
  posts: state.posts.filter(post => post.uid === props.match.params.uid)
})

export default connect(mapStateToProps)(UserWallPage);