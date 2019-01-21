import React from "react";
import Link from "next/link";
import { withRouter } from "next/router";
import { connect } from "react-redux";

import FilterablePostList from "./FilterablePostList";
import PageHeader from "./PageHeader";
import {
  NO_ELEMENT_POST_LIST_DASHBOARD_TEXT,
  DASHBOARD_PAGE_TITLE,
  DASHBOARD_PAGE_DESCRIPTION
} from "./../constants/constants";
import page from "./../hocs/page";
import database from "./../firebase/firebase";

export const DashboardPage = page(
  withRouter(({ posts }) => {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <div className="content-container">
          <Link
            href="posts/create"
          >
            <span className="button button--with-bottom-margin">Create Post</span>
            
          </Link>
          <FilterablePostList
            editable={true}
            SearchBarAutoFocus={true}
            posts={posts}
            noPostText={NO_ELEMENT_POST_LIST_DASHBOARD_TEXT}
          />
        </div>
      </div>
    );
  }),
  { title: DASHBOARD_PAGE_TITLE, description: DASHBOARD_PAGE_DESCRIPTION }
);

DashboardPage.getInitialProps = async function({ query }) {
  console.log('you');
  const { uid } = query;
  const snapshot = await database
    .ref("posts")
    .orderByChild("uid")
    .equalTo(uid)
    .once("value");
  let posts = [];
  snapshot.forEach(snapshotChild => {
    posts.push({
      id: snapshotChild.key,
      ...snapshotChild.val()
    });
  });
  posts = posts.reverse();

  return { posts };
};

// const mapStateToProps = ({ posts, auth }) => ({
//   posts: posts.filter(post => post.uid === auth.uid)
// });

export default connect()(DashboardPage);
