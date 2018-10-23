import React from 'react';
import { Link } from 'react-router-dom';
import PostList from './PostList';
import { connect } from "react-redux";

const DashboardPage = (props) => (
  <div>
    <Link to="posts/create" className="button">
      Create Post
    </Link>
    <PostList posts={props.posts} />
  </div>
);

const mapStateToProps = (state) => ({
  posts: state.posts.filter(post => post.uid === state.auth.uid)
});

export default connect(mapStateToProps)(DashboardPage);