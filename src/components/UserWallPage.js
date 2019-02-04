import React from "react";
import Head from "next/head";
import { connect } from 'react-redux';

import PageHeader from "./PageHeader";
import FilterablePostList from "./FilterablePostList";
import Layout from "./Layout";
import database from "./../firebase/firebase";
import { APP_NAME } from "./../constants/constants";
import { setCountries } from "./../actions/countries";
import { setPosts } from "./../actions/posts";
export class UserWallPage extends React.Component {
  async componentDidMount() {

    // do on here for realtime 
    const countrySnapshot = await database
      .ref(`users/${this.props.uid}/countries`)
      .once("value")
      .then(snapshot => {
        return snapshot;
      });

    let countries = [];
    countrySnapshot.forEach(snapshotChild => {
      countries.push({
        id: snapshotChild.key,
        ...snapshotChild.val()
      });
    });
    this.props.dispatch(setCountries(countries));
  }

  render() {
    const { posts, userName } = this.props
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
  }
}

UserWallPage.getInitialProps = async function({ query, reduxStore }) {
  const { uid } = query; 
  const snapshot = await database
    .ref(`users/${uid}/posts`)
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
  reduxStore.dispatch(setPosts(posts));
  return { posts, userName: user.userName, uid: user.uid };
};

export default connect()(UserWallPage);
