import React from "react";
import { Link } from "react-router-dom";
import PostList from "./PostList";
import { connect } from "react-redux";
import PageHeader from "./PageHeader";
import SearchBar from './SearchBar';
import { getVisiblePosts } from './../selectors/posts';

const DashboardPage = props => (
  <div>
    <PageHeader title="Dashboard" />
    <div className="content-container">
      <Link to="posts/create" className="button button--with-bottom-margin">
        Create Post
      </Link>
      <SearchBar autoFocus />
      <PostList
        posts={props.posts}
        editable={true}
        className="post-list post-list--no-border-top"
        noPostText={getNoPostText(props.posts, props.filters.text)}
      />
    </div>
  </div>
);

const getNoPostText = (posts, textFilter) => {
  return posts.length === 0 && textFilter.length === 0
  ? `The world is looking forward to hear about your stories! :)`
  : `No results were found for ${textFilter}.`
}

const mapStateToProps = ({filters, posts, auth}) => ({
  posts: getVisiblePosts(posts.filter(post => post.uid === auth.uid), filters),
  filters
});

export default connect(mapStateToProps)(DashboardPage);
