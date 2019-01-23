import React from "react";
import { withRouter } from "next/router";
import Head from 'next/head';
import { connect } from 'react-redux';

import PageHeader from "./PageHeader";
import FilterablePostList from "./FilterablePostList";
import page from "./../hocs/page";
import database from "./../firebase/firebase";
import { APP_NAME } from './../constants/constants'

export const UserWallPage = page(
  withRouter(({ posts, userName }) => {
    return (
      <div>
        <Head>
          <title>{`${APP_NAME} | ${userName}`}</title>
          <meta name="description" content={`This page describe ${userName}'s profile`} />
        </Head>
        <div>
          <PageHeader title={userName} />
          <div className="content-container">
            <FilterablePostList
              SearchBarAutoFocus={true}
              posts={posts}
              noPostText={`${userName} has not published any post yet.`}
            />
          </div>
        </div>
      </div>
    );
  }),
  { withTitleAndDescription: false }
);

UserWallPage.getInitialProps = async function(context) {
  const { uid } = context.query;
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

const mapStateToProps = (state) => ({
  userName: state.auth.userName
});

export default connect(mapStateToProps)(UserWallPage);
