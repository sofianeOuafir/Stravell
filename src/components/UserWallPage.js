import React from "react";
import Head from "next/head";
import { connect } from 'react-redux';

import PageHeader from "./PageHeader";
import FilterablePostList from "./FilterablePostList";
import Layout from "./Layout";
import { APP_NAME } from "./../constants/constants";
import { setCountries } from "./../actions/countries";
import { setCountryFilter } from "./../actions/filters";
import { getPosts } from "../queries/post";
import { getCountries } from "../queries/countries";
import { getUser } from "../queries/user";
export class UserWallPage extends React.Component {
  async componentDidMount() {
    const { uid } = this.props.user;
    const countries = await getCountries({ uid });
    this.props.dispatch(setCountries(countries));
    this.props.dispatch(setCountryFilter(''));
  }

  render() {
    const { posts } = this.props;
    const { userName } = this.props.user;
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

UserWallPage.getInitialProps = async function({ query }) {
  const { uid } = query; 
  const posts = await getPosts({ uid });
  const user = await getUser(uid);
  return { posts, user };
};

export default connect()(UserWallPage);
