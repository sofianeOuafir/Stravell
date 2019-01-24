import React from "react";
import Head from "next/head";

import PageHeader from "./PageHeader";
import FilterablePostList from "./FilterablePostList";
import Layout from "./Layout";
import database from "./../firebase/firebase";
import { APP_NAME } from "./../constants/constants";

export const UserWallPage = ({ posts, userName }) => {
  return (
    <Layout withTitleAndDescription={false}>
      <Head>
        <title>{`${APP_NAME} | ${userName}`}</title>
        <meta
          name="description"
          content={`This page describe ${userName}'s profile`}
        />
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
    </Layout>
  );
};

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
  const userSnapshot = await database.ref(`users/${uid}`).once("value");
  const user = { uid: userSnapshot.key, ...userSnapshot.val() };
  return { posts, userName: user.userName };
};

export default UserWallPage;
