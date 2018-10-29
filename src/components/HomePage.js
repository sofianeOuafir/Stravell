import React from 'react';
import PostList from '../components/PostList';
import { connect } from "react-redux";
import SearchBar from './SearchBar';

const HomePage = (props) => (
  <div className="content-container"> 
    <SearchBar placeholder="Search" className="show-for-mobile search-bar--home-page" />
    <PostList posts={props.posts} />
  </div>
);

const mapStateToProps = (state) => ({
  posts: state.posts
});

export default connect(mapStateToProps)(HomePage);