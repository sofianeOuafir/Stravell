import React from "react";
import PostList from "../components/PostList";
import { connect } from "react-redux";
import SearchBar from "./SearchBar";
import PageHeader from "./PageHeader";
import { getVisiblePosts } from './../selectors/posts';

const HomePage = props => (
  <div>
    <PageHeader
      title={`Welcome${props.userName ? `, ${props.userName}` : ""} :)`}
    />
    <div className="content-container">
      <SearchBar autoFocus={true} />
      <PostList 
        posts={props.posts} 
        className="post-list post-list--no-border-top" 
        noPostText={`No results were found for ${props.filters.text}.`}
      />
    </div>
  </div>
);

const mapStateToProps = ({posts, auth, filters}) => ({
  posts: getVisiblePosts(posts, filters),
  userName: auth.userName,
  filters
});

export default connect(mapStateToProps)(HomePage);
