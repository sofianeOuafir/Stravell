import React from "react";
import { connect } from "react-redux";
import FilterablePostList from "../components/FilterablePostList";
import PageHeader from "./PageHeader";
import { NO_ELEMENT_POST_LIST_HOME_PAGE_TEXT } from './../constants/constants'

export const HomePage = ({ userName, posts }) => (
  <div>
    <PageHeader
      title={`Welcome${userName ? `, ${userName}` : ""}`}
    />
    <div className="content-container">
      <FilterablePostList
        SearchBarAutoFocus={true}
        posts={posts}
        noPostText={NO_ELEMENT_POST_LIST_HOME_PAGE_TEXT}
      />
    </div>
  </div>
);

const mapStateToProps = ({ posts, auth }) => ({
  posts,
  userName: auth.userName
});

export default connect(mapStateToProps)(HomePage);
