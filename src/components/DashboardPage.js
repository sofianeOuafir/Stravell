import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import FilterablePostList from "./FilterablePostList";
import PageHeader from "./PageHeader";
import { NO_ELEMENT_POST_LIST_DASHBOARD_TEXT } from './../constants/constants';

export const DashboardPage = props => {
  return (
    <div>
      <PageHeader title="Dashboard" />
      <div className="content-container">
        <Link to="posts/create" className="button button--with-bottom-margin">
          Create Post
        </Link>
        <FilterablePostList
          editable={true}
          SearchBarAutoFocus={true}
          posts={props.posts}
          noPostText={NO_ELEMENT_POST_LIST_DASHBOARD_TEXT}
        />
      </div>
    </div>
  );
};

const mapStateToProps = ({ posts, auth }) => ({
  posts: posts.filter(post => post.uid === auth.uid)
});

export default connect(mapStateToProps)(DashboardPage);
