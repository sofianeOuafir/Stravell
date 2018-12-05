import React from "react";
import { connect } from "react-redux";
import FilterablePostList from "../components/FilterablePostList";
import PageHeader from "./PageHeader";

const HomePage = props => (
  <div>
    <PageHeader
      title={`Welcome${props.userName ? `, ${props.userName}` : ""} :)`}
    />
    <div className="content-container">
      <FilterablePostList
        SearchBarAutoFocus={true}
        posts={props.posts}
        noPostText={`Become a legend by being the very first person to publish a post in here! :)`}
      />
    </div>
  </div>
);

const mapStateToProps = ({ posts, auth }) => ({
  posts,
  userName: auth.userName
});

export default connect(mapStateToProps)(HomePage);
