import React from "react";
import PostList from "../components/PostList";
import { connect } from "react-redux";
import SearchBar from "./SearchBar";
import PageHeader from "./PageHeader";

const HomePage = props => (
  <div>
    <PageHeader title={`Welcome${props.userName ? `, ${props.userName}` : ''} :)`} />
    <div className="content-container">
      <SearchBar
        placeholder="Search"
        className="show-for-mobile search-bar search-bar--warm-peach"
      />
      <PostList posts={props.posts} editable={false} />
    </div>
  </div>
);

const mapStateToProps = state => ({
  posts: state.posts,
  userName: state.auth.userName
});

export default connect(mapStateToProps)(HomePage);
