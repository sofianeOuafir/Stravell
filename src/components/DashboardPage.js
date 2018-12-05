import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import FilterablePostList from "./FilterablePostList";
import PageHeader from "./PageHeader";

const DashboardPage = props => (
  <div>
    <PageHeader title="Dashboard" />
    <div className="content-container">
      <Link to="posts/create" className="button button--with-bottom-margin">
        Create Post
      </Link>
      <FilterablePostList
        SearchBarAutoFocus={true}
        posts={props.posts}
        noPostText={`The world is looking forward to hear about your stories! :)`}
      />
    </div>
  </div>
);

const mapStateToProps = ({ posts, auth }) => ({
  posts: posts.filter(post => post.uid === auth.uid)
});

export default connect(mapStateToProps)(DashboardPage);
