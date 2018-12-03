import React from "react";
import { Link } from "react-router-dom";
import PostList from "./PostList";
import { connect } from "react-redux";
import PageHeader from "./PageHeader";

const DashboardPage = props => (
  <div>
    <PageHeader title="Dashboard" />
    <div className="content-container">
      <Link to="posts/create" className="button">
        Create Post
      </Link>
      <PostList posts={props.posts} editable={true} />
    </div>
  </div>
);

const mapStateToProps = state => ({
  posts: state.posts.filter(post => post.uid === state.auth.uid)
});

export default connect(mapStateToProps)(DashboardPage);
