import React from 'react';
import PostList from '../components/PostList';
import { connect } from "react-redux";

const HomePage = (props) => (
  <div> 
    <p>Home page</p>
    <PostList posts={props.posts} />
  </div>
);

const mapStateToProps = (state) => ({
  posts: state.posts
});

export default connect(mapStateToProps)(HomePage);