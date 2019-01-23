import React from "react";
import Link from "next/link";
import Router from 'next/router';

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
  ({ posts }) => {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <div className="content-container">
          <Link as="/p/create" href="/createPost">
            <a className="button button--with-bottom-margin">
              Create Post
            </a>
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
  },
  { title: DASHBOARD_PAGE_TITLE, description: DASHBOARD_PAGE_DESCRIPTION }
);

DashboardPage.getInitialProps = async function({ query, req, reduxStore, res }) {
  const { uid } = query;
  let authorised = false;
  if (req && req.session) {
    const user = req.session.decodedToken;
    if (user.user_id == query.uid) {
      authorised = true;
    }
  } else {
    if (reduxStore.getState().auth.uid == uid) {
      authorised = true;
    }
  }
  if (authorised) {
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
  } else {
    if( res ) {
      res.writeHead(302, {
        Location: '/'
      });
      res.end()
    }
    else {
      Router.push('/')
    }
  }
};

export default DashboardPage;
